"""Tests de scripts/embeddings_modelos.py (escenarios 3-5, 14 y 16-20 de la issue #28)."""
from types import SimpleNamespace

import ollama
import pytest

import embeddings_modelos as em
from comparar_embeddings import MODELOS


def _error_longitud():
    return ollama.ResponseError("the input length exceeds the context length", 400)


class OllamaEmbeber:
    """Cliente falso de `embed`: rechaza por longitud los textos de `largos` si truncate es False."""

    def __init__(self, largos=(), rechaza_lote=False, error=None):
        self.largos = set(largos)
        self.rechaza_lote = rechaza_lote
        self.error = error
        self.llamadas = []

    def embed(self, model, input, **extra):
        self.llamadas.append({"model": model, "input": list(input), **extra})
        if self.error is not None:
            raise self.error
        if extra.get("truncate") is False and (
            (self.rechaza_lote and len(input) > 1) or any(t in self.largos for t in input)
        ):
            raise _error_longitud()
        return SimpleNamespace(embeddings=[[float(len(t)), 1.0] for t in input])


# Escenario 3
def test_lote_que_cabe_hace_una_llamada_sin_truncar():
    cliente = OllamaEmbeber()
    vectores, truncados = em.embeber("bge_m3", ["a", "bb", "ccc"], cliente_ollama=cliente)
    assert len(cliente.llamadas) == 1
    llamada = cliente.llamadas[0]
    assert llamada["model"] == "bge-m3"
    assert llamada["truncate"] is False
    assert llamada["options"] == {"num_ctx": 8192, "num_batch": 8192}
    assert vectores == [[1.0, 1.0], [2.0, 1.0], [3.0, 1.0]]
    assert truncados == 0


def test_options_usan_num_ctx_de_cada_modelo():
    cliente = OllamaEmbeber()
    em.embeber("embeddinggemma", ["a"], cliente_ollama=cliente)
    assert cliente.llamadas[0]["options"] == {"num_ctx": 2048, "num_batch": 2048}


def test_modelo_sin_num_ctx_no_lleva_options():
    cliente = OllamaEmbeber()
    vectores, truncados = em.embeber("nomic", ["a", "bb"], cliente_ollama=cliente)
    assert cliente.llamadas == [{"model": "nomic-embed-text", "input": ["a", "bb"]}]
    assert len(vectores) == 2
    assert truncados == 0


# Escenario 4
def test_texto_que_no_cabe_se_embebe_truncado_y_se_cuenta():
    cliente = OllamaEmbeber(largos={"largo"}, rechaza_lote=True)
    vectores, truncados = em.embeber("qwen3_06b", ["uno", "largo", "tres"], cliente_ollama=cliente)
    assert truncados == 1
    assert vectores == [[3.0, 1.0], [5.0, 1.0], [4.0, 1.0]]
    por_texto = [c for c in cliente.llamadas if c["input"] == ["largo"]]
    assert [c["truncate"] for c in por_texto] == [False, True]
    for texto in ("uno", "tres"):
        llamadas = [c for c in cliente.llamadas if c["input"] == [texto]]
        assert [c["truncate"] for c in llamadas] == [False]
    assert all(c["options"] == {"num_ctx": 8192, "num_batch": 8192} for c in cliente.llamadas)


def test_contar_truncados_cuenta_los_rechazados():
    cliente = OllamaEmbeber(largos={"x", "y"}, rechaza_lote=True)
    assert em.contar_truncados("bge_m3", ["x", "a", "y"], cliente, num_ctx=8192) == 2
    assert all(c["truncate"] is False for c in cliente.llamadas)
    assert cliente.llamadas[0]["options"] == {"num_ctx": 8192, "num_batch": 8192}


# Escenario 5
@pytest.mark.parametrize(
    "error",
    [ollama.ResponseError("model 'bge-m3' not found", 404), ConnectionError("sin conexión")],
)
def test_error_que_no_es_de_longitud_se_propaga(error):
    cliente = OllamaEmbeber(error=error)
    with pytest.raises(type(error)):
        em.embeber("bge_m3", ["a", "b"], cliente_ollama=cliente)
    assert len(cliente.llamadas) == 1


