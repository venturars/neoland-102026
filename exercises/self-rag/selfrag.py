"""Self-RAG simplificado sobre un corpus de Fórmula 1.

No hay fine-tune. llama3.2, en local, hace de clasificador, de juez y de
generador. La búsqueda es la misma mezcla de la semana 3: denso con
qwen3-embedding:0.6b, BM25 y reranker bge-reranker-v2-m3. Nada de esto llama
a una API de pago. La web del fallback, si hace falta, es DuckDuckGo.
"""

from __future__ import annotations

import json
import os
import re
import time
import unicodedata
from contextvars import ContextVar
from pathlib import Path
from typing import Literal
from urllib.request import Request, urlopen

os.environ.setdefault("ANONYMIZED_TELEMETRY", "False")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

import chromadb
from fastembed.rerank.cross_encoder import TextCrossEncoder
from langchain_chroma import Chroma
from langchain_classic.retrievers.ensemble import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langgraph.graph import END, StateGraph
from typing_extensions import TypedDict

RAIZ = Path(__file__).resolve().parent
CORPUS = RAIZ / "data" / "corpus.jsonl"
CHROMA_DIR = RAIZ / "chroma_db"
COLECCION = "f1_self_rag"
MODELO_EMBEDDING = "qwen3-embedding:0.6b"
MODELO_LLM = "llama3.2"
MODELO_BGE = "BAAI/bge-reranker-v2-m3-int8"
PREFIJO_QUERY = (
    "Instruct: Dada una pregunta sobre Fórmula 1, recupera el pasaje del corpus que la responde\n"
    "Query:"
)
C_RRF = 60
K_POOL = 8
K_FINAL = 5
OLLAMA = "http://127.0.0.1:11434"

PERMITIR_WEB: ContextVar[bool] = ContextVar("permitir_web", default=True)

PROMPT_CLASIFICAR = """No contestes la pregunta. Escribe solo una etiqueta: no_retrieve o retrieve.

no_retrieve: saludo, agradecimiento, despedida, traducción o cuenta. Aunque las palabras sean de Fórmula 1.
retrieve: pide un hecho, un nombre, una fecha, una cifra, un circuito, un piloto o un reglamento.

Ejemplos:
Pregunta: Buenos días
no_retrieve
Pregunta: Traduce safety car al español
no_retrieve
Pregunta: ¿Cuánto es 7 por 6?
no_retrieve
Pregunta: Gracias, eso es todo
no_retrieve
Pregunta: ¿Quién ganó en Monza en 2020?
retrieve
Pregunta: ¿Cuántos puntos da una victoria?
retrieve

Pregunta: {pregunta}
Etiqueta:"""

PROMPT_RELEVANCIA = """¿El fragmento responde a la pregunta? Contesta solo relevant o irrelevant.
Pregunta: {pregunta}
Fragmento: {fragmento}
"""

PROMPT_GENERAR = """Responde en español, en dos o tres frases, usando solo el contexto.
Si el contexto no contiene el dato, dilo con claridad y no lo completes con conocimientos de fuera.
No inventes cifras, nombres ni fechas.

Contexto:
{contexto}

Pregunta: {pregunta}
"""

PROMPT_CHARLA = """Responde en español, en una frase, y nada más.
Si te saludan, saluda.
Si agradecen o se despiden, despídete.
Si piden una cuenta, da el resultado.
Si piden una traducción, tradúcela.
Pregunta: {pregunta}
"""

PROMPT_SIN_CONTEXTO = """Responde en español, en una frase.
Di que no tienes documentos que respondan a la pregunta.
No añadas cifras, nombres ni datos de fuera.

Pregunta: {pregunta}
"""

PROMPT_REGENERAR = """La respuesta anterior no estaba soportada por el contexto.
Afirmaciones no soportadas:
{afirmaciones}

Escribe la respuesta de nuevo, en español y en dos o tres frases, usando solo el contexto.
No repitas esas afirmaciones.
Si el dato no está en el contexto, di que no consta.

Contexto:
{contexto}

Pregunta: {pregunta}
"""

PROMPT_WEB = """El corpus no ha soportado la respuesta. Estos fragmentos salen de una búsqueda web, no del corpus.
Úsalos solo si de verdad responden. Si no responden, di que tampoco la búsqueda lo aclara.
No inventes. Responde en español, en dos o tres frases.

Fragmentos web:
{contexto}

Pregunta: {pregunta}
"""

PROMPT_LIBRE = """Responde en español y sé concreto. Si sabes la cifra, dila.
El contexto es opcional: puedes responder con lo que sepas.

Contexto:
{contexto}

Pregunta: {pregunta}
"""

