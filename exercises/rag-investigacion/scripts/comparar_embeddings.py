"""Funciones puras (sin red) del notebook 05_comparar_embeddings_bases.

Troceo del corpus (por tamaño fijo y por estructura Markdown), jsonl de chunks, lectura del golden set y de sus evidencias,
prefijos por modelo, métricas de recuperación y reordenado por reranker y búsqueda híbrida, cada una con su criterio de decisión.
"""
import json
import re
from pathlib import Path

_QWEN3_QUERY = "Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery:"

# Única fuente de los prefijos de cada modelo. `num_ctx` solo lo definen los modelos que lo fijan al embeber.
MODELOS: dict[str, dict] = {
    "minilm": {
        "proveedor": "sentence-transformers",
        "nombre": "all-MiniLM-L6-v2",
        "prefijo_query": "",
        "prefijo_documento": "",
    },
    "bge": {
        "proveedor": "sentence-transformers",
        "nombre": "BAAI/bge-base-en-v1.5",
        "prefijo_query": "Represent this sentence for searching relevant passages: ",
        "prefijo_documento": "",
    },
    "nomic": {
        "proveedor": "ollama",
        "nombre": "nomic-embed-text",
        "prefijo_query": "search_query: ",
        "prefijo_documento": "search_document: ",
    },
    "qwen3_06b": {
        "proveedor": "ollama",
        "nombre": "qwen3-embedding:0.6b",
        "prefijo_query": _QWEN3_QUERY,
        "prefijo_documento": "",
        "num_ctx": 8192,
    },
    "qwen3_8b": {
        "proveedor": "ollama",
        "nombre": "qwen3-embedding:8b",
        "prefijo_query": _QWEN3_QUERY,
        "prefijo_documento": "",
        "num_ctx": 8192,
    },
    "bge_m3": {
        "proveedor": "ollama",
        "nombre": "bge-m3",
        "prefijo_query": "",
        "prefijo_documento": "",
        "num_ctx": 8192,
    },
    "embeddinggemma": {
        "proveedor": "ollama",
        "nombre": "embeddinggemma",
        "prefijo_query": "task: search result | query: ",
        "prefijo_documento": "title: none | text: ",
        "num_ctx": 2048,
    },
    "jina_code": {
        "proveedor": "sentence-transformers",
        "nombre": "jinaai/jina-code-embeddings-1.5b",
        "prefijo_query": "Find the most relevant answer given the following question:\n",
        "prefijo_documento": "Candidate answer:\n",
        "num_ctx": 8192,
    },
}

_ID_PREGUNTA = re.compile(r"^[A-Za-z]\d+$")
_RUTA = re.compile(r"`([^`]+)`")
_ENCABEZADO = re.compile(r"^(#{1,4}) (.*)$")
_CATEGORIA_K_MIN = re.compile(r"^##\s+([A-Za-z])\.\s.*\(k mín\.\s*([^)]+?)\s*\)\s*$")


def trocear_corpus(carpeta: Path, tamano: int = 500, solape: int = 0) -> list[dict]:
    """Trocea cada .md en tramos de `tamano` caracteres, con `solape` caracteres compartidos.

    Cada tramo empieza `tamano - solape` caracteres después del anterior. El último
    tramo de un fichero es el primero que llega a su final. Descarta los tramos que
    solo tienen espacios. Devuelve {"id": int, "fuente": str, "texto": str}, con la
    fuente relativa a `carpeta`.

    Lanza ValueError si `tamano` es menor o igual que 0, o si `solape` es negativo
    o mayor o igual que `tamano`.
    """
    if tamano <= 0:
        raise ValueError(f"tamano debe ser mayor que 0, y es {tamano}")
    if solape < 0 or solape >= tamano:
        raise ValueError(f"solape debe estar entre 0 y tamano - 1 ({tamano - 1}), y es {solape}")
    paso = tamano - solape
    carpeta = Path(carpeta)
    chunks: list[dict] = []
    for ruta in sorted(carpeta.rglob("*.md"), key=lambda p: p.relative_to(carpeta).as_posix()):
        fuente = ruta.relative_to(carpeta).as_posix()
        contenido = ruta.read_text(encoding="utf-8")
        for inicio in range(0, len(contenido), paso):
            texto = contenido[inicio:inicio + tamano]
            if texto.strip():
                chunks.append({"id": len(chunks), "fuente": fuente, "texto": texto})
            if inicio + tamano >= len(contenido):
                break
    return chunks


def _es_valla(linea: str) -> bool:
    return linea.lstrip().startswith("```")


