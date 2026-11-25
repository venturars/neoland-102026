"""Embeddings con contexto explícito por modelo, nombre de colección y criterio de decisión del notebook 13.

Las funciones reciben el cliente de Ollama o el codificador de sentence-transformers. `cargar_codificador`
descarga el modelo de Hugging Face si no está en caché.
"""
from __future__ import annotations

import time

import ollama
import torch
from sentence_transformers import SentenceTransformer

from comparar_embeddings import MODELOS

# Fragmento del mensaje con el que Ollama rechaza un texto más largo que `num_ctx` si `truncate=False`
# (comprobado con ollama 0.40.16 y embeddinggemma: 400 "the input length exceeds the context length").
PATRON_LONGITUD = "context length"
# Segundos que `liberar_vram_ollama` espera a que Ollama termine de descargar (la descarga es asíncrona).
ESPERA_DESCARGA = 15


def nombre_coleccion(clave: str) -> str:
    """Nombre de la colección de Qdrant de un modelo, troceo estructural 1500/200 y texto sin ruta."""
    return f"pydocs_{clave}_est1500_m200_sinruta"


def _es_error_de_longitud(error: ollama.ResponseError) -> bool:
    return PATRON_LONGITUD in str(getattr(error, "error", "") or error).lower()


def _embeber_ollama(cliente, modelo: str, textos: list[str], num_ctx: int) -> tuple[list[list[float]], int]:
    # Los modelos BERT de Ollama procesan cada texto en un bloque de `num_batch` tokens: se iguala a `num_ctx`.
    opciones = {"num_ctx": num_ctx, "num_batch": num_ctx}
    try:
        respuesta = cliente.embed(model=modelo, input=textos, truncate=False, options=opciones)
        return [list(v) for v in respuesta.embeddings], 0
    except ollama.ResponseError as error:
        if not _es_error_de_longitud(error):
            raise
    vectores: list[list[float]] = []
    truncados = 0
    for texto in textos:
        try:
            respuesta = cliente.embed(model=modelo, input=[texto], truncate=False, options=opciones)
        except ollama.ResponseError as error:
            if not _es_error_de_longitud(error):
                raise
            respuesta = cliente.embed(model=modelo, input=[texto], truncate=True, options=opciones)
            truncados += 1
        vectores.append(list(respuesta.embeddings[0]))
    return vectores, truncados


def embeber(
    clave: str, textos: list[str], cliente_ollama=None, codificador=None
) -> tuple[list[list[float]], int]:
    """Devuelve los vectores de `textos` en orden de entrada y cuántos se han truncado.

    Con proveedor Ollama y `num_ctx`, pide el lote sin truncar; si Ollama lo rechaza por longitud, repite
    texto a texto y embebe truncado el que no cabe. Sin `num_ctx` la llamada no lleva argumentos extra.
    Con sentence-transformers, `max_seq_length` es `num_ctx` y se cuentan los textos que lo superan.
    Cualquier otro error se propaga.
    """
    modelo = MODELOS[clave]
    num_ctx = modelo.get("num_ctx")
    if modelo["proveedor"] == "ollama":
        if num_ctx is None:
            respuesta = cliente_ollama.embed(model=modelo["nombre"], input=textos)
            return [list(v) for v in respuesta.embeddings], 0
        return _embeber_ollama(cliente_ollama, modelo["nombre"], textos, num_ctx)
    truncados = 0
    if num_ctx is not None:
        codificador.max_seq_length = num_ctx
        truncados = sum(
            len(codificador.tokenizer(texto, add_special_tokens=True)["input_ids"]) > num_ctx for texto in textos
        )
    vectores = codificador.encode(textos, normalize_embeddings=True)
    return [[float(x) for x in v] for v in vectores], int(truncados)


