"""Metadatos de cada chunk calculados del propio corpus, sin LLM ni red (issue #26).

Seis metadatos por chunk: `modulo`, `tipo_pagina`, `simbolos`, `deprecated`, `added_in` y
`tiene_codigo`. Todo son funciones puras sobre texto y ficheros del corpus.
"""
from __future__ import annotations

import re
from pathlib import Path

from comparar_embeddings import _es_def_linea, _es_valla_ext, _sangria

_MODULO_EN_ENCABEZADO = re.compile(r"^#\s+`([^`]+)`")
_ESCAPE = re.compile(r"\\(.)", re.DOTALL)
_DEPRECATED = re.compile(r"^\s*Deprecated since version")
_ADDED_IN = re.compile(r"^\s*Added in version (\d+(?:\.\d+)+)")


def _sin_escapes(texto: str) -> str:
    return _ESCAPE.sub(r"\1", texto)


def _modulo_del_encabezado(contenido: str) -> str:
    """Nombre entre comillas invertidas con el que empieza el primer encabezado `# `, o ""."""
    for linea in contenido.splitlines():
        if linea.startswith("# "):
            m = _MODULO_EN_ENCABEZADO.match(linea)
            return _sin_escapes(m.group(1)).strip() if m else ""
    return ""


def tipo_pagina(fuente: str) -> str:
    """Primera carpeta de `fuente`; cadena vacía si no tiene carpeta."""
    partes = fuente.split("/")
    return partes[0] if len(partes) > 1 else ""


def modulo_de_fichero(carpeta: Path, fuente: str) -> str:
    """Módulo de Python que documenta el fichero `fuente` (ruta relativa a `carpeta`).

    Es el nombre entre comillas invertidas del primer encabezado `# `. Si no lo hay y el
    fichero es `library/<base>-<resto>.md`, el de `library/<base>.md`. En el resto, "".
    """
    carpeta = Path(carpeta)
    ruta = carpeta / fuente
    if not ruta.is_file():
        return ""
    modulo = _modulo_del_encabezado(ruta.read_text(encoding="utf-8"))
    if modulo:
        return modulo
    m = re.fullmatch(r"library/([^/-]+)-[^/]+\.md", fuente)
    if m:
        base = carpeta / "library" / f"{m.group(1)}.md"
        if base.is_file():
            return _modulo_del_encabezado(base.read_text(encoding="utf-8"))
    return ""


def _nombre_de_termino(linea: str) -> str:
    """Palabra justo antes del primer `(`, o la última palabra; sin barras de escape."""
    texto = linea.strip()
    if "(" in texto:
        texto = texto.split("(", 1)[0]
    palabras = _sin_escapes(texto).split()
    return palabras[-1] if palabras else ""


def simbolos_de_fichero(contenido: str) -> list[tuple[int, str]]:
    """Términos de definición del fichero entero: (desplazamiento de la línea, nombre).

    Un término es una línea seguida de una línea `:   ` con la misma sangría, fuera de
    bloques de código. Un término anidado en otra entrada se cualifica con el nombre de su
    padre, aunque el padre quede en otro chunk.
    """
    lineas = contenido.splitlines(keepends=True)
    resultado: list[tuple[int, str]] = []
    pila: list[tuple[int, str]] = []  # (sangría, nombre cualificado)
    en_codigo = False
    desplazamiento = 0
    for i, linea in enumerate(lineas):
        inicio = desplazamiento
        desplazamiento += len(linea)
        if _es_valla_ext(linea):
            en_codigo = not en_codigo
            continue
        if en_codigo or not linea.strip() or _es_def_linea(linea):
            continue
        sangria = _sangria(linea)
        while pila and pila[-1][0] >= sangria:
            pila.pop()
        if (
            i + 1 < len(lineas)
            and _es_def_linea(lineas[i + 1])
            and _sangria(lineas[i + 1]) == sangria
        ):
            nombre = _nombre_de_termino(linea)
            if not nombre:
                continue
            if pila and not nombre.startswith(pila[-1][1] + "."):
                nombre = f"{pila[-1][1]}.{nombre}"
            pila.append((sangria, nombre))
            resultado.append((inicio, nombre))
    return resultado


def deprecated(texto: str) -> bool:
    """True si alguna línea empieza (sin sangría) por «Deprecated since version»."""
    return any(_DEPRECATED.match(linea) for linea in texto.splitlines())


def added_in(texto: str) -> list[str]:
    """Versiones de las líneas «Added in version X.Y», sin repetidos y en orden."""
    versiones: list[str] = []
    for linea in texto.splitlines():
        m = _ADDED_IN.match(linea)
        if m and m.group(1) not in versiones:
            versiones.append(m.group(1))
    return versiones


def tiene_codigo(texto: str) -> bool:
    """True si el texto contiene al menos una valla de código."""
    return any(_es_valla_ext(linea) for linea in texto.splitlines())


def metadatos_chunks(carpeta: Path, chunks: list[dict]) -> dict[int, dict]:
    """Calcula los seis metadatos de cada chunk: {id: {...}}.

    Los chunks de una fuente, en orden de `id`, concatenados reproducen el fichero; así se
    sabe el desplazamiento de cada uno. Lanza ValueError si no lo reproducen.
    """
    carpeta = Path(carpeta)
    por_fuente: dict[str, list[dict]] = {}
    for chunk in chunks:
        por_fuente.setdefault(chunk["fuente"], []).append(chunk)
    resultado: dict[int, dict] = {}
    for fuente, grupo in por_fuente.items():
        grupo = sorted(grupo, key=lambda c: c["id"])
        contenido = (carpeta / fuente).read_text(encoding="utf-8")
        if "".join(c["texto"] for c in grupo) != contenido:
            raise ValueError(f"Los chunks de {fuente} no reproducen el fichero")
        simbolos = simbolos_de_fichero(contenido)
        modulo = modulo_de_fichero(carpeta, fuente)
        tipo = tipo_pagina(fuente)
        inicio = 0
        for chunk in grupo:
            fin = inicio + len(chunk["texto"])
            nombres: list[str] = []
            for pos, nombre in simbolos:
                if inicio <= pos < fin and nombre not in nombres:
                    nombres.append(nombre)
            resultado[chunk["id"]] = {
                "modulo": modulo,
                "tipo_pagina": tipo,
                "simbolos": nombres,
                "deprecated": deprecated(chunk["texto"]),
                "added_in": added_in(chunk["texto"]),
                "tiene_codigo": tiene_codigo(chunk["texto"]),
            }
            inicio = fin
    return resultado