def _secciones(contenido: str) -> list[list[str]]:
    """Parte un fichero en [texto, ruta_titulos] por encabezados # a #### fuera de código."""
    secciones: list[list[str]] = []
    titulos = ["", "", "", ""]
    en_codigo = False
    actual: list[str] = []
    ruta_actual = ""
    for linea in contenido.splitlines(keepends=True):
        if en_codigo:
            actual.append(linea)
            if _es_valla(linea):
                en_codigo = False
            continue
        if _es_valla(linea):
            en_codigo = True
            actual.append(linea)
            continue
        m = _ENCABEZADO.match(linea.rstrip("\r\n"))
        if m:
            if actual:
                secciones.append(["".join(actual), ruta_actual])
            nivel = len(m.group(1))
            titulos[nivel - 1] = m.group(2).replace("`", "").strip()
            for i in range(nivel, 4):
                titulos[i] = ""
            ruta_actual = " > ".join(t for t in titulos if t)
            actual = [linea]
        else:
            actual.append(linea)
    if actual:
        secciones.append(["".join(actual), ruta_actual])
    return secciones


def _bloques(texto: str) -> list[str]:
    """Separa por líneas en blanco, sin cortar bloques de código ni entradas de definición.

    Cada bloque conserva las líneas en blanco que lo siguen.
    """
    lineas = texto.splitlines(keepends=True)
    bloques: list[str] = []
    actual: list[str] = []
    hay_texto = False
    en_codigo = False
    en_def = False
    tras_blanco = False
    for i, linea in enumerate(lineas):
        if en_codigo:
            actual.append(linea)
            if _es_valla(linea):
                en_codigo = False
            continue
        blanco = not linea.strip()
        if en_def:
            if blanco:
                siguiente = next((x for x in lineas[i + 1:] if x.strip()), None)
                if siguiente is not None and siguiente[0] in " \t":
                    actual.append(linea)
                    continue
                en_def = False
            elif linea[0] in " \t:":
                actual.append(linea)
                if _es_valla(linea):
                    en_codigo = True
                continue
            else:
                en_def = False
        if blanco:
            actual.append(linea)
            tras_blanco = True
            continue
        if tras_blanco and hay_texto:
            bloques.append("".join(actual))
            actual = []
        tras_blanco = False
        hay_texto = True
        actual.append(linea)
        if _es_valla(linea):
            en_codigo = True
        elif i + 1 < len(lineas) and lineas[i + 1].startswith(":"):
            en_def = True
    if actual:
        bloques.append("".join(actual))
    return bloques


def _subdividir(texto: str, maximo: int) -> list[str]:
    if len(texto) <= maximo:
        return [texto]
    trozos: list[str] = []
    actual = ""
    for bloque in _bloques(texto):
        if actual and len(actual) + len(bloque) > maximo:
            trozos.append(actual)
            actual = ""
        actual += bloque
    if actual:
        trozos.append(actual)
    return trozos


def trocear_por_estructura(carpeta: Path, maximo: int = 1500, minimo: int = 200) -> list[dict]:
    """Trocea cada .md por encabezados # a #### (fuera de bloques de código), sin solape.

    Une las secciones menores que `minimo` con la siguiente del mismo fichero (la última,
    con la anterior) y subdivide las mayores que `maximo` por líneas en blanco, sin cortar
    bloques de código ni entradas de definición. Devuelve {"id", "fuente", "texto",
    "ruta_titulos"}; el texto es el original y concatenado reproduce el fichero.

    Lanza ValueError si `maximo` es menor o igual que 0, si `minimo` es negativo o si
    `minimo` es mayor o igual que `maximo`.
    """
    if maximo <= 0:
        raise ValueError(f"maximo debe ser mayor que 0, y es {maximo}")
    if minimo < 0:
        raise ValueError(f"minimo no puede ser negativo, y es {minimo}")
    if minimo >= maximo:
        raise ValueError(f"minimo debe ser menor que maximo ({maximo}), y es {minimo}")
    carpeta = Path(carpeta)
    chunks: list[dict] = []
    for ruta in sorted(carpeta.rglob("*.md"), key=lambda p: p.relative_to(carpeta).as_posix()):
        fuente = ruta.relative_to(carpeta).as_posix()
        fusion: list[list[str]] = []
        pendiente: list[str] | None = None
        for texto, titulos in _secciones(ruta.read_text(encoding="utf-8")):
            if pendiente is None:
                pendiente = [texto, titulos]
            else:
                pendiente[0] += texto
            if len(pendiente[0]) >= minimo and pendiente[0].strip():
                fusion.append(pendiente)
                pendiente = None
        if pendiente is not None:
            if fusion:
                fusion[-1][0] += pendiente[0]
            elif pendiente[0].strip():
                fusion.append(pendiente)
        for texto, titulos in fusion:
            for trozo in _subdividir(texto, maximo):
                chunks.append(
                    {"id": len(chunks), "fuente": fuente, "texto": trozo, "ruta_titulos": titulos}
                )
    return chunks