def test_error_que_no_es_de_longitud_no_se_cuenta_como_truncado():
    cliente = OllamaEmbeber(error=ollama.ResponseError("model not found", 404))
    with pytest.raises(ollama.ResponseError):
        em.contar_truncados("bge_m3", ["a"], cliente, num_ctx=8192)


# Escenario 14
def _fila(modelo, ev, hit, latencia, configuracion="con reranker, filtro modulo con repeticion"):
    return {"modelo": modelo, "configuracion": configuracion, "hit@4": hit, "ev_hit@4": ev, "latencia_ms": latencia}


def _resumen(*candidatos):
    return [_fila("nomic", 28, 31, 100)] + [_fila(*c) for c in candidatos]


def test_criterio_solo_cumplen_ev_30_y_hit_31():
    resumen = _resumen(("a", 29, 32, 10), ("b", 30, 30, 10), ("c", 30, 31, 10))
    assert em.elegir_modelo(resumen) == "c"


def test_criterio_gana_el_de_mas_ev_hit():
    resumen = _resumen(("a", 30, 31, 10), ("b", 31, 31, 500), ("c", 30, 32, 5))
    assert em.elegir_modelo(resumen) == "b"


def test_criterio_empate_gana_el_mas_rapido():
    resumen = _resumen(("a", 30, 31, 90), ("b", 30, 32, 40), ("c", 30, 31, 60))
    assert em.elegir_modelo(resumen) == "b"


def test_criterio_sin_candidatos_gana_nomic():
    resumen = _resumen(("a", 29, 32, 10), ("b", 32, 30, 10))
    assert em.elegir_modelo(resumen) == "nomic"


def test_criterio_ignora_otras_configuraciones():
    resumen = _resumen(("a", 29, 31, 10))
    resumen.append(_fila("z", 32, 32, 1, configuracion="con reranker, sin filtro"))
    assert em.elegir_modelo(resumen) == "nomic"


# Escenario 16
def _torch(monkeypatch, cuda, mps):
    monkeypatch.setattr(em.torch.cuda, "is_available", lambda: cuda)
    monkeypatch.setattr(em.torch.backends.mps, "is_available", lambda: mps)


@pytest.mark.parametrize(
    "cuda,mps,esperado",
    [(True, False, "cuda"), (False, True, "mps"), (False, False, "cpu"), (True, True, "cuda")],
)
def test_dispositivo(monkeypatch, cuda, mps, esperado):
    _torch(monkeypatch, cuda, mps)
    assert em.dispositivo() == esperado


# Escenario 17
class SentenceTransformerFalso:
    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs


@pytest.mark.parametrize(
    "cuda,mps,dispositivo,tipo",
    [
        (True, False, "cuda", "bfloat16"),
        (False, True, "mps", "float32"),
        (False, False, "cpu", "float32"),
    ],
)
def test_carga_de_jina_code(monkeypatch, cuda, mps, dispositivo, tipo):
    _torch(monkeypatch, cuda, mps)
    monkeypatch.setattr(em, "SentenceTransformer", SentenceTransformerFalso)
    modelo = em.cargar_codificador("jina_code")
    assert modelo.args == ("jinaai/jina-code-embeddings-1.5b",)
    assert modelo.kwargs["device"] == dispositivo
    assert modelo.kwargs["model_kwargs"] == {"torch_dtype": getattr(em.torch, tipo)}
    assert modelo.kwargs["tokenizer_kwargs"] == {"padding_side": "left"}
    assert "trust_remote_code" not in modelo.kwargs
    assert "trust_remote_code" not in modelo.kwargs["model_kwargs"]
    assert "attn_implementation" not in modelo.kwargs
    assert "attn_implementation" not in modelo.kwargs["model_kwargs"]


def test_embeber_con_sentence_transformers_normaliza_y_cuenta_truncados():
    class Tokenizador:
        def __call__(self, texto, add_special_tokens=True):
            return {"input_ids": list(range(len(texto)))}

    class Codificador:
        tokenizer = Tokenizador()
        max_seq_length = None

        def encode(self, textos, normalize_embeddings):
            assert normalize_embeddings is True
            return [[1.0, 0.0] for _ in textos]

    codificador = Codificador()
    muy_largo = "x" * (MODELOS["jina_code"]["num_ctx"] + 1)
    vectores, truncados = em.embeber("jina_code", ["corto", muy_largo], codificador=codificador)
    assert codificador.max_seq_length == 8192
    assert vectores == [[1.0, 0.0], [1.0, 0.0]]
    assert truncados == 1


