"""Tests de scripts/comparar_embeddings.py (escenarios 1-8 de la issue #5, 1-5 de la #7 y 1-9 de la #11)."""
import csv
import json
import shutil
from pathlib import Path

import pytest

import comparar_embeddings as ce

RAIZ = Path(__file__).resolve().parent.parent
GOLDEN = RAIZ / "docs" / "GOLDEN_SET_PYTHON_DOCS.md"
EVIDENCIAS = RAIZ / "docs" / "golden_set_evidencias.json"
VALIDACION = RAIZ / "data" / "resultados" / "validacion_final.csv"
CORPUS = RAIZ / "data" / "python-docs-3.15" / "python-3.15-docs-md-clean"


def test_trocea_en_tramos_de_500(tmp_path):
    (tmp_path / "sub").mkdir()
    (tmp_path / "sub" / "a.md").write_text("x" * 1200, encoding="utf-8")
    chunks = ce.trocear_corpus(tmp_path, 500)
    assert [len(c["texto"]) for c in chunks] == [500, 500, 200]
    assert {c["fuente"] for c in chunks} == {"sub/a.md"}
    assert len({c["id"] for c in chunks}) == 3


def test_descarta_tramos_en_blanco(tmp_path):
    (tmp_path / "a.md").write_text("x" * 500 + " \n" * 250, encoding="utf-8")
    chunks = ce.trocear_corpus(tmp_path, 500)
    assert len(chunks) == 1
    assert chunks[0]["texto"] == "x" * 500


def test_jsonl_ida_y_vuelta(tmp_path):
    chunks = [
        {"id": 0, "fuente": "a.md", "texto": "hola ñ\ncon salto"},
        {"id": 1, "fuente": "sub/b.md", "texto": "texto \"con comillas\""},
    ]
    ruta = tmp_path / "out" / "c.jsonl"
    ce.guardar_jsonl(chunks, ruta)
    assert ce.leer_jsonl(ruta) == chunks


def test_lee_golden_set_real():
    preguntas = ce.leer_golden_set(GOLDEN)
    assert len(preguntas) == 35
    por_cat = {}
    for p in preguntas:
        por_cat[p["categoria"]] = por_cat.get(p["categoria"], 0) + 1
    assert por_cat == {"A": 10, "B": 10, "C": 9, "D": 3, "E": 3}
    por_id = {p["id"]: p for p in preguntas}
    assert por_id["A01"]["fuentes"] == ["library/http.client.md"]
    assert set(por_id["D01"]["fuentes"]) == {"library/subprocess.md", "library/json.md"}
    assert all(p["fuentes"] == [] for p in preguntas if p["categoria"] == "E")
    assert all("`" not in p["query"] for p in preguntas)


def test_fila_nueva_se_incluye(tmp_path):
    copia = tmp_path / "golden.md"
    lineas = GOLDEN.read_text(encoding="utf-8").splitlines()
    salida = []
    for i, linea in enumerate(lineas):
        salida.append(linea)
        if linea.startswith("| A10 |"):
            salida.append("| A11 | A new `query` here? | resp | evid | `library/re.html` |")
    copia.write_text("\n".join(salida), encoding="utf-8")
    preguntas = ce.leer_golden_set(copia)
    assert len(preguntas) == 36
    a11 = next(p for p in preguntas if p["id"] == "A11")
    assert a11["query"] == "A new query here?"
    assert a11["fuentes"] == ["library/re.md"]


def test_rango_primer_acierto():
    assert ce.rango_primer_acierto(["x.md", "y.md", "a.md", "a.md"], ["a.md", "b.md"]) == 3
    assert ce.rango_primer_acierto(["x.md", "y.md", "z.md", "w.md"], ["a.md", "b.md"]) is None


def test_evidencias_coinciden_con_golden_set():
    """Cada pregunta con fuentes tiene evidencia para cada una de sus fuentes, y nada más."""
    evidencias = ce.leer_evidencias(EVIDENCIAS)
    esperado = {p["id"]: set(p["fuentes"]) for p in ce.leer_golden_set(GOLDEN) if p["fuentes"]}
    assert {id_: set(d) for id_, d in evidencias.items()} == esperado


def test_evidencias_caben_en_chunks_de_500():
    evidencias = ce.leer_evidencias(EVIDENCIAS)
    fuentes = {f for d in evidencias.values() for f in d}
    chunks = [c for c in ce.trocear_corpus(CORPUS, 500) if c["fuente"] in fuentes]
    assert ce.evidencias_fuera_de_chunks(evidencias, chunks) == []


def test_evidencias_son_listas_no_vacias():
    """Escenario 4: cada valor es una lista no vacía de cadenas no vacías."""
    evidencias = ce.leer_evidencias(EVIDENCIAS)
    assert evidencias
    for id_, por_fuente in evidencias.items():
        for fuente, subcadenas in por_fuente.items():
            assert isinstance(subcadenas, list) and subcadenas, (id_, fuente)
            assert all(isinstance(s, str) and s for s in subcadenas), (id_, fuente)


def test_alternativa_partida_se_detecta():
    """Escenario 3: solo la primera subcadena cabe entera; el par sale una vez."""
    chunks = [{"fuente": "a.md", "texto": "hola mu"}, {"fuente": "a.md", "texto": "ndo hola"}]
    evidencias = {"X01": {"a.md": ["hola", "mundo"]}}
    assert ce.evidencias_fuera_de_chunks(evidencias, chunks) == [("X01", "a.md")]
    assert ce.evidencias_fuera_de_chunks({"X01": {"a.md": ["hola", "ndo"]}}, chunks) == []