# --- Issue #22: troceo con límite ---

_DEF_LINEA = re.compile(r"^\s*:(\s|$)")


def _es_valla_ext(linea: str) -> bool:
    """Como `_es_valla`, y también reconoce la valla detrás de `:` y espacios (`:   ```)."""
    s = linea.lstrip()
    if s.startswith(":"):
        s = s[1:].lstrip()
    return s.startswith("```")


def _es_def_linea(linea: str) -> bool:
    return bool(_DEF_LINEA.match(linea))


def _sangria(linea: str) -> int:
    return len(linea) - len(linea.lstrip(" \t"))


def _con_salto(linea: str) -> str:
    return linea if linea.endswith("\n") else linea + "\n"


def _secciones_ext(contenido: str) -> list[list[str]]:
    """Como `_secciones`, con `_es_valla_ext`: [texto, ruta_titulos, linea_encabezado]."""
    secciones: list[list[str]] = []
    titulos = ["", "", "", ""]
    en_codigo = False
    actual: list[str] = []
    ruta_actual = ""
    encabezado = ""
    for linea in contenido.splitlines(keepends=True):
        if en_codigo:
            actual.append(linea)
            if _es_valla_ext(linea):
                en_codigo = False
            continue
        if _es_valla_ext(linea):
            en_codigo = True
            actual.append(linea)
            continue
        m = _ENCABEZADO.match(linea.rstrip("\r\n"))
        if m:
            if actual:
                secciones.append(["".join(actual), ruta_actual, encabezado])
            nivel = len(m.group(1))
            titulos[nivel - 1] = m.group(2).replace("`", "").strip()
            for i in range(nivel, 4):
                titulos[i] = ""
            ruta_actual = " > ".join(t for t in titulos if t)
            encabezado = _con_salto(linea)
            actual = [linea]
        else:
            actual.append(linea)
    if actual:
        secciones.append(["".join(actual), ruta_actual, encabezado])
    return secciones


def _es_separador_tabla(linea: str) -> bool:
    s = linea.strip()
    return s.startswith("|") and "-" in s and not s.strip("|:- \t")


def _empieza_definicion(lineas: list[str], i: int) -> bool:
    return (
        i + 1 < len(lineas)
        and bool(lineas[i].strip())
        and not _es_def_linea(lineas[i])
        and _es_def_linea(lineas[i + 1])
        and _sangria(lineas[i + 1]) == _sangria(lineas[i])
    )


def _sigue_definicion(linea: str, sangria: int) -> bool:
    s = _sangria(linea)
    return s > sangria or (s == sangria and _es_def_linea(linea))


def _unidades(lineas: list[str]) -> list[tuple[str, list[str]]]:
    """Parte líneas en unidades (tipo, líneas): encabezado, codigo, tabla, definicion, parrafo.

    Cada unidad conserva las líneas en blanco que la siguen; concatenadas reproducen la entrada.
    """
    unidades: list[tuple[str, list[str]]] = []
    n = len(lineas)
    i = 0
    while i < n:
        j = i
        while j < n and not lineas[j].strip():
            j += 1
        if j == n:
            if unidades:
                unidades[-1][1].extend(lineas[i:n])
            else:
                unidades.append(("parrafo", lineas[i:n]))
            break
        linea = lineas[j]
        if _ENCABEZADO.match(linea.rstrip("\r\n")):
            tipo, fin = "encabezado", j + 1
        elif _es_valla_ext(linea):
            tipo, fin = "codigo", j + 1
            while fin < n and not _es_valla_ext(lineas[fin]):
                fin += 1
            fin = min(fin + 1, n)
        elif linea.lstrip().startswith("|"):
            fin = j
            while fin < n and lineas[fin].lstrip().startswith("|"):
                fin += 1
            es_tabla = fin - j >= 2 and _es_separador_tabla(lineas[j + 1])
            tipo = "tabla" if es_tabla else "parrafo"
        elif _empieza_definicion(lineas, j):
            tipo = "definicion"
            sangria = _sangria(linea)
            fin = j + 1
            en_codigo = False
            while fin < n:
                x = lineas[fin]
                if en_codigo:
                    if _es_valla_ext(x):
                        en_codigo = False
                    fin += 1
                    continue
                if not x.strip():
                    m = fin + 1
                    while m < n and not lineas[m].strip():
                        m += 1
                    if m < n and _sigue_definicion(lineas[m], sangria):
                        fin += 1
                        continue
                    break
                if not _sigue_definicion(x, sangria):
                    break
                if _es_valla_ext(x):
                    en_codigo = True
                fin += 1
        else:
            tipo = "parrafo"
            fin = j + 1
            while fin < n and lineas[fin].strip():
                x = lineas[fin]
                if (
                    _es_valla_ext(x)
                    or _ENCABEZADO.match(x.rstrip("\r\n"))
                    or _empieza_definicion(lineas, fin)
                ):
                    break
                fin += 1
        while fin < n and not lineas[fin].strip():
            fin += 1
        unidades.append((tipo, lineas[i:fin]))
        i = fin
    return unidades