PROMPT_SOPORTE = """Etiqueta la respuesta. Una sola línea: fully_supported, partially_supported o not_supported.

- Paráfrasis de los fragmentos: fully_supported.
- Dice que el dato no consta, sin añadir otra cifra: fully_supported.
- Saludo, despedida, traducción o cálculo, sin un dato del mundo: fully_supported.
- Cifra o nombre que no está en los fragmentos: not_supported.
- Un dato que sí está y otro que no: partially_supported.

Fragmentos:
{contexto}

Pregunta: {pregunta}
Respuesta: {respuesta}
Etiqueta:"""


class Estado(TypedDict, total=False):
    pregunta: str
    decision: str
    fragmentos: list[dict]
    relevantes: list[dict]
    respuesta: str
    soporte: str
    soporte_inicial: str
    soporte_bruto: str
    afirmaciones: list[str]
    regenerada: bool
    web_usada: bool
    fuente: str
    confianza: str
    traza: list[str]


class Llamadas:
    def __init__(self) -> None:
        self.n = 0

    def reset(self) -> None:
        self.n = 0


llamadas = Llamadas()
documentos: list[Document] = []
embeddings: Embeddings | None = None
almacen: Chroma | None = None
denso = None
bm25: BM25Retriever | None = None
ensemble: EnsembleRetriever | None = None
reranker_bge: TextCrossEncoder | None = None
notas_bge: dict[tuple[str, str], float] = {}
llm_juez: ChatOllama | None = None
llm_resp: ChatOllama | None = None
_grafo = None
_indice_listo = False


def cargar_entorno() -> None:
    archivo = RAIZ / ".env"
    if not archivo.exists():
        return
    for linea in archivo.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        nombre, valor = linea.split("=", 1)
        os.environ.setdefault(nombre.strip(), valor.strip().strip('"').strip("'"))


def normalizar(texto: str) -> str:
    descompuesto = unicodedata.normalize("NFD", texto.lower())
    return "".join(caracter for caracter in descompuesto if unicodedata.category(caracter) != "Mn")


def rellenar(plantilla: str, **campos: str) -> str:
    texto = plantilla
    for clave, valor in campos.items():
        texto = texto.replace("{" + clave + "}", valor)
    return texto


def texto_de(mensaje) -> str:
    contenido = getattr(mensaje, "content", mensaje)
    if isinstance(contenido, list):
        partes = []
        for bloque in contenido:
            if isinstance(bloque, str):
                partes.append(bloque)
            elif isinstance(bloque, dict):
                partes.append(str(bloque.get("text", "")))
        return "".join(partes)
    return str(contenido or "")


def invocar(modelo: ChatOllama, prompt: str, *, cuenta: bool = True) -> str:
    ultimo = ""
    for _ in range(2):
        if cuenta:
            llamadas.n += 1
        ultimo = texto_de(modelo.invoke(prompt)).strip()
        if ultimo:
            return ultimo
    return ultimo


def sigmoide(valor: float) -> float:
    if valor >= 0:
        z = pow(2.718281828, -valor)
        return 1.0 / (1.0 + z)
    z = pow(2.718281828, valor)
    return z / (1.0 + z)


def tokenizar(texto: str) -> list[str]:
    return re.findall(r"[a-záéíóúüñ0-9]+", normalizar(texto))


def ollama_en_marcha() -> None:
    try:
        with urlopen(f"{OLLAMA}/api/tags", timeout=5) as respuesta:
            codigo = getattr(respuesta, "status", 200)
    except Exception as error:
        raise RuntimeError(
            "Ollama no responde en http://127.0.0.1:11434. Arranca el servicio y comprueba "
            f"que existen {MODELO_LLM} y {MODELO_EMBEDDING}."
        ) from error
    if codigo != 200:
        raise RuntimeError(f"Ollama ha contestado {codigo}")


def cargar_filas() -> list[dict]:
    filas = []
    for linea in CORPUS.read_text(encoding="utf-8").splitlines():
        linea = linea.strip()
        if linea:
            filas.append(json.loads(linea))
    if not filas:
        raise RuntimeError(f"El corpus está vacío: {CORPUS}")
    return filas


def trocear(filas: list[dict]) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1400,
        chunk_overlap=0,
        separators=["\n\n", "\n", ". ", " "],
    )
    trozos: list[Document] = []
    for fila in filas:
        partes = splitter.split_text(fila["texto"])
        if len(partes) != 1:
            print(f"aviso: {fila['id']} se partió en {len(partes)} fragmentos")
        for indice, parte in enumerate(partes):
            chunk_id = fila["id"] if len(partes) == 1 else f"{fila['id']}-{indice}"
            trozos.append(
                Document(
                    page_content=parte,
                    metadata={
                        "chunk_id": chunk_id,
                        "doc_id": fila["id"],
                        "titulo": fila["titulo"],
                        "tema": fila["tema"],
                    },
                    id=chunk_id,
                )
            )
    return trozos