def test_rango_primer_acierto_evidencia_con_varias():
    """Escenarios 1 y 2 y CB-03."""
    evidencias = {"a.md": ["clave", "otra"]}
    recuperados = [
        {"fuente": "a.md", "texto": "sin dato"},    # fuente buena sin ninguna
        {"fuente": "x.md", "texto": "clave"},       # fuente equivocada con la primera
        {"fuente": "a.md", "texto": "la otra cosa"},  # fuente buena con la segunda
    ]
    assert ce.rango_primer_acierto_evidencia(recuperados, evidencias) == 3
    assert ce.rango_primer_acierto_evidencia(recuperados[:2], evidencias) is None
    assert ce.rango_primer_acierto_evidencia([recuperados[1]], evidencias) is None


def test_leer_evidencias_rechaza_valores_invalidos(tmp_path):
    """CB-01 y CB-02: valor que no es lista, lista vacía o con cadena vacía."""
    casos = {
        "no lista": {"X01": {"a.md": "cadena"}},
        "lista vacía": {"X01": {"a.md": []}},
        "cadena vacía": {"X01": {"a.md": ["ok", ""]}},
    }
    for nombre, datos in casos.items():
        ruta = tmp_path / "e.json"
        ruta.write_text(json.dumps(datos), encoding="utf-8")
        with pytest.raises(ValueError, match="X01") as error:
            ce.leer_evidencias(ruta)
        assert "a.md" in str(error.value), nombre
    ruta.write_text(json.dumps({"_descripcion": "x", "X01": {"a.md": ["ok"]}}), encoding="utf-8")
    assert ce.leer_evidencias(ruta) == {"X01": {"a.md": ["ok"]}}


_ANTERIOR = {
    "A01": (None, None), "A02": (3, 3), "A03": (3, 3), "A05": (1, 1), "A07": (1, 1),
    "A08": (1, 3), "A09": (1, 1), "B02": (1, 1), "B03": (1, 1), "B04": (2, 2),
    "B05": (2, 2), "B06": (1, 2), "B07": (1, 1), "B09": (1, 1), "B10": (1, 1),
    "C01": (1, None), "C02": (2, 2), "C04": (1, 1), "C05": (2, 2), "C06": (1, 1),
    "C07": (1, 3), "C08": (2, 2), "C09": (1, 2), "D01": (1, 1), "D02": (None, None),
    "D03": (1, None),
}


def test_validacion_final_cuenta_alternativas():
    """Escenario 5: el CSV regenerado cuenta las alternativas y conserva el resto."""
    with open(VALIDACION, encoding="utf-8", newline="") as f:
        filas = {fila["id"]: fila for fila in csv.DictReader(f)}

    def rango(id_, columna):
        valor = filas[id_][columna]
        return int(float(valor)) if valor else None

    for id_ in ("A04", "A06", "A10", "C03"):
        assert rango(id_, "rango evidencia") in (1, 2, 3, 4), id_
    for id_ in ("B01", "B08"):
        assert rango(id_, "rango evidencia") is None, id_
    for id_, (fuente, evidencia) in _ANTERIOR.items():
        assert (rango(id_, "rango fuente"), rango(id_, "rango evidencia")) == (fuente, evidencia), id_


def test_calcula_hit_y_mrr():
    m = ce.calcular_metricas([1, 2, None, 4], k=4)
    assert m["hit@1"] == 0.25
    assert m["hit@4"] == 0.75
    assert abs(m["mrr"] - 0.4375) < 1e-9


def test_prefijos_por_modelo():
    assert ce.preparar_query("minilm", "q") == "q"
    assert ce.preparar_documento("minilm", "c") == "c"
    assert ce.preparar_query("bge", "q") == "Represent this sentence for searching relevant passages: q"
    assert ce.preparar_documento("bge", "c") == "c"
    assert ce.preparar_query("nomic", "q") == "search_query: q"
    assert ce.preparar_documento("nomic", "c") == "search_document: c"


def test_fuentes_ausentes_avisa_con_id_y_ruta(tmp_path):
    """CB-03: una fuente que no existe en el corpus se señala con su ID y su ruta."""
    (tmp_path / "library").mkdir()
    (tmp_path / "library" / "re.md").write_text("x", encoding="utf-8")
    preguntas = [
        {"id": "A1", "fuentes": ["library/re.md"]},
        {"id": "A2", "fuentes": ["library/no_existe.md"]},
    ]
    assert ce.fuentes_ausentes(preguntas, tmp_path) == [("A2", "library/no_existe.md")]


def test_fila_invalida_no_cuenta_como_pregunta(tmp_path):
    """CB-04: una fila sin query o con un ID que no es letra más dígitos se descarta."""
    copia = tmp_path / "golden.md"
    lineas = GOLDEN.read_text(encoding="utf-8").splitlines()
    salida = []
    for linea in lineas:
        salida.append(linea)
        if linea.startswith("| A10 |"):
            salida.append("| A11 |  | resp | evid | `library/re.html` |")
            salida.append("| XX | A query? | resp | evid | `library/re.html` |")
    copia.write_text("\n".join(salida), encoding="utf-8")
    ids = [p["id"] for p in ce.leer_golden_set(copia)]
    assert "A11" not in ids and "XX" not in ids
    assert len(ids) == 35


def _texto_distinto(n: int) -> str:
    """Texto de n caracteres en el que cada posición se puede identificar."""
    return "".join(chr(0x4E00 + i) for i in range(n))


def test_trocea_con_solape(tmp_path):
    texto = _texto_distinto(1200)
    (tmp_path / "a.md").write_text(texto, encoding="utf-8")
    chunks = ce.trocear_corpus(tmp_path, 500, 100)
    assert [c["texto"] for c in chunks] == [texto[0:500], texto[400:900], texto[800:1200]]
    assert [len(c["texto"]) for c in chunks] == [500, 500, 400]
    for anterior, siguiente in zip(chunks, chunks[1:]):
        assert anterior["texto"][-100:] == siguiente["texto"][:100]