def _inicios_miembros(lineas: list[str]) -> list[int]:
    """Índices de las líneas de término de los miembros anidados de una entrada de definición."""
    sangria = _sangria(lineas[0])
    candidatos: list[tuple[int, int]] = []
    en_codigo = False
    for i in range(1, len(lineas) - 1):
        linea = lineas[i]
        if en_codigo:
            if _es_valla_ext(linea):
                en_codigo = False
            continue
        if _es_valla_ext(linea):
            en_codigo = True
            continue
        if not linea.strip() or _es_def_linea(linea):
            continue
        s = _sangria(linea)
        if s > sangria and _es_def_linea(lineas[i + 1]) and _sangria(lineas[i + 1]) == s:
            candidatos.append((i, s))
    if not candidatos:
        return []
    minima = min(s for _, s in candidatos)
    return [i for i, s in candidatos if s == minima]


# Contexto: lista de (etiqueta, texto). Etiquetas: "h" encabezado de la sección, "d" término de
# una entrada de definición, "t" cabecera y separación de una tabla, "r" reserva de espacio para
# un encabezado que debe ir con el bloque siguiente (cuenta en el presupuesto, no se guarda).


def _ctx_str(ctx: list[tuple[str, str]]) -> str:
    return "".join(t for _, t in ctx)


def _recortar(ctx: list[tuple[str, str]], maximo: int, necesidad: int) -> list[tuple[str, str]]:
    """Quita contexto (tablas, luego entradas de la más externa a la más interna, luego el
    encabezado) hasta que contexto + `necesidad` cabe en `maximo`."""
    ctx = list(ctx)
    for etiqueta in ("t", "d", "h", "r"):
        while len(_ctx_str(ctx)) + necesidad > maximo:
            idx = next((i for i, (e, _) in enumerate(ctx) if e == etiqueta), None)
            if idx is None:
                break
            del ctx[idx]
    return ctx


def _pieza(ctx: list[tuple[str, str]], frag: str, enc: bool = False, cod: bool = False) -> dict:
    return {"ctx": [c for c in ctx if c[0] != "r"], "frag": frag, "enc": enc, "cod": cod}


def _partir_lineas(lineas: list[str], ctx: list[tuple[str, str]], maximo: int) -> list[dict]:
    """Una pieza por línea; una línea que no cabe se corta en el último espacio antes del límite."""
    limite = max(1, maximo - len(_ctx_str(ctx)))
    piezas = []
    for linea in lineas:
        resto = linea
        while len(resto) > limite:
            pos = resto.rfind(" ", 0, limite)
            corte = pos + 1 if pos > 0 else limite
            piezas.append(_pieza(ctx, resto[:corte]))
            resto = resto[corte:]
        piezas.append(_pieza(ctx, resto))
    return piezas


def _piezas_texto(
    texto: str, ctx: list[tuple[str, str]], maximo: int, enc: bool = False
) -> list[dict]:
    if len(_ctx_str(ctx)) + len(texto) <= maximo:
        return [_pieza(ctx, texto, enc=enc)]
    return _partir_lineas(texto.splitlines(keepends=True), ctx, maximo)