def contar_truncados(clave: str, textos: list[str], cliente_ollama, num_ctx: int | None = None) -> int:
    """Cuenta los textos que Ollama rechaza por longitud con `truncate=False`, sin embeber truncado.

    `num_ctx` es el contexto con el que se sondea; sin él, la llamada no lleva opciones (caso nomic).
    """
    nombre = MODELOS[clave]["nombre"]
    argumentos = {"options": {"num_ctx": num_ctx, "num_batch": num_ctx}} if num_ctx is not None else {}
    try:
        cliente_ollama.embed(model=nombre, input=textos, truncate=False, **argumentos)
        return 0
    except ollama.ResponseError as error:
        if not _es_error_de_longitud(error):
            raise
    truncados = 0
    for texto in textos:
        try:
            cliente_ollama.embed(model=nombre, input=[texto], truncate=False, **argumentos)
        except ollama.ResponseError as error:
            if not _es_error_de_longitud(error):
                raise
            truncados += 1
    return truncados


def comprobar_modelo(clave: str, cliente_ollama) -> None:
    """Comprueba que Ollama responde y tiene el modelo; si no, `RuntimeError` con la orden `ollama pull`."""
    nombre = MODELOS[clave]["nombre"]
    try:
        cliente_ollama.show(nombre)
    except Exception as error:
        raise RuntimeError(f"Ollama no responde o no tiene {nombre}. Ejecuta `ollama pull {nombre}`.") from error


def elegir_modelo(resumen: list[dict], referencia: str = "nomic") -> str:
    """Aplica el criterio de la issue sobre «con reranker, filtro modulo con repeticion».

    `resumen` son filas con `modelo`, `configuracion`, `hit@4`, `ev_hit@4` y `latencia_ms`. Un modelo sustituye
    a la referencia si su ev_hit@4 es al menos el de la referencia + 2 y su hit@4 no baja del de la referencia.
    Gana el de más ev_hit@4; si empatan, el de menor latencia. Si ninguno cumple, devuelve la referencia.
    """
    configuracion = "con reranker, filtro modulo con repeticion"
    filas = {f["modelo"]: f for f in resumen if f["configuracion"] == configuracion}
    base = filas[referencia]
    candidatos = [
        f
        for clave, f in filas.items()
        if clave != referencia and f["ev_hit@4"] >= base["ev_hit@4"] + 2 and f["hit@4"] >= base["hit@4"]
    ]
    if not candidatos:
        return referencia
    return min(candidatos, key=lambda f: (-f["ev_hit@4"], f["latencia_ms"]))["modelo"]


def dispositivo() -> str:
    """`"cuda"` si PyTorch ve una GPU NVIDIA; si no, `"mps"` en macOS con Apple Silicon; si no, `"cpu"`."""
    if torch.cuda.is_available():
        return "cuda"
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def cargar_codificador(clave: str) -> SentenceTransformer:
    """Carga en `dispositivo()` el modelo de sentence-transformers de `MODELOS[clave]`.

    `bfloat16` en cuda y `float32` en mps y cpu; relleno por la izquierda, como en la ficha del modelo en Hugging Face.
    """
    d = dispositivo()
    return SentenceTransformer(
        MODELOS[clave]["nombre"],
        device=d,
        model_kwargs={"torch_dtype": torch.bfloat16 if d == "cuda" else torch.float32},
        tokenizer_kwargs={"padding_side": "left"},
    )


def liberar_vram_ollama(cliente) -> None:
    """Descarga todos los modelos cargados en Ollama; `RuntimeError` con `ollama stop` si queda alguno."""
    for m in cliente.ps().models:
        cliente.embed(model=m.model, input=[], keep_alive=0)
    restantes = [m.model for m in cliente.ps().models]
    for _ in range(ESPERA_DESCARGA):
        if not restantes:
            break
        time.sleep(1)
        restantes = [m.model for m in cliente.ps().models]
    if restantes:
        ordenes = ", ".join(f"`ollama stop {nombre}`" for nombre in restantes)
        raise RuntimeError(f"Ollama sigue con modelos cargados. Ejecuta {ordenes}.")


def dispositivo_ollama(cliente, nombre: str) -> str:
    """`"cuda"`, `"cpu"` o `"cuda+cpu"` según cuánto de `nombre` está en VRAM, leído de `ps()`."""
    for m in cliente.ps().models:
        if m.model in (nombre, f"{nombre}:latest"):
            if m.size_vram == m.size:
                return "cuda"
            if m.size_vram == 0:
                return "cpu"
            return "cuda+cpu"
    raise RuntimeError(f"{nombre} no está cargado en Ollama.")