def test_solape_sin_tramo_final_redundante(tmp_path):
    texto = _texto_distinto(900)
    (tmp_path / "a.md").write_text(texto, encoding="utf-8")
    chunks = ce.trocear_corpus(tmp_path, 500, 100)
    assert [c["texto"] for c in chunks] == [texto[0:500], texto[400:900]]


def test_solape_ids_consecutivos_varios_ficheros(tmp_path):
    (tmp_path / "a.md").write_text(_texto_distinto(1200), encoding="utf-8")
    (tmp_path / "b.md").write_text(_texto_distinto(900), encoding="utf-8")
    chunks = ce.trocear_corpus(tmp_path, 500, 100)
    assert [c["id"] for c in chunks] == list(range(len(chunks)))
    assert [c["fuente"] for c in chunks] == ["a.md"] * 3 + ["b.md"] * 2


def test_solape_no_parte_mas_evidencias():
    evidencias = ce.leer_evidencias(EVIDENCIAS)
    fuentes = {f for d in evidencias.values() for f in d}
    sin_solape = [c for c in ce.trocear_corpus(CORPUS, 500) if c["fuente"] in fuentes]
    con_solape = [c for c in ce.trocear_corpus(CORPUS, 500, 100) if c["fuente"] in fuentes]
    assert len(ce.evidencias_fuera_de_chunks(evidencias, con_solape)) <= len(
        ce.evidencias_fuera_de_chunks(evidencias, sin_solape)
    )


@pytest.mark.parametrize("tamano, solape", [(500, -1), (500, 500), (500, 600), (0, 0), (-5, 0)])
def test_solape_o_tamano_invalidos(tmp_path, tamano, solape):
    (tmp_path / "a.md").write_text("x" * 1200, encoding="utf-8")
    with pytest.raises(ValueError) as error:
        ce.trocear_corpus(tmp_path, tamano, solape)
    assert str(solape if tamano > 0 else tamano) in str(error.value)


def test_solape_descarta_tramos_en_blanco(tmp_path):
    texto = "x" * 400 + " " * 400 + "y" * 400
    (tmp_path / "a.md").write_text(texto, encoding="utf-8")
    chunks = ce.trocear_corpus(tmp_path, 500, 100)
    assert [c["texto"] for c in chunks] == [texto[0:500], texto[400:900], texto[800:1200]]
    (tmp_path / "a.md").write_text("x" * 400 + " " * 1000 + "y" * 400, encoding="utf-8")
    chunks = ce.trocear_corpus(tmp_path, 500, 100)
    assert all(c["texto"].strip() for c in chunks)
    assert [c["id"] for c in chunks] == list(range(len(chunks)))
    assert len(chunks) == 3  # inicios 0, 400, 800, 1200, 1600: los de 400 y 800 son blancos


# --- Issue #11: troceo por estructura ---


def _md(tmp_path, nombre, texto):
    (tmp_path / nombre).write_text(texto, encoding="utf-8")


def test_estructura_ignora_encabezados_en_codigo(tmp_path):
    texto = "# Título\n\nUn párrafo.\n\n```\n# comentario\nx = 1\n```\n"
    _md(tmp_path, "a.md", texto)
    chunks = ce.trocear_por_estructura(tmp_path, 5000, 0)
    assert len(chunks) == 1
    assert chunks[0]["ruta_titulos"] == "Título"
    assert chunks[0]["texto"] == texto


def test_estructura_subdivide_seccion_grande(tmp_path):
    codigo = "```\n" + "\n".join(f"linea_{i} = {i}" for i in range(10)) + "\n```\n"
    definicion = "termino\n:   explicacion del termino\n\n    segundo parrafo con sangria\n"
    texto = (
        "# T\n\n" + "a" * 300 + "\n\n" + codigo + "\n" + "b" * 300 + "\n\n"
        + definicion + "\n" + "c" * 300 + "\n"
    )
    _md(tmp_path, "a.md", texto)
    chunks = ce.trocear_por_estructura(tmp_path, 400, 0)
    assert len(chunks) > 1
    assert all(len(c["texto"]) <= 400 for c in chunks)
    assert sum(codigo in c["texto"] for c in chunks) == 1
    assert sum(definicion.rstrip("\n") in c["texto"] for c in chunks) == 1


def test_estructura_bloque_indivisible_entero(tmp_path):
    codigo = "```\n" + "x = 1\n" * 100 + "```\n"
    texto = "# T\n\nintro\n\n" + codigo + "\ncierre\n"
    _md(tmp_path, "a.md", texto)
    chunks = ce.trocear_por_estructura(tmp_path, 200, 0)
    grandes = [c for c in chunks if len(c["texto"]) > 200]
    assert len(grandes) == 1
    assert codigo in grandes[0]["texto"]


def test_estructura_une_secciones_cortas(tmp_path):
    _md(tmp_path, "a.md", "# Uno\n\ncorta\n\n## Dos\n\n" + "d" * 300 + "\n")
    _md(tmp_path, "b.md", "# Tres\n\n" + "e" * 300 + "\n\n## Cuatro\n\ncorta final\n")
    chunks = ce.trocear_por_estructura(tmp_path, 1000, 100)
    assert len(chunks) == 2
    a, b = chunks
    assert a["fuente"] == "a.md" and b["fuente"] == "b.md"
    assert a["ruta_titulos"] == "Uno"
    assert "## Dos" in a["texto"] and "# Uno" in a["texto"]
    assert "corta final" in b["texto"] and "e" * 300 in b["texto"]
    assert b["ruta_titulos"] == "Tres"