def _partir_tabla(lineas: list[str], ctx: list[tuple[str, str]], maximo: int) -> list[dict]:
    cabecera = _con_salto(lineas[0]) + lineas[1]
    ctx_t = _recortar(ctx + [("t", cabecera)], maximo, maximo // 2)
    piezas = _piezas_texto(cabecera, ctx, maximo, enc=True)
    filas: list[str] = []
    for linea in lineas[2:]:
        if not linea.strip() and filas:
            filas[-1] += linea
        else:
            filas.append(linea)
    for fila in filas:
        piezas.extend(_piezas_texto(fila, ctx_t, maximo))
    return piezas


def _partir_definicion(lineas: list[str], ctx: list[tuple[str, str]], maximo: int) -> list[dict]:
    termino = lineas[0]
    ctx_int = _recortar(ctx + [("d", _con_salto(termino))], maximo, maximo // 2)
    piezas = _piezas_texto(termino, ctx, maximo, enc=True)
    inicios = _inicios_miembros(lineas)
    if not inicios:
        piezas.extend(_piezas_region(lineas[1:], ctx_int, maximo))
        return piezas
    piezas.extend(_piezas_region(lineas[1:inicios[0]], ctx_int, maximo))
    for a, b in zip(inicios, inicios[1:] + [len(lineas)]):
        piezas.extend(_piezas_unidad("definicion", lineas[a:b], ctx_int, maximo))
    return piezas


def _piezas_unidad(
    tipo: str, lineas: list[str], ctx: list[tuple[str, str]], maximo: int
) -> list[dict]:
    texto = "".join(lineas)
    if tipo == "codigo":
        sin_reserva = [c for c in ctx if c[0] != "r"]
        if len(_ctx_str(sin_reserva)) + len(texto) <= maximo:
            return [_pieza(ctx, texto)]
        return [_pieza(_recortar(sin_reserva, maximo, len(texto)), texto, cod=True)]
    if len(_ctx_str(ctx)) + len(texto) <= maximo:
        return [_pieza(ctx, texto, enc=tipo == "encabezado")]
    if tipo == "tabla":
        return _partir_tabla(lineas, ctx, maximo)
    if tipo == "definicion":
        return _partir_definicion(lineas, ctx, maximo)
    return _partir_lineas(lineas, ctx, maximo)


def _piezas_region(
    lineas: list[str],
    ctx: list[tuple[str, str]],
    maximo: int,
    sin_ctx_primero: bool = False,
) -> list[dict]:
    piezas: list[dict] = []
    reserva = ""
    for idx, (tipo, ls) in enumerate(_unidades(lineas)):
        if sin_ctx_primero and idx == 0:
            c: list[tuple[str, str]] = []
        else:
            c = ctx + [("r", reserva)] if reserva else ctx
        piezas.extend(_piezas_unidad(tipo, ls, c, maximo))
        reserva = "".join(ls) if tipo == "encabezado" else ""
    return piezas


def _nuevo_chunk(piezas: list[dict]) -> dict:
    return {
        "ctx": piezas[0]["ctx"],
        "piezas": piezas,
        "largo": sum(len(p["frag"]) for p in piezas),
        "cod": any(p["cod"] for p in piezas),
    }


def _empaquetar(piezas: list[dict], maximo: int, minimo: int) -> list[tuple[str, str]]:
    """Agrupa piezas consecutivas en chunks de a lo sumo `maximo`: devuelve (contexto, fragmento).

    Un encabezado, un término o una cabecera de tabla no terminan un chunk: pasan al siguiente
    si caben con la pieza que sigue. Un bloque de código que no cabe va solo.
    """
    chunks: list[dict] = []
    actual: dict | None = None
    for p in piezas:
        if (
            actual is not None
            and not p["cod"]
            and not actual["cod"]
            and len(_ctx_str(actual["ctx"])) + actual["largo"] + len(p["frag"]) <= maximo
        ):
            actual["piezas"].append(p)
            actual["largo"] += len(p["frag"])
            continue
        cola: list[dict] = []
        if actual is not None:
            if not p["cod"] and not actual["cod"]:
                k = len(actual["piezas"])
                while k > 0 and actual["piezas"][k - 1]["enc"]:
                    k -= 1
                cola = actual["piezas"][k:]
                if cola:
                    total = len(_ctx_str(cola[0]["ctx"])) + sum(len(x["frag"]) for x in cola)
                    if total + len(p["frag"]) > maximo:
                        cola = []
                if cola:
                    actual["piezas"] = actual["piezas"][:k]
                    actual["largo"] = sum(len(x["frag"]) for x in actual["piezas"])
            if actual["piezas"]:
                chunks.append(actual)
        actual = _nuevo_chunk(cola + [p])
    if actual is not None:
        chunks.append(actual)
    return [(_ctx_str(c["ctx"]), "".join(p["frag"] for p in c["piezas"])) for c in chunks]


def trocear_con_limite(carpeta: Path, maximo: int = 1500, minimo: int = 200) -> list[dict]:
    """Como `trocear_por_estructura`, pero ningún chunk pasa de `maximo` salvo un bloque de código.

    Las secciones y su unión por `minimo` son las mismas. Una sección mayor que `maximo` se parte
    por miembros de entradas de definición, filas de tabla, párrafos y líneas, sin cortar bloques
    de código, y cada trozo que no abre la sección lleva delante su contexto (encabezado, términos
    de las entradas que lo contienen y cabecera de tabla). Devuelve {"id", "fuente", "texto",
    "ruta_titulos", "contexto"}; `texto` es `contexto` más el fragmento original y la
    concatenación de los fragmentos reproduce el fichero.

    Lanza ValueError con las mismas condiciones que `trocear_por_estructura`.
    """
    if maximo <= 0:
        raise ValueError(f"maximo debe ser mayor que 0, y es {maximo}")
    if minimo < 0:
        raise ValueError(f"minimo no puede ser negativo, y es {minimo}")
    if minimo >= maximo:
        raise ValueError(f"minimo debe ser menor que maximo ({maximo}), y es {minimo}")
    carpeta = Path(carpeta)
    chunks: list[dict] = []
    for ruta in sorted(carpeta.rglob("*.md"), key=lambda p: p.relative_to(carpeta).as_posix()):
        fuente = ruta.relative_to(carpeta).as_posix()
        fusion: list[list[str]] = []
        pendiente: list[str] | None = None
        for texto, titulos, encabezado in _secciones_ext(ruta.read_text(encoding="utf-8")):
            if pendiente is None:
                pendiente = [texto, titulos, encabezado]
            else:
                pendiente[0] += texto
            if len(pendiente[0]) >= minimo and pendiente[0].strip():
                fusion.append(pendiente)
                pendiente = None
        if pendiente is not None:
            if fusion:
                fusion[-1][0] += pendiente[0]
            elif pendiente[0].strip():
                fusion.append(pendiente)
        for texto, titulos, encabezado in fusion:
            if len(texto) <= maximo:
                partes = [("", texto)]
            else:
                ctx = _recortar([("h", encabezado)] if encabezado else [], maximo, maximo // 2)
                piezas = _piezas_region(
                    texto.splitlines(keepends=True), ctx, maximo, sin_ctx_primero=True
                )
                partes = _empaquetar(piezas, maximo, minimo)
            for contexto, fragmento in partes:
                chunks.append(
                    {
                        "id": len(chunks),
                        "fuente": fuente,
                        "texto": contexto + fragmento,
                        "ruta_titulos": titulos,
                        "contexto": contexto,
                    }
                )
    return chunks


def es_bloque_de_codigo(fragmento: str) -> bool:
    """True si el fragmento, sin líneas en blanco al principio ni al final, es un único bloque de
    valla a valla (sangrado o detrás de `:   ` incluido)."""
    lineas = fragmento.splitlines()
    while lineas and not lineas[0].strip():
        lineas.pop(0)
    while lineas and not lineas[-1].strip():
        lineas.pop()
    if not lineas or not _es_valla_ext(lineas[0]):
        return False
    vallas = [i for i, x in enumerate(lineas) if _es_valla_ext(x)]
    return len(vallas) == 1 or (len(vallas) == 2 and vallas[1] == len(lineas) - 1)


def texto_a_embeber(chunk: dict, con_ruta: bool) -> str:
    """chunk["texto"], o ruta_titulos + "\\n\\n" + texto si `con_ruta`."""
    if con_ruta:
        return chunk["ruta_titulos"] + "\n\n" + chunk["texto"]
    return chunk["texto"]


def guardar_jsonl(chunks: list[dict], ruta: Path) -> None:
    ruta = Path(ruta)
    ruta.parent.mkdir(parents=True, exist_ok=True)
    with ruta.open("w", encoding="utf-8") as f:
        for chunk in chunks:
            f.write(json.dumps(chunk, ensure_ascii=False) + "\n")


def leer_jsonl(ruta: Path) -> list[dict]:
    with Path(ruta).open(encoding="utf-8") as f:
        return [json.loads(linea) for linea in f if linea.strip()]


def _celdas(linea: str) -> list[str]:
    return [c.strip() for c in linea.strip().strip("|").split("|")]


def leer_golden_set(ruta: Path) -> list[dict]:
    """Lee las preguntas de las tablas del golden set.

    Devuelve {"id", "categoria", "query", "fuentes"}. Las columnas se localizan por
    el nombre de la cabecera (`ID`, `Query (EN)`, `Fuente`/`Fuentes`). Una fila sin
    query o con un ID que no es letra más dígitos no cuenta como pregunta.
    """
    preguntas: list[dict] = []
    cabecera: list[str] | None = None
    for linea in Path(ruta).read_text(encoding="utf-8").splitlines():
        if not linea.lstrip().startswith("|"):
            cabecera = None
            continue
        celdas = _celdas(linea)
        if cabecera is None:
            cabecera = celdas
            continue
        if set("".join(celdas)) <= set("-: "):  # fila separadora
            continue
        if "ID" not in cabecera or "Query (EN)" not in cabecera:
            continue
        fila = dict(zip(cabecera, celdas))
        id_ = fila.get("ID", "")
        query = fila.get("Query (EN)", "").replace("`", "").strip()
        if not _ID_PREGUNTA.match(id_) or not query:
            continue
        celda_fuentes = fila.get("Fuentes", fila.get("Fuente", ""))
        fuentes = [
            r[:-5] + ".md" if r.endswith(".html") else r
            for r in _RUTA.findall(celda_fuentes)
        ]
        preguntas.append({
            "id": id_,
            "categoria": id_[0].upper(),
            "query": query,
            "fuentes": fuentes,
        })
    return preguntas


def fuentes_ausentes(preguntas: list[dict], carpeta: Path) -> list[tuple[str, str]]:
    """Pares (ID, ruta) cuya fuente no existe en el corpus."""
    carpeta = Path(carpeta)
    return [
        (p["id"], fuente)
        for p in preguntas
        for fuente in p["fuentes"]
        if not (carpeta / fuente).is_file()
    ]


def leer_k_minimo(ruta: Path) -> dict[str, str]:
    """Lee el «k mín.» de los títulos de categoría `## X. … (k mín. N)`: {letra: texto de N}.

    El valor se conserva como texto («1-2»). Las categorías sin «k mín.» no aparecen.
    """
    resultado: dict[str, str] = {}
    for linea in Path(ruta).read_text(encoding="utf-8").splitlines():
        m = _CATEGORIA_K_MIN.match(linea.rstrip())
        if m:
            resultado[m.group(1)] = m.group(2)
    return resultado


def leer_evidencias(ruta: Path) -> dict[str, dict[str, list[str]]]:
    """Lee el json de evidencias: {ID: {fuente: [subcadena, ...]}}. Ignora las claves que empiezan por `_`."""
    datos = json.loads(Path(ruta).read_text(encoding="utf-8"))
    evidencias = {id_: valor for id_, valor in datos.items() if not id_.startswith("_")}
    for id_, por_fuente in evidencias.items():
        for fuente, subcadenas in por_fuente.items():
            if not isinstance(subcadenas, list):
                raise ValueError(
                    f"Evidencias de {id_} / {fuente}: se esperaba una lista de subcadenas"
                )
            if not subcadenas or not all(
                isinstance(s, str) and s for s in subcadenas
            ):
                raise ValueError(
                    f"Evidencias de {id_} / {fuente}: la lista debe tener subcadenas no vacías"
                )
    return evidencias


def evidencias_fuera_de_chunks(
    evidencias: dict[str, dict[str, list[str]]], chunks: list[dict]
) -> list[tuple[str, str]]:
    """Pares (ID, fuente), una vez cada uno, con alguna subcadena que no cabe entera en ningún chunk de esa fuente."""
    textos: dict[str, list[str]] = {}
    for chunk in chunks:
        textos.setdefault(chunk["fuente"], []).append(chunk["texto"])
    return [
        (id_, fuente)
        for id_, por_fuente in evidencias.items()
        for fuente, subcadenas in por_fuente.items()
        if any(
            not any(subcadena in texto for texto in textos.get(fuente, []))
            for subcadena in subcadenas
        )
    ]


def preparar_query(modelo: str, texto: str) -> str:
    return MODELOS[modelo]["prefijo_query"] + texto


def preparar_documento(modelo: str, texto: str) -> str:
    return MODELOS[modelo]["prefijo_documento"] + texto


def rango_primer_acierto(recuperadas: list[str], esperadas: list[str]) -> int | None:
    """Posición (desde 1) del primer resultado cuya fuente está entre las esperadas."""
    for posicion, fuente in enumerate(recuperadas, start=1):
        if fuente in esperadas:
            return posicion
    return None


def rango_primer_acierto_evidencia(
    recuperados: list[dict], evidencias: dict[str, list[str]]
) -> int | None:
    """Posición (desde 1) del primer chunk de una fuente esperada que contiene alguna de sus evidencias.

    `recuperados` son {"fuente", "texto"}; `evidencias` es {fuente: [subcadena, ...]}.
    """
    for posicion, chunk in enumerate(recuperados, start=1):
        subcadenas = evidencias.get(chunk["fuente"])
        if subcadenas is not None and any(s in chunk["texto"] for s in subcadenas):
            return posicion
    return None


def calcular_metricas(rangos: list[int | None], k: int = 4) -> dict:
    """hit@1, hit@k y MRR@k a partir de los rangos del primer acierto."""
    n = len(rangos)
    if n == 0:
        return {"hit@1": 0.0, f"hit@{k}": 0.0, "mrr": 0.0}
    en_k = [r for r in rangos if r is not None and r <= k]
    return {
        "hit@1": sum(1 for r in en_k if r == 1) / n,
        f"hit@{k}": len(en_k) / n,
        "mrr": sum(1 / r for r in en_k) / n,
    }


def reordenar_por_score(candidatos: list[dict], scores: list[float], k: int) -> list[dict]:
    """Los `k` candidatos de mayor score; en los empates conserva el orden de la búsqueda."""
    if k < 1:
        raise ValueError(f"k debe ser al menos 1, y es {k}")
    if len(scores) != len(candidatos):
        raise ValueError(
            f"hay {len(scores)} scores para {len(candidatos)} candidatos"
        )
    pares = sorted(zip(candidatos, scores), key=lambda par: par[1], reverse=True)
    return [candidato for candidato, _ in pares[:k]]


def elegir_reranker(
    referencia: dict,
    opciones: list[dict],
    mejora_minima: int,
    latencia_maxima_ms: float,
) -> tuple[list[dict], str | None]:
    """Aplica el criterio de decisión sobre aciertos contados.

    `referencia` es {"ev_aciertos", "aciertos"}; cada opción trae además "nombre" y "latencia_ms"
    (latencia de reranking media). Devuelve una fila por opción y el nombre del ganador, o None.
    """
    filas = []
    for opcion in opciones:
        mejora = opcion["ev_aciertos"] - referencia["ev_aciertos"]
        fuente_no_baja = opcion["aciertos"] >= referencia["aciertos"]
        latencia_ok = opcion["latencia_ms"] < latencia_maxima_ms
        filas.append(
            {
                "nombre": opcion["nombre"],
                "mejora_ev": mejora,
                "fuente_no_baja": fuente_no_baja,
                "latencia_ok": latencia_ok,
                "cumple": mejora >= mejora_minima and fuente_no_baja and latencia_ok,
            }
        )
    por_nombre = {opcion["nombre"]: opcion for opcion in opciones}
    cumplen = [por_nombre[fila["nombre"]] for fila in filas if fila["cumple"]]
    if not cumplen:
        return filas, None
    ganador = min(cumplen, key=lambda o: (-o["ev_aciertos"], o["latencia_ms"]))
    return filas, ganador["nombre"]


def evaluar_hibrida(
    referencia: dict,
    hibrida: dict,
    mejora_minima: int,
    latencia_anadida_maxima_ms: float,
) -> dict:
    """Aplica el criterio de decisión de la búsqueda híbrida sobre aciertos contados.

    Las dos entradas son {"ev_aciertos", "aciertos", "ev_aciertos_b", "busqueda_ms"}: aciertos
    ev_hit@4, hit@4 por fuente, ev_hit@4 de la categoría B y latencia media de búsqueda.
    `referencia` es la vectorial con reranking. Cumple si mejora ev_hit@4 en total o en B
    en al menos `mejora_minima`, no baja el hit@4 por fuente y la latencia añadida
    es menor que `latencia_anadida_maxima_ms`.
    """
    mejora_ev = hibrida["ev_aciertos"] - referencia["ev_aciertos"]
    mejora_ev_b = hibrida["ev_aciertos_b"] - referencia["ev_aciertos_b"]
    fuente_no_baja = hibrida["aciertos"] >= referencia["aciertos"]
    latencia_anadida_ms = hibrida["busqueda_ms"] - referencia["busqueda_ms"]
    latencia_ok = latencia_anadida_ms < latencia_anadida_maxima_ms
    return {
        "mejora_ev": mejora_ev,
        "mejora_ev_b": mejora_ev_b,
        "fuente_no_baja": fuente_no_baja,
        "latencia_anadida_ms": latencia_anadida_ms,
        "latencia_ok": latencia_ok,
        "cumple": (mejora_ev >= mejora_minima or mejora_ev_b >= mejora_minima)
        and fuente_no_baja
        and latencia_ok,
    }