def nombres_colecciones(cliente: chromadb.PersistentClient) -> set[str]:
    nombres = set()
    for coleccion in cliente.list_collections():
        if isinstance(coleccion, str):
            nombres.add(coleccion)
        else:
            nombres.add(getattr(coleccion, "name", str(coleccion)))
    return nombres


class EmbeddingsLocales(Embeddings):
    def __init__(self, modelo: str) -> None:
        self._interno = OllamaEmbeddings(
            model=modelo,
            base_url=OLLAMA,
            keep_alive=1800,
            client_kwargs={"timeout": 120},
        )
        self.cache: dict[str, list[float]] = {}

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self._interno.embed_documents(texts)

    def embed_query(self, text: str) -> list[float]:
        if text not in self.cache:
            self.cache[text] = self._interno.embed_query(f"{PREFIJO_QUERY} {text}")
        return self.cache[text]


def leer_documentos(cliente: chromadb.PersistentClient) -> list[Document]:
    cruda = cliente.get_collection(COLECCION)
    guardado = cruda.get(include=["documents", "metadatas"])
    leidos = []
    for identificador, texto, meta in zip(guardado["ids"], guardado["documents"], guardado["metadatas"]):
        meta = meta or {}
        meta.setdefault("chunk_id", identificador)
        leidos.append(Document(page_content=texto, metadata=meta, id=identificador))
    return leidos


def preparar_indice(reconstruir: bool = False) -> dict:
    global documentos, embeddings, almacen, denso, bm25, ensemble, reranker_bge, _indice_listo
    if _indice_listo and not reconstruir:
        return {
            "documentos": len({doc.metadata["doc_id"] for doc in documentos}),
            "fragmentos": len(documentos),
            "coleccion": COLECCION,
            "reconstruido": False,
        }

    ollama_en_marcha()
    cliente = chromadb.PersistentClient(path=str(CHROMA_DIR))
    if reconstruir and COLECCION in nombres_colecciones(cliente):
        cliente.delete_collection(COLECCION)

    embeddings = EmbeddingsLocales(MODELO_EMBEDDING)
    reconstruido = reconstruir or COLECCION not in nombres_colecciones(cliente)
    if reconstruido:
        trozos = trocear(cargar_filas())
        almacen = Chroma.from_documents(
            trozos,
            embeddings,
            ids=[doc.metadata["chunk_id"] for doc in trozos],
            client=cliente,
            collection_name=COLECCION,
            collection_metadata={"hnsw:space": "cosine"},
        )
    else:
        almacen = Chroma(
            client=cliente,
            collection_name=COLECCION,
            embedding_function=embeddings,
        )

    documentos = leer_documentos(cliente)
    if not documentos:
        raise RuntimeError("Chroma no tiene fragmentos. Vuelve a preparar el índice con reconstruir=True.")

    denso = almacen.as_retriever(search_kwargs={"k": K_POOL})
    bm25 = BM25Retriever.from_documents(documentos, preprocess_func=tokenizar)
    bm25.k = K_POOL
    ensemble = EnsembleRetriever(
        retrievers=[denso, bm25],
        weights=[0.5, 0.5],
        c=C_RRF,
        id_key="chunk_id",
    )

    if reranker_bge is None:
        inicio = time.perf_counter()
        reranker_bge = TextCrossEncoder(
            model_name=MODELO_BGE,
            cache_dir=str(RAIZ / ".fastembed_cache"),
            cuda=False,
            threads=8,
        )
        print(f"BGE cargado en {time.perf_counter() - inicio:.1f} s")

    global llm_juez, llm_resp
    if llm_juez is None:
        llm_juez = ChatOllama(
            model=MODELO_LLM,
            base_url=OLLAMA,
            temperature=0,
            num_ctx=2048,
            num_predict=32,
            keep_alive=1800,
            client_kwargs={"timeout": 180},
        )
        llm_resp = ChatOllama(
            model=MODELO_LLM,
            base_url=OLLAMA,
            temperature=0,
            num_ctx=4096,
            num_predict=220,
            keep_alive=1800,
            client_kwargs={"timeout": 180},
        )

    embeddings.embed_query("cuántos puntos da una victoria")
    invocar(llm_juez, "Responde exactamente: ok", cuenta=False)
    list(reranker_bge.rerank("victoria", ["El ganador recibe 25 puntos."], batch_size=1))
    _indice_listo = True
    return {
        "documentos": len({doc.metadata["doc_id"] for doc in documentos}),
        "fragmentos": len(documentos),
        "coleccion": COLECCION,
        "embedding": MODELO_EMBEDDING,
        "llm": MODELO_LLM,
        "reranker": MODELO_BGE,
        "reconstruido": reconstruido,
    }


