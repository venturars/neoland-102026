"""Tests de scripts/indexar_embeddings.py (escenarios 6-9 de la issue #28)."""
import json
from types import SimpleNamespace

import pytest
from qdrant_client.models import Distance

import indexar_embeddings as ie

COLECCION = "pydocs_bge_m3_est1500_m200_sinruta"
CHUNKS = [
    {"id": i, "fuente": f"f{i // 2}.md", "texto": f"texto {i}", "ruta_titulos": f"t{i}"} for i in range(5)
]
METADATOS = {
    c["id"]: {
        "modulo": "m",
        "tipo_pagina": "library",
        "simbolos": ["s"],
        "deprecated": False,
        "added_in": [],
        "tiene_codigo": False,
    }
    for c in CHUNKS
}


class QdrantFalso:
    def __init__(self, existe=False, puntos=0, modulo=True):
        self.existe = existe
        self.puntos = puntos
        self.modulo = modulo
        self.llamadas = []
        self.upserts = []
        self.indices = []
        self.creada = None

    def collection_exists(self, nombre):
        return self.existe

    def count(self, nombre, exact=True):
        return SimpleNamespace(count=self.puntos)

    def scroll(self, nombre, limit, with_payload, with_vectors):
        payload = {"modulo": "m"} if self.modulo else {"fuente": "x"}
        return [SimpleNamespace(payload=payload)], None

    def delete_collection(self, nombre):
        self.llamadas.append(("delete_collection", nombre))
        self.existe = False
        self.puntos = 0

    def create_collection(self, nombre, vectors_config):
        self.llamadas.append(("create_collection", nombre))
        self.creada = (nombre, vectors_config)
        self.existe = True

    def upsert(self, nombre, points, wait=True):
        self.llamadas.append(("upsert", nombre))
        self.upserts.append(points)
        self.puntos += len(points)

    def create_payload_index(self, nombre, campo, field_schema, wait=True):
        self.llamadas.append(("create_payload_index", nombre))
        self.indices.append((campo, field_schema))

    def nombres(self):
        return [n for n, _ in self.llamadas]


class Embebedor:
    def __init__(self):
        self.lotes = []

    def __call__(self, textos):
        self.lotes.append(list(textos))
        return [[1.0, 0.0, 0.5] for _ in textos], 1


def _registro(tmp_path, claves=()):
    ruta = tmp_path / "indexacion_embeddings.json"
    if claves:
        ruta.write_text(json.dumps({c: {"nombre": c} for c in claves}), encoding="utf-8")
    return ruta


# Escenario 6
def test_indexa_un_modelo_nuevo(tmp_path):
    qdrant = QdrantFalso()
    embebedor = Embebedor()
    registro = _registro(tmp_path)

    entrada = ie.indexar_modelo(qdrant, "bge_m3", CHUNKS, METADATOS, embebedor, registro, "cuda", lote=2)

    nombre, config = qdrant.creada
    assert nombre == COLECCION
    assert config.size == 3
    assert config.distance == Distance.COSINE
    assert [len(lote) for lote in qdrant.upserts] == [2, 2, 1]
    assert len(embebedor.lotes) == 3
    punto = qdrant.upserts[0][0]
    assert set(punto.payload) == {
        "fuente", "texto", "ruta_titulos", "modulo", "tipo_pagina", "simbolos", "deprecated", "added_in", "tiene_codigo",
    }
    assert punto.payload["fuente"] == "f0.md"
    assert punto.payload["texto"] == "texto 0"
    assert punto.id == 0
    assert [campo for campo, _ in qdrant.indices] == ["modulo", "tipo_pagina"]
    assert all(esquema.value == "keyword" for _, esquema in qdrant.indices)
    # Los índices se crean después de insertar todos los lotes.
    assert qdrant.nombres().index("create_payload_index") > max(
        i for i, n in enumerate(qdrant.nombres()) if n == "upsert"
    )

    guardado = json.loads(registro.read_text(encoding="utf-8"))["bge_m3"]
    assert guardado == {k: entrada[k] for k in guardado}
    assert guardado["dispositivo"] == "cuda"
    assert guardado["nombre"] == "bge-m3"
    assert guardado["proveedor"] == "ollama"
    assert guardado["coleccion"] == COLECCION
    assert guardado["dimension"] == 3
    assert guardado["num_ctx"] == 8192
    assert guardado["truncados"] == 3
    assert set(guardado) == {
        "nombre", "proveedor", "coleccion", "dimension", "num_ctx", "truncados", "tiempo_indexacion_s", "dispositivo", "fecha",
    }