# Escenario 19
class OllamaPs:
    def __init__(self, modelos, descargas_tras=None):
        """`descargas_tras`: número de lecturas de `ps()` tras las que quedan vacíos; None = nunca."""
        self.modelos = list(modelos)
        self.descargas_tras = descargas_tras
        self.lecturas = 0
        self.embeds = []

    def ps(self):
        self.lecturas += 1
        if self.descargas_tras is not None and self.lecturas > self.descargas_tras:
            return SimpleNamespace(models=[])
        return SimpleNamespace(models=[SimpleNamespace(model=m) for m in self.modelos])

    def embed(self, model, input, **extra):
        self.embeds.append({"model": model, "input": input, **extra})
        return SimpleNamespace(embeddings=[])


@pytest.fixture
def sin_espera(monkeypatch):
    esperas = []
    monkeypatch.setattr(em.time, "sleep", lambda s: esperas.append(s))
    return esperas


def test_liberar_vram_descarga_cada_modelo(sin_espera):
    cliente = OllamaPs(["a:latest", "b:latest"], descargas_tras=2)
    em.liberar_vram_ollama(cliente)
    assert [(e["model"], e["keep_alive"]) for e in cliente.embeds] == [("a:latest", 0), ("b:latest", 0)]
    assert all(e["input"] == [] for e in cliente.embeds)


def test_liberar_vram_sin_modelos_no_espera(sin_espera):
    cliente = OllamaPs([])
    em.liberar_vram_ollama(cliente)
    assert cliente.embeds == []
    assert sin_espera == []


def test_liberar_vram_espera_a_que_ps_quede_vacio(sin_espera):
    cliente = OllamaPs(["a", "b"], descargas_tras=4)
    em.liberar_vram_ollama(cliente)
    assert 0 < len(sin_espera) < em.ESPERA_DESCARGA


def test_liberar_vram_falla_si_sigue_cargado_tras_el_plazo(sin_espera):
    cliente = OllamaPs(["a:latest", "b:latest"])
    with pytest.raises(RuntimeError) as error:
        em.liberar_vram_ollama(cliente)
    assert "ollama stop a:latest" in str(error.value)
    assert "ollama stop b:latest" in str(error.value)
    assert len(sin_espera) == em.ESPERA_DESCARGA


def test_liberar_vram_nombra_solo_el_que_queda(monkeypatch):
    monkeypatch.setattr(em.time, "sleep", lambda s: None)

    class Cliente(OllamaPs):
        def ps(self):
            self.lecturas += 1
            if self.lecturas > 1:
                return SimpleNamespace(models=[SimpleNamespace(model="b")])
            return super().ps()

    with pytest.raises(RuntimeError) as error:
        em.liberar_vram_ollama(Cliente(["a", "b"]))
    assert "ollama stop b" in str(error.value)
    assert "ollama stop a" not in str(error.value)


# Escenario 20
def _ps(size, size_vram, model="bge-m3:latest"):
    return SimpleNamespace(
        ps=lambda: SimpleNamespace(models=[SimpleNamespace(model=model, size=size, size_vram=size_vram)])
    )


@pytest.mark.parametrize(
    "size,size_vram,esperado", [(100, 100, "cuda"), (100, 0, "cpu"), (100, 40, "cuda+cpu")]
)
def test_dispositivo_ollama(size, size_vram, esperado):
    assert em.dispositivo_ollama(_ps(size, size_vram), "bge-m3") == esperado


def test_dispositivo_ollama_acepta_nombre_exacto_y_falla_si_no_esta():
    assert em.dispositivo_ollama(_ps(10, 10, model="qwen3-embedding:0.6b"), "qwen3-embedding:0.6b") == "cuda"
    with pytest.raises(RuntimeError):
        em.dispositivo_ollama(_ps(10, 10, model="otro"), "bge-m3")