def test_estructura_no_parte_definiciones(tmp_path):
    definicion = "termino\n:   texto de la definicion\n\n    otro parrafo con sangria\n"
    texto = "# T\n\n" + "a" * 200 + "\n\n" + definicion + "\n" + "b" * 200 + "\n"
    _md(tmp_path, "a.md", texto)
    chunks = ce.trocear_por_estructura(tmp_path, 260, 0)
    assert len(chunks) > 1
    con = [c for c in chunks if "termino\n" in c["texto"]]
    assert len(con) == 1
    assert definicion.rstrip("\n") in con[0]["texto"]


def test_estructura_ruta_titulos(tmp_path):
    texto = (
        "# `string` — Common string operations\n\nx\n\n## String constants\n\ny\n\n"
        "### Sub\n\nz\n\n## Otra\n\nw\n"
    )
    _md(tmp_path, "a.md", texto)
    chunks = ce.trocear_por_estructura(tmp_path, 1000, 0)
    assert [c["ruta_titulos"] for c in chunks] == [
        "string — Common string operations",
        "string — Common string operations > String constants",
        "string — Common string operations > String constants > Sub",
        "string — Common string operations > Otra",
    ]


@pytest.mark.parametrize("maximo,minimo", [(300, 0), (300, 100), (1000, 200), (50, 10)])
def test_estructura_reproduce_fichero(tmp_path, maximo, minimo):
    texto = (
        "previo sin titulo\n\n# A\n\n" + "a" * 200 + "\n\n```\n# c\n" + "k\n" * 80
        + "```\n\n## B\n\ncorto\n\ntermino\n:   def\n\n    mas\n\n### C\n\n" + "c" * 500
        + "\n\n\n\n"
    )
    _md(tmp_path, "a.md", texto)
    _md(tmp_path, "b.md", "# Solo\n\ncorta\n")
    chunks = ce.trocear_por_estructura(tmp_path, maximo, minimo)
    for fuente, esperado in (("a.md", texto), ("b.md", "# Solo\n\ncorta\n")):
        assert "".join(c["texto"] for c in chunks if c["fuente"] == fuente) == esperado
    assert [c["id"] for c in chunks] == list(range(len(chunks)))


def test_texto_a_embeber():
    chunk = {"ruta_titulos": "A > B", "texto": "hola"}
    assert ce.texto_a_embeber(chunk, True) == "A > B\n\nhola"
    assert ce.texto_a_embeber(chunk, False) == "hola"


@pytest.mark.parametrize(
    "maximo,minimo,nombre",
    [(0, 0, "maximo"), (-5, 0, "maximo"), (100, -1, "minimo"), (100, 100, "minimo"), (100, 150, "minimo")],
)
def test_estructura_parametros_invalidos(tmp_path, maximo, minimo, nombre):
    with pytest.raises(ValueError, match=nombre):
        ce.trocear_por_estructura(tmp_path, maximo, minimo)


def test_estructura_casos_de_borde(tmp_path):
    _md(tmp_path, "vacio.md", "  \n\n")
    _md(tmp_path, "abierto.md", "# T\n\n```\n# no es titulo\ncodigo\n")
    _md(tmp_path, "previo.md", "texto previo\n\n# T\n\n" + "z" * 300 + "\n")
    chunks = ce.trocear_por_estructura(tmp_path, 1000, 50)
    assert not [c for c in chunks if c["fuente"] == "vacio.md"]
    abierto = [c for c in chunks if c["fuente"] == "abierto.md"]
    assert len(abierto) == 1 and abierto[0]["ruta_titulos"] == "T"
    previo = [c for c in chunks if c["fuente"] == "previo.md"]
    assert previo[0]["ruta_titulos"] == ""


# --- Issue #9: número de k ---


def test_k_minimo_del_golden_set_real():
    assert ce.leer_k_minimo(GOLDEN) == {"A": "1", "C": "1-2", "D": "2"}


def test_k_minimo_sin_declarar(tmp_path):
    ruta = tmp_path / "golden.md"
    ruta.write_text(
        "## A. Consulta puntual\n\n## B. Términos exactos\n\n## E. Sin respuesta\n",
        encoding="utf-8",
    )
    assert ce.leer_k_minimo(ruta) == {}


@pytest.mark.parametrize(
    "k, hit1, hit_k, mrr",
    [
        (1, 1 / 4, 1 / 4, 1 / 4),
        (2, 1 / 4, 2 / 4, (1 + 1 / 2) / 4),
        (8, 1 / 4, 3 / 4, (1 + 1 / 2 + 1 / 5) / 4),
    ],
)
def test_metricas_con_k_distinto_de_4(k, hit1, hit_k, mrr):
    m = ce.calcular_metricas([1, 2, 5, None], k=k)
    assert m["hit@1"] == pytest.approx(hit1)
    assert m[f"hit@{k}"] == pytest.approx(hit_k)
    assert m["mrr"] == pytest.approx(mrr)


# Issue #13: reranking (escenarios 1-5)

def _candidatos(n):
    return [{"posicion": i} for i in range(1, n + 1)]


def test_reordena_por_score_y_conserva_orden_en_empates():
    salida = ce.reordenar_por_score(_candidatos(5), [0.1, 0.9, 0.5, 0.9, 0.3], 3)
    assert [c["posicion"] for c in salida] == [2, 4, 3]


def test_reordena_con_menos_candidatos_que_k():
    salida = ce.reordenar_por_score(_candidatos(2), [0.2, 0.8], 4)
    assert [c["posicion"] for c in salida] == [2, 1]


def test_reordenar_sin_candidatos_devuelve_vacio():
    assert ce.reordenar_por_score([], [], 4) == []


@pytest.mark.parametrize("scores, k", [([0.1], 2), ([0.1, 0.2, 0.3], 2), ([0.1, 0.2], 0)])
def test_reordenar_lanza_value_error(scores, k):
    with pytest.raises(ValueError):
        ce.reordenar_por_score(_candidatos(2), scores, k)


