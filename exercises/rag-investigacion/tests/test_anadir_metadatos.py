"""Tests de scripts/anadir_metadatos.py (escenario 11 y CB-04 de la issue #26)."""
from types import SimpleNamespace

import pytest

import anadir_metadatos as am

TEXTO = "# `mod` - algo\n\nclass mod.A\n:   Texto.\n"


class QdrantFalso:
    def __init__(self, puntos, payloads):
        self.puntos = puntos
        self.payloads = payloads
        self.escrituras = []
        self.snapshots = []
        self.indices = []

    def count(self, coleccion, exact=True):
        if self.puntos is None:
            raise RuntimeError("no existe")
        return SimpleNamespace(count=self.puntos)

    def scroll(self, coleccion, limit, offset=None, with_payload=True, with_vectors=False):
        registros = [SimpleNamespace(id=i, payload=p) for i, p in self.payloads.items()]
        return registros, None

    def create_snapshot(self, coleccion):
        self.snapshots.append(coleccion)
        return SimpleNamespace(name="snap")

    def batch_update_points(self, coleccion, operaciones, wait=True):
        self.escrituras.extend(operaciones)

    def set_payload(self, *args, **kwargs):
        self.escrituras.append((args, kwargs))

    def create_payload_index(self, coleccion, campo, **kwargs):
        self.indices.append(campo)


@pytest.fixture
def carpeta(tmp_path):
    (tmp_path / "library").mkdir()
    (tmp_path / "library" / "mod.md").write_text(TEXTO, encoding="utf-8")
    return tmp_path


def _payload(texto=TEXTO):
    return {"fuente": "library/mod.md", "texto": texto, "ruta_titulos": ""}


def test_no_escribe_si_no_cuadra(carpeta):
    qdrant = QdrantFalso(1, {0: _payload("texto distinto")})
    with pytest.raises(RuntimeError, match="0"):
        am.anadir_metadatos(qdrant, carpeta)
    assert qdrant.escrituras == []
    assert qdrant.snapshots == []
    assert qdrant.indices == []


def test_no_escribe_si_el_numero_de_puntos_no_coincide(carpeta):
    qdrant = QdrantFalso(5, {0: _payload()})
    with pytest.raises(RuntimeError):
        am.anadir_metadatos(qdrant, carpeta)
    assert qdrant.escrituras == []


def test_no_escribe_si_falta_la_coleccion(carpeta):
    qdrant = QdrantFalso(None, {})
    with pytest.raises(RuntimeError):
        am.anadir_metadatos(qdrant, carpeta)
    assert qdrant.escrituras == []


def test_escribe_si_cuadra(carpeta):
    qdrant = QdrantFalso(1, {0: _payload()})
    assert am.anadir_metadatos(qdrant, carpeta) == 1
    assert qdrant.snapshots == [am.COLECCION]
    assert len(qdrant.escrituras) == 1
    payload = qdrant.escrituras[0].set_payload.payload
    assert payload["modulo"] == "mod"
    assert payload["simbolos"] == ["mod.A"]
    assert qdrant.indices == ["modulo", "tipo_pagina"]