def test_el_embebedor_recibe_el_texto_con_prefijo_de_documento(tmp_path):
    qdrant = QdrantFalso()
    embebedor = Embebedor()
    ie.indexar_modelo(qdrant, "embeddinggemma", CHUNKS[:2], METADATOS, embebedor, _registro(tmp_path), "cuda")
    assert embebedor.lotes == [["title: none | text: texto 0", "title: none | text: texto 1"]]


def test_conserva_las_otras_entradas_del_registro(tmp_path):
    registro = _registro(tmp_path, ["qwen3_06b"])
    ie.indexar_modelo(QdrantFalso(), "bge_m3", CHUNKS, METADATOS, Embebedor(), registro, "cuda")
    assert set(json.loads(registro.read_text(encoding="utf-8"))) == {"qwen3_06b", "bge_m3"}


def test_no_escribe_la_entrada_si_la_coleccion_queda_incompleta(tmp_path):
    class Perdedor(QdrantFalso):
        def upsert(self, nombre, points, wait=True):
            self.llamadas.append(("upsert", nombre))

    registro = _registro(tmp_path)
    with pytest.raises(RuntimeError):
        ie.indexar_modelo(Perdedor(), "bge_m3", CHUNKS, METADATOS, Embebedor(), registro, "cuda")
    assert not registro.exists()


# Escenario 7
def test_modelo_ya_indexado_se_salta(tmp_path, capsys):
    qdrant = QdrantFalso(existe=True, puntos=len(CHUNKS))
    embebedor = Embebedor()
    registro = _registro(tmp_path, ["bge_m3"])
    antes = registro.read_text(encoding="utf-8")

    assert ie.indexar_modelo(qdrant, "bge_m3", CHUNKS, METADATOS, embebedor, registro, "cuda") is None

    assert embebedor.lotes == []
    assert qdrant.llamadas == []
    assert registro.read_text(encoding="utf-8") == antes
    salida = capsys.readouterr().out
    assert "se salta" in salida and COLECCION in salida


# Escenario 8
@pytest.mark.parametrize(
    "existe,puntos,modulo,claves",
    [
        (True, len(CHUNKS) - 1, True, ["bge_m3"]),
        (True, len(CHUNKS), True, []),
        (True, len(CHUNKS), False, ["bge_m3"]),
    ],
    ids=["menos puntos", "sin entrada en el registro", "sin metadatos"],
)
def test_coleccion_incompleta_se_borra_y_se_indexa_entera(tmp_path, capsys, existe, puntos, modulo, claves):
    qdrant = QdrantFalso(existe=existe, puntos=puntos, modulo=modulo)
    registro = _registro(tmp_path, claves)

    entrada = ie.indexar_modelo(qdrant, "bge_m3", CHUNKS, METADATOS, Embebedor(), registro, "cuda", lote=2)

    assert entrada is not None
    nombres = qdrant.nombres()
    assert nombres[0] == "delete_collection"
    assert nombres.index("create_collection") > 0
    assert qdrant.puntos == len(CHUNKS)
    assert "bge_m3" in json.loads(registro.read_text(encoding="utf-8"))
    assert "borra" in capsys.readouterr().out


# Escenario 9
def test_nomic_no_se_indexa_ni_se_toca_qdrant(tmp_path):
    qdrant = QdrantFalso(existe=True, puntos=len(CHUNKS))
    embebedor = Embebedor()
    registro = _registro(tmp_path)
    with pytest.raises(ValueError) as error:
        ie.indexar_modelo(qdrant, "nomic", CHUNKS, METADATOS, embebedor, registro, "cuda")
    assert "nomic" in str(error.value)
    assert qdrant.llamadas == []
    assert embebedor.lotes == []
    assert not registro.exists()


def test_validar_claves_rechaza_nomic_y_desconocidas():
    with pytest.raises(ValueError):
        ie.validar_claves(["bge_m3", "nomic"])
    with pytest.raises(ValueError) as error:
        ie.validar_claves(["no_existe"])
    assert "bge_m3" in str(error.value)
    assert "nomic" not in str(error.value).split("válidas:")[1]
    ie.validar_claves(["bge_m3", "jina_code"])


def test_clave_desconocida_en_indexar_modelo_no_toca_qdrant(tmp_path):
    qdrant = QdrantFalso()
    with pytest.raises(ValueError):
        ie.indexar_modelo(qdrant, "no_existe", CHUNKS, METADATOS, Embebedor(), _registro(tmp_path), "cuda")
    assert qdrant.llamadas == []