REFERENCIA = {"ev_aciertos": 19, "aciertos": 29}


def _op(nombre, ev, fuente, ms):
    return {"nombre": nombre, "ev_aciertos": ev, "aciertos": fuente, "latencia_ms": ms}


def test_reranker_que_cumple_el_criterio():
    filas, ganador = ce.elegir_reranker(REFERENCIA, [_op("a", 21, 29, 300)], 2, 500)
    assert filas[0]["cumple"] is True
    assert filas[0]["mejora_ev"] == 2
    assert ganador == "a"


def test_reranker_que_no_cumple_por_cada_condicion():
    opciones = [_op("poca_mejora", 20, 29, 300), _op("baja_fuente", 21, 28, 300), _op("lento", 21, 29, 500)]
    filas, ganador = ce.elegir_reranker(REFERENCIA, opciones, 2, 500)
    por_nombre = {f["nombre"]: f for f in filas}
    assert not any(f["cumple"] for f in filas)
    assert por_nombre["poca_mejora"]["mejora_ev"] == 1
    assert por_nombre["baja_fuente"]["fuente_no_baja"] is False
    assert por_nombre["lento"]["latencia_ok"] is False
    assert ganador is None


def test_gana_el_de_mas_aciertos_por_evidencia():
    _, ganador = ce.elegir_reranker(REFERENCIA, [_op("a", 21, 29, 100), _op("b", 23, 29, 400)], 2, 500)
    assert ganador == "b"


def test_en_empate_gana_el_mas_rapido():
    _, ganador = ce.elegir_reranker(REFERENCIA, [_op("a", 22, 29, 400), _op("b", 22, 30, 200)], 2, 500)
    assert ganador == "b"


def test_sin_opciones_no_hay_ganador():
    assert ce.elegir_reranker(REFERENCIA, [], 2, 500) == ([], None)


# Issue #15: búsqueda híbrida (escenarios 1-4)

REFERENCIA_HIBRIDA = {
    "ev_aciertos": 22,
    "aciertos": 30,
    "ev_aciertos_b": 8,
    "busqueda_ms": 30,
}


def test_hibrida_cumple_por_mejora_total():
    hibrida = {
        "ev_aciertos": 24,
        "aciertos": 30,
        "ev_aciertos_b": 8,
        "busqueda_ms": 90,
    }
    resultado = ce.evaluar_hibrida(REFERENCIA_HIBRIDA, hibrida, 2, 100)
    assert resultado == {
        "mejora_ev": 2,
        "mejora_ev_b": 0,
        "fuente_no_baja": True,
        "latencia_anadida_ms": 60,
        "latencia_ok": True,
        "cumple": True,
    }


def test_hibrida_cumple_por_mejora_en_categoria_b():
    hibrida = {
        "ev_aciertos": 23,
        "aciertos": 30,
        "ev_aciertos_b": 10,
        "busqueda_ms": 50,
    }
    resultado = ce.evaluar_hibrida(REFERENCIA_HIBRIDA, hibrida, 2, 100)
    assert resultado["mejora_ev"] == 1
    assert resultado["mejora_ev_b"] == 2
    assert resultado["cumple"] is True


@pytest.mark.parametrize(
    "hibrida, condicion_que_falla",
    [
        (
            {"ev_aciertos": 23, "aciertos": 30, "ev_aciertos_b": 9, "busqueda_ms": 50},
            "mejora",
        ),
        (
            {"ev_aciertos": 24, "aciertos": 29, "ev_aciertos_b": 8, "busqueda_ms": 50},
            "fuente",
        ),
        (
            {"ev_aciertos": 24, "aciertos": 30, "ev_aciertos_b": 8, "busqueda_ms": 130},
            "latencia",
        ),
    ],
)
def test_hibrida_no_cumple_por_cada_condicion(hibrida, condicion_que_falla):
    resultado = ce.evaluar_hibrida(REFERENCIA_HIBRIDA, hibrida, 2, 100)
    assert resultado["cumple"] is False
    if condicion_que_falla == "mejora":
        assert resultado["mejora_ev"] == 1
        assert resultado["mejora_ev_b"] == 1
    elif condicion_que_falla == "fuente":
        assert resultado["fuente_no_baja"] is False
    else:
        assert resultado["latencia_anadida_ms"] == 100
        assert resultado["latencia_ok"] is False


def test_hibrida_mas_rapida_que_la_referencia():
    hibrida = {
        "ev_aciertos": 24,
        "aciertos": 30,
        "ev_aciertos_b": 8,
        "busqueda_ms": 20,
    }
    resultado = ce.evaluar_hibrida(REFERENCIA_HIBRIDA, hibrida, 2, 100)
    assert resultado["latencia_anadida_ms"] == -10
    assert resultado["latencia_ok"] is True
    assert resultado["cumple"] is True


# --- Issue #22: troceo con límite ---


def _fichero(tmp_path, texto, maximo, minimo=0, nombre="a.md"):
    _md(tmp_path, nombre, texto)
    return [c for c in ce.trocear_con_limite(tmp_path, maximo, minimo) if c["fuente"] == nombre]


def _reproduce(chunks, esperado):
    return "".join(c["texto"][len(c["contexto"]):] for c in chunks) == esperado


