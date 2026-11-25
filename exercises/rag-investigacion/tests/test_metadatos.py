"""Tests de scripts/metadatos.py (escenarios 1-6 de la issue #26)."""
from pathlib import Path

import pytest

import comparar_embeddings as ce
import metadatos as md

RAIZ = Path(__file__).resolve().parent.parent
CORPUS = RAIZ / "data" / "python-docs-3.15" / "python-3.15-docs-md-clean"

CLAVES = {
    "modulo": str,
    "tipo_pagina": str,
    "simbolos": list,
    "deprecated": bool,
    "added_in": list,
    "tiene_codigo": bool,
}


@pytest.fixture(scope="module")
def corpus_metadatos():
    chunks = ce.trocear_por_estructura(CORPUS, 1500, 200)
    return chunks, md.metadatos_chunks(CORPUS, chunks)


def _un_chunk(tmp_path, nombre, texto):
    (tmp_path / nombre).parent.mkdir(parents=True, exist_ok=True)
    (tmp_path / nombre).write_text(texto, encoding="utf-8")
    chunks = [{"id": 0, "fuente": nombre, "texto": texto}]
    return md.metadatos_chunks(tmp_path, chunks)[0]


def test_modulo_de_logging_config():
    assert md.modulo_de_fichero(CORPUS, "library/logging.config.md") == "logging.config"
    assert md.tipo_pagina("library/logging.config.md") == "library"


def test_modulo_de_subpagina_asyncio():
    assert md.modulo_de_fichero(CORPUS, "library/asyncio-task.md") == "asyncio"


def test_paginas_sin_modulo():
    for fuente, tipo in (("tutorial/venv.md", "tutorial"), ("whatsnew/3.15.md", "whatsnew")):
        assert md.modulo_de_fichero(CORPUS, fuente) == ""
        assert md.tipo_pagina(fuente) == tipo


def test_simbolos_anidados_cualificados(corpus_metadatos):
    chunks, metas = corpus_metadatos
    simbolos = [
        s
        for c in chunks
        if c["fuente"] == "library/asyncio-task.md"
        for s in metas[c["id"]]["simbolos"]
    ]
    assert "asyncio.TaskGroup" in simbolos
    assert "asyncio.TaskGroup.create_task" in simbolos
    assert not any("\\" in s for s in simbolos)


def test_simbolos_de_texto_minimo(tmp_path):
    texto = (
        "# `mod` - algo\n\n"
        "class mod.Clase\n"
        ":   Descripcion.\n\n"
        "    metodo\\_uno(*x*)\n"
        "    :   Hijo.\n\n"
        "async mod.dormir(*t*)\n"
        ":   Otra.\n"
    )
    meta = _un_chunk(tmp_path, "library/mod.md", texto)
    assert meta["simbolos"] == ["mod.Clase", "mod.Clase.metodo_uno", "mod.dormir"]


def test_simbolos_ignora_bloques_de_codigo(tmp_path):
    texto = "# T\n\n```\nfalso\n:   no\n```\n"
    assert _un_chunk(tmp_path, "a.md", texto)["simbolos"] == []


def test_notas_de_version_y_codigo():
    assert md.deprecated("Deprecated since version 3.10: usa otra cosa.")
    assert md.deprecated("    Deprecated since version 3.10")
    assert not md.deprecated("Soft deprecated since version 3.12.")
    assert md.added_in("Added in version 3.15\n\nAdded in version 3.15\nAdded in version 3.14") == [
        "3.15",
        "3.14",
    ]
    assert md.added_in("sin nada") == []
    assert md.tiene_codigo("texto\n```python\nx = 1\n```\n")
    assert md.tiene_codigo(":   ```\n    x\n    ```")
    assert not md.tiene_codigo("sin vallas")


def test_fichero_sin_encabezado_y_sin_simbolos(tmp_path):
    meta = _un_chunk(tmp_path, "glossary.md", "solo texto\n")
    assert meta["modulo"] == ""
    assert meta["tipo_pagina"] == ""
    assert meta["simbolos"] == []


def test_chunks_que_no_reproducen_el_fichero(tmp_path):
    (tmp_path / "a.md").write_text("hola", encoding="utf-8")
    with pytest.raises(ValueError):
        md.metadatos_chunks(tmp_path, [{"id": 0, "fuente": "a.md", "texto": "otro"}])


def test_metadatos_de_todo_el_corpus(corpus_metadatos):
    chunks, metas = corpus_metadatos
    assert set(metas) == {c["id"] for c in chunks}
    for meta in metas.values():
        assert set(meta) == set(CLAVES)
        for clave, tipo in CLAVES.items():
            assert isinstance(meta[clave], tipo)
    asyncio_chunks = [c for c in chunks if c["fuente"].startswith("library/asyncio-")]
    assert asyncio_chunks
    assert all(metas[c["id"]]["modulo"] == "asyncio" for c in asyncio_chunks)