def candidatos(pregunta: str, k: int) -> tuple[list[Document], float]:
    if ensemble is None or denso is None or bm25 is None:
        raise RuntimeError("El índice no está preparado")
    denso.search_kwargs["k"] = k
    bm25.k = k
    inicio = time.perf_counter()
    bruto = ensemble.invoke(pregunta)
    segundos = time.perf_counter() - inicio
    vistos: set[str] = set()
    unicos: list[Document] = []
    for doc in bruto:
        identificador = str(doc.metadata.get("chunk_id") or doc.page_content[:80])
        if identificador in vistos:
            continue
        vistos.add(identificador)
        unicos.append(doc)
        if len(unicos) == k:
            break
    return unicos, segundos


def rerank(pregunta: str, docs: list[Document]) -> tuple[list[Document], float]:
    if reranker_bge is None:
        raise RuntimeError("El reranker no está cargado")
    if not docs:
        return [], 0.0
    faltan = [doc for doc in docs if (pregunta, doc.metadata["chunk_id"]) not in notas_bge]
    segundos = 0.0
    if faltan:
        inicio = time.perf_counter()
        notas = list(reranker_bge.rerank(pregunta, [doc.page_content for doc in faltan], batch_size=8))
        segundos = time.perf_counter() - inicio
        for doc, nota in zip(faltan, notas):
            notas_bge[(pregunta, doc.metadata["chunk_id"])] = float(nota)
    orden = sorted(docs, key=lambda doc: notas_bge[(pregunta, doc.metadata["chunk_id"])], reverse=True)
    salida = []
    for doc in orden:
        nota = notas_bge[(pregunta, doc.metadata["chunk_id"])]
        meta = {**doc.metadata, "rerank": nota, "rerank_01": sigmoide(nota)}
        salida.append(Document(page_content=doc.page_content, metadata=meta, id=doc.id))
    return salida, segundos


def hibrido_rerank(pregunta: str, k_pool: int = K_POOL, k_final: int = K_FINAL) -> dict:
    pool, t_busqueda = candidatos(pregunta, k_pool)
    ordenados, t_rerank = rerank(pregunta, pool)
    return {
        "docs": ordenados[:k_final],
        "pool": len(pool),
        "t_busqueda": t_busqueda,
        "t_rerank": t_rerank,
    }


def parsear_decision(bruto: str) -> str:
    linea = normalizar((bruto or "").strip().splitlines()[0] if bruto and bruto.strip() else "")
    compacta = linea.replace("-", "_").replace(" ", "")
    if "no_retrieve" in compacta or "noretrieve" in compacta:
        return "no_retrieve"
    if "retrieve" in compacta:
        return "retrieve"
    if compacta.startswith("no"):
        return "no_retrieve"
    return "retrieve"


def parsear_relevancia(bruto: str) -> bool:
    linea = normalizar((bruto or "").strip().splitlines()[0] if bruto and bruto.strip() else "")
    if "irrelevant" in linea or "irrelevante" in linea:
        return False
    if re.search(r"\bno\b.{0,16}relevante", linea):
        return False
    if "relevant" in linea or "relevante" in linea:
        return True
    return False


def parsear_soporte(bruto: str) -> dict:
    soporte_linea = ""
    af_linea = ""
    for linea in (bruto or "").splitlines():
        limpia = linea.strip()
        cabecera = normalizar(limpia)
        if not soporte_linea and (cabecera.startswith("soporte") or cabecera.startswith("etiqueta")):
            soporte_linea = cabecera.split(":", 1)[-1].strip()
        elif not af_linea and cabecera.startswith("afirmacion"):
            af_linea = limpia.split(":", 1)[-1].strip()
        if soporte_linea and af_linea:
            break
    if not soporte_linea:
        soporte_linea = normalizar((bruto or "").strip().splitlines()[0] if bruto and bruto.strip() else "")
    if "partial" in soporte_linea or "parcial" in soporte_linea:
        soporte = "partially_supported"
    elif "not" in soporte_linea or "no soport" in soporte_linea or soporte_linea.strip() in {"no", "ninguno"}:
        soporte = "not_supported"
    elif "full" in soporte_linea or "total" in soporte_linea or "complet" in soporte_linea:
        soporte = "fully_supported"
    else:
        soporte = "partially_supported"
    afirmaciones: list[str] = []
    if af_linea and normalizar(af_linea) not in {"ninguna", "none", "ninguno", "-", "n/a"}:
        afirmaciones = [parte.strip() for parte in af_linea.split("||") if parte.strip()]
    return {"soporte": soporte, "afirmaciones": afirmaciones, "bruto": (bruto or "").strip()}