def test_limite_parte_definicion_por_miembros(tmp_path):
    nombres = ("atributo", "nivel", "metodo(arg)", "otro(arg)", "ultimo")
    miembros = [f"    {n}\n    :   {'x' * 250} {n}\n" for n in nombres]
    texto = "# Mod\n\nclass x.Clase\n:   Descripción de la clase.\n\n" + "\n".join(miembros)
    chunks = _fichero(tmp_path, texto, 700)
    assert len(chunks) > 1
    for miembro in miembros:
        assert sum(miembro in c["texto"] for c in chunks) == 1
    for c in chunks[1:]:
        assert "# Mod\n" in c["contexto"] and "class x.Clase\n" in c["contexto"]
        fragmento = c["texto"][len(c["contexto"]):]
        assert fragmento.strip().split("\n")[0].strip() in nombres
    assert all(len(c["texto"]) <= 700 for c in chunks)
    assert _reproduce(chunks, texto)


def test_limite_miembro_largo_por_parrafos(tmp_path):
    sangria = " " * 8
    bloque = "".join(sangria + x + "\n" for x in ("```", "x = 1", "y = 2", "```"))
    miembro = (
        "    metodo(arg)\n    :   " + "a" * 250 + "\n\n" + sangria + "b" * 250 + "\n\n"
        + sangria + "c" * 250 + "\n\n" + bloque
    )
    texto = "# Mod\n\nclass x.Clase\n:   Descripción.\n\n" + miembro
    chunks = _fichero(tmp_path, texto, 600)
    assert len(chunks) > 1
    assert sum(bloque in c["texto"] for c in chunks) == 1
    assert all(len(c["texto"]) <= 600 for c in chunks)
    con_miembro = [
        c for c in chunks
        if "class x.Clase\n" in c["contexto"] and "    metodo(arg)\n" in c["contexto"]
    ]
    assert con_miembro
    assert _reproduce(chunks, texto)


def test_limite_parte_tabla_con_cabecera(tmp_path):
    filas = [f"| {i} | descripcion de la fila {i} {'z' * 40} |\n" for i in range(30)]
    cabecera = "| Código | Texto |\n| --- | --- |\n"
    texto = "# Doc\n\n## Códigos\n\n" + cabecera + "".join(filas)
    chunks = _fichero(tmp_path, texto, 500)
    assert len(chunks) > 1
    assert all(len(c["texto"]) <= 500 for c in chunks)
    for fila in filas:
        assert sum(fila in c["texto"] for c in chunks) == 1
    # los chunks que solo llevan filas empiezan por encabezado, cabecera y separación
    de_filas = [c for c in chunks if cabecera not in c["texto"][len(c["contexto"]):] and "| descripcion" in c["texto"]]
    assert de_filas
    for c in de_filas:
        assert c["texto"].startswith("## Códigos\n" + cabecera)
    assert _reproduce(chunks, texto)


def test_limite_titulo_con_su_bloque(tmp_path):
    texto = "# T\n\n" + "a" * 400 + "\n\n## Sub\n\n" + "b" * 300 + "\n\n" + "c" * 300 + "\n"
    chunks = _fichero(tmp_path, texto, 500)
    assert len(chunks) > 1
    for c in chunks:
        assert not c["texto"].rstrip().endswith(("# T", "## Sub"))
        assert len(c["texto"]) <= 500
    con_sub = [c for c in chunks if "## Sub\n" in c["texto"][len(c["contexto"]):]]
    assert len(con_sub) == 1
    assert "b" * 300 in con_sub[0]["texto"]
    assert _reproduce(chunks, texto)


def test_limite_titulo_antes_de_codigo_largo(tmp_path):
    codigo = "```\n" + "x = 1\n" * 100 + "```\n"
    texto = "# T\n\n" + "a" * 100 + "\n\n## Sub\n\n" + codigo + "\ncierre\n"
    chunks = _fichero(tmp_path, texto, 300)
    con_codigo = [c for c in chunks if codigo in c["texto"]]
    assert len(con_codigo) == 1
    solo = con_codigo[0]
    assert solo["texto"][len(solo["contexto"]):].rstrip("\n") + "\n" == codigo
    i = chunks.index(solo)
    assert i > 0
    assert chunks[i - 1]["texto"].rstrip().endswith("## Sub")
    assert "## Sub\n" not in solo["texto"][len(solo["contexto"]):]
    assert [c for c in chunks if len(c["texto"]) > 300] == [solo]
    assert _reproduce(chunks, texto)


def test_limite_codigo_indivisible(tmp_path):
    codigo = "```\n" + "x = 1\n" * 100 + "```\n"
    texto = "# T\n\nintro\n\n" + codigo + "\ncierre\n"
    chunks = _fichero(tmp_path, texto, 200)
    grandes = [c for c in chunks if len(c["texto"]) > 200]
    assert len(grandes) == 1
    fragmento = grandes[0]["texto"][len(grandes[0]["contexto"]):]
    assert fragmento.rstrip("\n") + "\n" == codigo
    assert ce.es_bloque_de_codigo(fragmento)
    assert _reproduce(chunks, texto)


def test_limite_valla_tras_definicion(tmp_path):
    texto = (
        "# Mod\n\ntermino\n:   ```\n    codigo = 1\n    ```\n\n"
        "## Seccion\n\n" + "a" * 300 + "\n\n```\n# texto\nx = 1\n```\n\n"
        "## Final\n\n" + "b" * 300 + "\n"
    )
    chunks = _fichero(tmp_path, texto, 400, 50)
    rutas = {c["ruta_titulos"] for c in chunks}
    assert "texto" not in rutas
    assert rutas <= {"Mod", "Mod > Seccion", "Mod > Final"}
    assert chunks[-1]["ruta_titulos"] == "Mod > Final"
    assert _reproduce(chunks, texto)


@pytest.mark.parametrize("espacios", [True, False])
def test_limite_linea_larga(tmp_path, espacios):
    linea = " ".join(["palabra"] * 120) if espacios else "q" * 1000
    texto = "# T\n\n" + linea + "\n"
    chunks = _fichero(tmp_path, texto, 300)
    assert len(chunks) > 1
    assert all(len(c["texto"]) <= 300 for c in chunks)
    assert _reproduce(chunks, texto)
    if espacios:
        for c in chunks:
            assert set(c["texto"].replace("# T", "").split()) <= {"palabra"}


TEXTO_SINTETICO = (
    "previo sin titulo\n\n# A\n\n" + "a" * 200 + "\n\n```\n# c\n" + "k\n" * 80 + "```\n\n"
    "## B\n\ncorto\n\nclass x.C\n:   intro de la clase\n\n"
    + "".join(f"    m{i}(arg)\n    :   {'y' * 120}\n\n" for i in range(8))
    + "### Tabla\n\n| a | b |\n| --- | --- |\n"
    + "".join(f"| {i} | {'t' * 60} |\n" for i in range(20))
    + "\ntermino\n:   ```\n    x = 1\n    ```\n\n### C\n\n" + "c" * 500 + "\n\n"
    + " ".join(["larga"] * 150) + "\n\n\n"
)


@pytest.mark.parametrize("maximo,minimo", [(300, 0), (300, 100), (600, 200), (1000, 200), (80, 10)])
def test_limite_reproduce_fichero(tmp_path, maximo, minimo):
    _md(tmp_path, "a.md", TEXTO_SINTETICO)
    _md(tmp_path, "b.md", "# Solo\n\ncorta\n")
    chunks = ce.trocear_con_limite(tmp_path, maximo, minimo)
    for fuente, esperado in (("a.md", TEXTO_SINTETICO), ("b.md", "# Solo\n\ncorta\n")):
        propios = [c for c in chunks if c["fuente"] == fuente]
        assert _reproduce(propios, esperado)
    assert [c["id"] for c in chunks] == list(range(len(chunks)))
    assert all(c["texto"].startswith(c["contexto"]) for c in chunks)
    assert set(chunks[0]) == {"id", "fuente", "texto", "ruta_titulos", "contexto"}


@pytest.mark.skipif(not CORPUS.exists(), reason="no está el corpus")
def test_limite_corpus_real():
    chunks = ce.trocear_con_limite(CORPUS, 1500, 200)
    for c in chunks:
        if len(c["texto"]) > 1500:
            assert ce.es_bloque_de_codigo(c["texto"][len(c["contexto"]):]), c["fuente"]
    por_fuente: dict[str, list[dict]] = {}
    for c in chunks:
        por_fuente.setdefault(c["fuente"], []).append(c)
    for fuente, propios in por_fuente.items():
        original = (CORPUS / fuente).read_text(encoding="utf-8")
        assert _reproduce(propios, original), fuente
    assert [c["id"] for c in chunks] == list(range(len(chunks)))
    evidencias = ce.leer_evidencias(EVIDENCIAS)
    assert ce.evidencias_fuera_de_chunks(evidencias, chunks) == []


@pytest.mark.parametrize(
    "maximo,minimo,nombre",
    [(0, 0, "maximo"), (-5, 0, "maximo"), (100, -1, "minimo"), (100, 100, "minimo"), (100, 150, "minimo")],
)
def test_limite_parametros_invalidos(tmp_path, maximo, minimo, nombre):
    with pytest.raises(ValueError, match=nombre):
        ce.trocear_con_limite(tmp_path, maximo, minimo)


def test_limite_casos_de_borde(tmp_path):
    _md(tmp_path, "vacio.md", "  \n\n")
    _md(tmp_path, "abierto.md", "# T\n\n```\n# no es titulo\ncodigo\n")
    chunks = ce.trocear_con_limite(tmp_path, 1000, 50)
    assert not [c for c in chunks if c["fuente"] == "vacio.md"]
    abierto = [c for c in chunks if c["fuente"] == "abierto.md"]
    assert len(abierto) == 1 and abierto[0]["ruta_titulos"] == "T"


def test_limite_recorte_de_contexto_en_orden():
    """CB-03: `_recortar` quita t, luego d (de fuera adentro), luego h y por último r; para en cuanto cabe."""
    ctx = [("h", "H" * 10), ("d", "A" * 10), ("d", "B" * 10), ("t", "T" * 10), ("r", "R" * 10)]
    etiquetas = lambda c: [e for e, _ in c]
    assert ce._recortar(ctx, 100, 50) == ctx
    assert etiquetas(ce._recortar(ctx, 100, 60)) == ["h", "d", "d", "r"]
    assert [t[0] for _, t in ce._recortar(ctx, 100, 70)] == ["H", "B", "R"]
    assert etiquetas(ce._recortar(ctx, 100, 80)) == ["h", "r"]
    assert etiquetas(ce._recortar(ctx, 100, 90)) == ["r"]
    assert ce._recortar(ctx, 100, 100) == []
    # No cambia la entrada.
    assert len(ctx) == 5


def test_limite_une_trozo_menor_que_minimo():
    """CB-04: un chunk menor que `minimo` se une al anterior si no pasa de `maximo`, y si pasa queda solo."""
    # Suma mayor que maximo (95 + 10 > 100): el trozo corto no se une y queda solo.
    piezas = [ce._pieza([], "a" * 95), ce._pieza([], "b" * 10)]
    assert ce._empaquetar(piezas, 100, 30) == [("", "a" * 95), ("", "b" * 10)]
    # Con minimo alto el resultado es el mismo: ningun trozo se une si la suma pasa de maximo.
    assert ce._empaquetar(piezas, 100, 90) == ce._empaquetar(piezas, 100, 0)
    # Un trozo corto que cabe con el anterior sale unido (aqui lo une el empaquetado).
    piezas = [ce._pieza([], "a" * 60), ce._pieza([], "b" * 10)]
    assert ce._empaquetar(piezas, 100, 30) == [("", "a" * 60 + "b" * 10)]
    # El codigo no se une a nada aunque sea corto.
    piezas = [ce._pieza([], "a" * 95), ce._pieza([], "```\nx\n```", cod=True)]
    assert len(ce._empaquetar(piezas, 100, 30)) == 2