def clasificar_retrieval(pregunta: str) -> str:
    if llm_juez is None:
        raise RuntimeError("El modelo no está cargado")
    bruto = invocar(llm_juez, rellenar(PROMPT_CLASIFICAR, pregunta=pregunta))
    return parsear_decision(bruto)


def es_relevante(pregunta: str, fragmento: str) -> bool:
    if llm_juez is None:
        raise RuntimeError("El modelo no está cargado")
    bruto = invocar(llm_juez, rellenar(PROMPT_RELEVANCIA, pregunta=pregunta, fragmento=fragmento))
    return parsear_relevancia(bruto)


def formatear(docs: list[Document]) -> str:
    if not docs:
        return "(sin fragmentos)"
    bloques = []
    for indice, doc in enumerate(docs, start=1):
        titulo = doc.metadata.get("titulo", "fragmento")
        bloques.append(f"[{indice}] {titulo}\n{doc.page_content}")
    return "\n\n".join(bloques)


def generar_respuesta(
    pregunta: str,
    docs: list[Document],
    *,
    afirmaciones: list[str] | None = None,
    web: bool = False,
    charla: bool = False,
) -> str:
    if llm_resp is None:
        raise RuntimeError("El modelo no está cargado")
    contexto = formatear(docs)
    if web:
        prompt = rellenar(PROMPT_WEB, contexto=contexto, pregunta=pregunta)
    elif afirmaciones is not None:
        texto_af = "\n".join(f"- {frase}" for frase in afirmaciones) or "- la respuesta anterior añadía datos que no estaban en el contexto"
        prompt = rellenar(PROMPT_REGENERAR, afirmaciones=texto_af, contexto=contexto, pregunta=pregunta)
    elif not docs and charla:
        prompt = rellenar(PROMPT_CHARLA, pregunta=pregunta)
    elif not docs:
        prompt = rellenar(PROMPT_SIN_CONTEXTO, pregunta=pregunta)
    else:
        prompt = rellenar(PROMPT_GENERAR, contexto=contexto, pregunta=pregunta)
    return invocar(llm_resp, prompt)


def generar_libre(pregunta: str, docs: list[Document]) -> str:
    if llm_resp is None:
        raise RuntimeError("El modelo no está cargado")
    return invocar(llm_resp, rellenar(PROMPT_LIBRE, contexto=formatear(docs), pregunta=pregunta))


def verificar_soporte(pregunta: str, docs: list[Document], respuesta: str) -> dict:
    if llm_juez is None:
        raise RuntimeError("El modelo no está cargado")
    bruto = invocar(
        llm_juez,
        rellenar(PROMPT_SOPORTE, contexto=formatear(docs), pregunta=pregunta, respuesta=respuesta),
    )
    juicio = parsear_soporte(bruto)
    # llama3.2 marca «no consta» como not_supported. Si la frase se abstiene y no
    # mete una cifra nueva, el grado correcto es fully_supported.
    if (
        not docs
        and juicio["soporte"] == "not_supported"
        and parece_abstencion(respuesta)
        and not cifra_sospechosa(respuesta, pregunta)
    ):
        juicio = {**juicio, "soporte": "fully_supported", "afirmaciones": []}
    return juicio


def filtrar_relevantes(pregunta: str, docs: list[Document]) -> tuple[list[Document], list[dict]]:
    buenos: list[Document] = []
    detalle: list[dict] = []
    for doc in docs:
        relevante = es_relevante(pregunta, doc.page_content)
        detalle.append(
            {
                "chunk_id": doc.metadata.get("chunk_id", ""),
                "titulo": doc.metadata.get("titulo", ""),
                "relevant": relevante,
                "nota": float(doc.metadata.get("rerank_01", 0.0) or 0.0),
            }
        )
        if relevante:
            buenos.append(doc)
    return buenos, detalle


def web_disponible() -> bool:
    if os.environ.get("TAVILY_API_KEY", "").strip():
        return True
    try:
        import ddgs  # noqa: F401
    except ImportError:
        return False
    return True