def _filas_csv(nombre):
    with open(RAIZ / "data" / "resultados" / nombre, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def test_troceo_limitado_csv():
    """Escenario 11: los dos CSV del notebook 11 tienen la forma de RF-12."""
    filas = _filas_csv("troceo_limitado.csv")
    assert len(filas) == 8
    combinaciones = {(f["troceo"], f["con_ruta"], f["reranker"]) for f in filas}
    assert combinaciones == {
        (t, r, k) for t in ("actual", "limitado") for r in ("True", "False") for k in ("True", "False")
    }
    columnas = {
        "troceo", "con_ruta", "reranker", "coleccion", "chunks", "chunks por encima del máximo",
        "chunks por encima del máximo que no son un bloque de código", "tamaño medio (caracteres)",
        "tamaño máximo (caracteres)", "evidencias partidas", "hit@1", "hit@4", "MRR", "ev_hit@1",
        "ev_hit@4", "ev_MRR", "latencia de búsqueda (ms)", "latencia de reranking (ms)",
        "latencia total (ms)", "indexación (s)",
    }
    assert columnas <= set(filas[0])
    for f in filas:
        if f["troceo"] == "limitado":
            assert int(f["chunks por encima del máximo que no son un bloque de código"]) == 0
    por_pregunta = _filas_csv("troceo_limitado_por_pregunta.csv")
    ids = {f["id"] for f in por_pregunta}
    assert {"B01", "B08"} <= ids
    for id_ in ids:
        configs = {(f["troceo"], f["con_ruta"], f["reranker"]) for f in por_pregunta if f["id"] == id_}
        assert configs == combinaciones, id_
    assert len(por_pregunta) == 8 * len(ids)
    assert {"rango_fuente", "rango_evidencia"} <= set(por_pregunta[0])


def _decision_troceo_limitado(filas):
    """Regla unica de «Decision (RF-14)»: devuelve la coleccion elegida.

    ev y hit cuentan preguntas A-D con rango de 1 a 4, con reranker.
    """
    def cuenta(troceo, con_ruta, campo):
        return sum(
            1
            for f in filas
            if f["troceo"] == troceo
            and f["con_ruta"] == con_ruta
            and f["reranker"] == "True"
            and f["categoria"] in "ABCD"
            and f[campo] != ""
            and 1 <= float(f[campo]) <= 4
        )

    def colecciones(troceo, con_ruta):
        return {
            f["coleccion"]
            for f in filas
            if f["troceo"] == troceo and f["con_ruta"] == con_ruta and f["reranker"] == "True"
        }

    ev_act = cuenta("actual", "False", "rango_evidencia")
    hit_act = cuenta("actual", "False", "rango_fuente")
    ev_sin = cuenta("limitado", "False", "rango_evidencia")
    hit_sin = cuenta("limitado", "False", "rango_fuente")
    ev_con = cuenta("limitado", "True", "rango_evidencia")
    hit_con = cuenta("limitado", "True", "rango_fuente")
    actual = colecciones("actual", "False").pop()
    if ev_con >= ev_act and hit_con >= hit_act and ev_con >= ev_sin + 2:
        return colecciones("limitado", "True").pop()
    if ev_sin >= ev_act and hit_sin >= hit_act:
        return colecciones("limitado", "False").pop()
    return actual


def test_troceo_limitado_decision():
    """Escenario 12: la coleccion de consultar_rag.py coincide con la regla de RF-14."""
    import consultar_rag

    filas = _filas_csv("troceo_limitado_por_pregunta.csv")
    elegida = _decision_troceo_limitado(filas)
    assert consultar_rag.COLECCION == elegida
    if elegida == "pydocs_nomic_est1500_m200_sinruta":
        assert "notebook 11" not in (RAIZ / "scripts" / "consultar_rag.py").read_text(encoding="utf-8")


# Issue #28, escenario 1
_QWEN3 = "Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery:"


@pytest.mark.parametrize(
    "clave,proveedor,nombre,prefijo_query,prefijo_documento",
    [
        ("qwen3_06b", "ollama", "qwen3-embedding:0.6b", _QWEN3, ""),
        ("qwen3_8b", "ollama", "qwen3-embedding:8b", _QWEN3, ""),
        ("bge_m3", "ollama", "bge-m3", "", ""),
        ("embeddinggemma", "ollama", "embeddinggemma", "task: search result | query: ", "title: none | text: "),
        (
            "jina_code",
            "sentence-transformers",
            "jinaai/jina-code-embeddings-1.5b",
            "Find the most relevant answer given the following question:\n",
            "Candidate answer:\n",
        ),
        ("nomic", "ollama", "nomic-embed-text", "search_query: ", "search_document: "),
    ],
)
def test_prefijos_de_la_ficha_oficial(clave, proveedor, nombre, prefijo_query, prefijo_documento):
    assert ce.MODELOS[clave]["proveedor"] == proveedor
    assert ce.MODELOS[clave]["nombre"] == nombre
    assert ce.preparar_query(clave, "q") == prefijo_query + "q"
    assert ce.preparar_documento(clave, "c") == prefijo_documento + "c"


# Issue #28, escenario 2
@pytest.mark.parametrize(
    "clave,num_ctx",
    [("qwen3_06b", 8192), ("qwen3_8b", 8192), ("bge_m3", 8192), ("jina_code", 8192), ("embeddinggemma", 2048)],
)
def test_num_ctx_por_modelo(clave, num_ctx):
    assert ce.MODELOS[clave]["num_ctx"] == num_ctx


def test_nomic_no_define_num_ctx():
    assert "num_ctx" not in ce.MODELOS["nomic"]