def _filas_a_docs(filas: list[dict]) -> list[Document]:
    docs = []
    for indice, fila in enumerate(filas[:4]):
        titulo = str(fila.get("title") or fila.get("titulo") or "web")
        cuerpo = str(fila.get("body") or fila.get("content") or fila.get("snippet") or "")
        url = str(fila.get("href") or fila.get("url") or "")
        texto = f"{titulo}. {cuerpo}".strip()[:700]
        if not texto:
            continue
        chunk_id = f"web-{indice}"
        docs.append(
            Document(
                page_content=texto,
                metadata={
                    "chunk_id": chunk_id,
                    "doc_id": "web",
                    "titulo": titulo,
                    "tema": "web",
                    "url": url,
                },
                id=chunk_id,
            )
        )
    return docs


def _tavily(pregunta: str, clave: str) -> list[Document]:
    cuerpo = json.dumps(
        {
            "api_key": clave,
            "query": pregunta,
            "max_results": 4,
            "search_depth": "basic",
            "include_answer": False,
        }
    ).encode()
    peticion = Request(
        "https://api.tavily.com/search",
        data=cuerpo,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(peticion, timeout=20) as respuesta:
        datos = json.load(respuesta)
    return _filas_a_docs(datos.get("results", []))


def _duckduckgo(pregunta: str) -> list[Document]:
    from ddgs import DDGS

    cliente = DDGS(timeout=20)
    try:
        bruto = cliente.text(pregunta, region="es-es", max_results=4)
    except TypeError:
        bruto = cliente.text(pregunta, max_results=4)
    return _filas_a_docs(list(bruto))


def buscar_web(pregunta: str) -> list[Document]:
    clave = os.environ.get("TAVILY_API_KEY", "").strip()
    try:
        if clave:
            return _tavily(pregunta, clave)
        return _duckduckgo(pregunta)
    except Exception as error:
        print(f"búsqueda web no disponible: {type(error).__name__}: {error}")
        return []


def doc_a_dict(doc: Document) -> dict:
    return {
        "texto": doc.page_content,
        "titulo": doc.metadata.get("titulo", ""),
        "chunk_id": doc.metadata.get("chunk_id", ""),
        "doc_id": doc.metadata.get("doc_id", ""),
        "tema": doc.metadata.get("tema", ""),
        "url": doc.metadata.get("url", ""),
        "rerank_01": float(doc.metadata.get("rerank_01", 0.0) or 0.0),
    }


def dict_a_doc(fila: dict) -> Document:
    chunk_id = fila.get("chunk_id") or ""
    return Document(
        page_content=fila.get("texto", ""),
        metadata={
            "titulo": fila.get("titulo", ""),
            "chunk_id": chunk_id,
            "doc_id": fila.get("doc_id", ""),
            "tema": fila.get("tema", ""),
            "url": fila.get("url", ""),
            "rerank_01": fila.get("rerank_01", 0.0),
        },
        id=chunk_id or None,
    )


def nodo_clasificar(estado: Estado) -> dict:
    decision = clasificar_retrieval(estado["pregunta"])
    return {"decision": decision, "traza": estado.get("traza", []) + [f"retrieval:{decision}"]}


def nodo_recuperar(estado: Estado) -> dict:
    resultado = hibrido_rerank(estado["pregunta"], K_POOL, K_FINAL)
    return {
        "fragmentos": [doc_a_dict(doc) for doc in resultado["docs"]],
        "traza": estado.get("traza", []) + [f"hibrido+rerank:{len(resultado['docs'])}"],
    }


def nodo_filtrar(estado: Estado) -> dict:
    docs = [dict_a_doc(fila) for fila in estado.get("fragmentos", [])]
    buenos, detalle = filtrar_relevantes(estado["pregunta"], docs)
    relevantes = sum(1 for fila in detalle if fila["relevant"])
    return {
        "relevantes": [doc_a_dict(doc) for doc in buenos],
        "traza": estado.get("traza", []) + [f"isrel:{relevantes}/{len(detalle)}"],
    }


def _fuente_de(estado: Estado, docs: list[dict]) -> str:
    if estado.get("decision") == "no_retrieve":
        return "parametrico"
    if docs:
        return "corpus"
    return "sin_fragmentos"


def nodo_generar(estado: Estado) -> dict:
    filas = estado.get("relevantes") or []
    respuesta = generar_respuesta(
        estado["pregunta"],
        [dict_a_doc(fila) for fila in filas],
        charla=estado.get("decision") == "no_retrieve",
    )
    return {
        "respuesta": respuesta,
        "fuente": _fuente_de(estado, filas),
        "traza": estado.get("traza", []) + ["generar"],
    }


def nodo_verificar(estado: Estado) -> dict:
    docs = [dict_a_doc(fila) for fila in estado.get("relevantes") or []]
    respuesta = estado.get("respuesta", "")
    juicio = verificar_soporte(estado["pregunta"], docs, respuesta)
    # Sin fragmentos, una respuesta que afirma un dato no está soportada, aunque
    # el juez la dé por buena. Los saludos y los cálculos llegan por no_retrieve.
    if estado.get("decision") == "no_retrieve":
        juicio = {**juicio, "soporte": "fully_supported", "afirmaciones": []}
    elif (
        not docs
        and estado.get("decision") == "retrieve"
        and juicio["soporte"] == "fully_supported"
        and not parece_abstencion(respuesta)
    ):
        juicio = {
            **juicio,
            "soporte": "not_supported",
            "afirmaciones": ["la respuesta afirma un dato y no hay fragmentos que lo sostengan"],
        }
    salida = {
        "soporte": juicio["soporte"],
        "afirmaciones": juicio["afirmaciones"],
        "soporte_bruto": juicio["bruto"][:400],
        "traza": estado.get("traza", []) + [f"issup:{juicio['soporte']}"],
    }
    if not estado.get("soporte_inicial"):
        salida["soporte_inicial"] = juicio["soporte"]
    return salida


def nodo_regenerar(estado: Estado) -> dict:
    docs = [dict_a_doc(fila) for fila in estado.get("relevantes") or []]
    respuesta = generar_respuesta(
        estado["pregunta"],
        docs,
        afirmaciones=estado.get("afirmaciones") or [],
    )
    return {
        "respuesta": respuesta,
        "regenerada": True,
        "traza": estado.get("traza", []) + ["regen"],
    }


def nodo_web(estado: Estado) -> dict:
    docs = buscar_web(estado["pregunta"])
    traza = estado.get("traza", []) + [f"web:{len(docs)}"]
    if not docs:
        return {"web_usada": True, "traza": traza}
    respuesta = generar_respuesta(estado["pregunta"], docs, web=True)
    return {
        "web_usada": True,
        "fuente": "web",
        "relevantes": [doc_a_dict(doc) for doc in docs],
        "respuesta": respuesta,
        "traza": traza,
    }


def nodo_cerrar(estado: Estado) -> dict:
    mapa = {
        "fully_supported": "high",
        "partially_supported": "medium",
        "not_supported": "low",
    }
    return {"confianza": mapa.get(estado.get("soporte", ""), "low")}


def ruta_decision(estado: Estado) -> Literal["recuperar", "generar"]:
    if estado.get("decision") == "retrieve":
        return "recuperar"
    return "generar"


def ruta_soporte(estado: Estado) -> Literal["regenerar", "web", "cerrar"]:
    if estado.get("soporte") != "not_supported" or estado.get("decision") == "no_retrieve":
        return "cerrar"
    if not estado.get("regenerada") and estado.get("relevantes"):
        return "regenerar"
    if not estado.get("web_usada") and PERMITIR_WEB.get() and web_disponible():
        return "web"
    return "cerrar"


def ruta_tras_web(estado: Estado) -> Literal["verificar", "cerrar"]:
    if estado.get("fuente") == "web":
        return "verificar"
    return "cerrar"


def construir_grafo():
    grafo = StateGraph(Estado)
    grafo.add_node("clasificar", nodo_clasificar)
    grafo.add_node("recuperar", nodo_recuperar)
    grafo.add_node("filtrar", nodo_filtrar)
    grafo.add_node("generar", nodo_generar)
    grafo.add_node("verificar", nodo_verificar)
    grafo.add_node("regenerar", nodo_regenerar)
    grafo.add_node("web", nodo_web)
    grafo.add_node("cerrar", nodo_cerrar)
    grafo.set_entry_point("clasificar")
    grafo.add_conditional_edges(
        "clasificar",
        ruta_decision,
        {"recuperar": "recuperar", "generar": "generar"},
    )
    grafo.add_edge("recuperar", "filtrar")
    grafo.add_edge("filtrar", "generar")
    grafo.add_edge("generar", "verificar")
    grafo.add_conditional_edges(
        "verificar",
        ruta_soporte,
        {"regenerar": "regenerar", "web": "web", "cerrar": "cerrar"},
    )
    grafo.add_edge("regenerar", "verificar")
    grafo.add_conditional_edges(
        "web",
        ruta_tras_web,
        {"verificar": "verificar", "cerrar": "cerrar"},
    )
    grafo.add_edge("cerrar", END)
    return grafo.compile()


def obtener_grafo():
    global _grafo
    if _grafo is None:
        _grafo = construir_grafo()
    return _grafo


def mermaid() -> str:
    return obtener_grafo().get_graph().draw_mermaid()


def responder(pregunta: str, *, permitir_web: bool = True) -> dict:
    if not _indice_listo:
        preparar_indice(reconstruir=False)
    llamadas.reset()
    token = PERMITIR_WEB.set(permitir_web)
    inicio = time.perf_counter()
    try:
        estado = obtener_grafo().invoke(
            {
                "pregunta": pregunta,
                "decision": "",
                "fragmentos": [],
                "relevantes": [],
                "respuesta": "",
                "soporte": "",
                "soporte_inicial": "",
                "soporte_bruto": "",
                "afirmaciones": [],
                "regenerada": False,
                "web_usada": False,
                "fuente": "",
                "confianza": "",
                "traza": [],
            },
            config={"recursion_limit": 15},
        )
    finally:
        PERMITIR_WEB.reset(token)
    relevantes = estado.get("relevantes") or []
    return {
        "pregunta": pregunta,
        "respuesta": estado.get("respuesta", ""),
        "confidence": estado.get("confianza", "low"),
        "soporte": estado.get("soporte", ""),
        "soporte_inicial": estado.get("soporte_inicial", ""),
        "soporte_bruto": estado.get("soporte_bruto", ""),
        "decision": estado.get("decision", ""),
        "fuente": estado.get("fuente", ""),
        "regenerada": bool(estado.get("regenerada")),
        "web_usada": bool(estado.get("web_usada")),
        "afirmaciones": estado.get("afirmaciones") or [],
        "llamadas_llm": llamadas.n,
        "latencia_s": time.perf_counter() - inicio,
        "traza": estado.get("traza") or [],
        "fuentes": [fila.get("titulo", "") for fila in relevantes],
    }


def contiene_ancla(texto: str, anclas: list[str]) -> bool:
    base = normalizar(texto)
    return any(normalizar(ancla) in base for ancla in anclas)


def parece_abstencion(texto: str) -> bool:
    base = normalizar(texto)
    pistas = (
        "no aparece",
        "no consta",
        "no lo dice",
        "no indica",
        "no recoge",
        "no se menciona",
        "no menciona",
        "no esta en",
        "no estan",
        "no figura",
        "no contiene",
        "no tengo",
        "no puedo",
        "no se indica",
        "no lo se",
        "no se sabe",
        "no hay dato",
        "no hay datos",
        "no incluye",
        "no trae",
        "no aporta",
        "no precisa",
        "no especifica",
        "no detalla",
        "documento delante",
        "no lo aclara",
        "no lo recoge",
        "sin ese dato",
        "no proporciona",
    )
    return any(pista in base for pista in pistas)


def cifra_nueva(respuesta: str, pregunta: str) -> bool:
    def cifras(texto: str) -> set[str]:
        return set(re.findall(r"\d{2,}", texto))

    return bool(cifras(respuesta) - cifras(pregunta))


def cifra_sospechosa(respuesta: str, pregunta: str) -> bool:
    nuevas = set(re.findall(r"\d{2,}", respuesta)) - set(re.findall(r"\d{2,}", pregunta))
    for cifra in nuevas:
        if len(cifra) == 4 and cifra.startswith(("19", "20")):
            continue
        return True
    return False


def autocomprobar() -> None:
    assert parsear_decision("retrieve") == "retrieve"
    assert parsear_decision("no_retrieve") == "no_retrieve"
    assert parsear_decision("No retrieve. Es un saludo.") == "no_retrieve"
    assert parsear_relevancia("irrelevant") is False
    assert parsear_relevancia("relevant") is True
    assert parsear_relevancia("irrelevante") is False
    assert parsear_relevancia("El fragmento es relevante") is True
    assert parsear_relevancia("No es relevante para la pregunta") is False
    juicio = parsear_soporte("SOPORTE: not_supported\nAFIRMACIONES: tiene 32 victorias || otro dato")
    assert juicio["soporte"] == "not_supported"
    assert juicio["afirmaciones"] == ["tiene 32 victorias", "otro dato"]
    juicio = parsear_soporte("SOPORTE: fully_supported\nAFIRMACIONES: ninguna")
    assert juicio["soporte"] == "fully_supported" and juicio["afirmaciones"] == []
    juicio = parsear_soporte("SOPORTE: partially_supported\nAFIRMACIONES: el año")
    assert juicio["soporte"] == "partially_supported"
    assert normalizar("Mayländer") == "maylander"
    assert contiene_ancla("Franco Colapinto debutó", ["colapinto"])
    assert not cifra_nueva("no consta", "¿Cuántos clientes tiene Ferrari?")
    assert cifra_nueva("tiene 900 clientes", "¿Cuántos clientes tiene Ferrari?")
