# Self-RAG sobre Fórmula 1

`ejercicio_4_2_self_rag.ipynb` implementa un Self-RAG simplificado. No entrena nada: `llama3.2`, en local, clasifica, filtra fragmentos, genera y juzga si la respuesta está soportada. El grafo está hecho con LangGraph.

El corpus son 26 apuntes de Fórmula 1 cerrados al final de 2024 (`data/corpus.jsonl`). Hay hechos que el modelo pequeño no tiene (constructores 2024, el debut de Colapinto) y huecos a propósito (clientes de Ferrari, cifra del cost cap, victorias de Alonso).

La búsqueda es la de los ejercicios 3.2 y 3.3: denso con `qwen3-embedding:0.6b`, BM25, fusión RRF 0.5/0.5 y `bge-reranker-v2-m3` en local. No hay API de pago. El fallback web, si la respuesta queda `not_supported`, usa DuckDuckGo. Tavily solo entra si `.env` trae `TAVILY_API_KEY`.

## Entorno

ChromaDB necesita `onnxruntime`, y esa rueda no está en Python 3.15. Usa 3.14.

Ollama tiene que estar en marcha, con los mismos modelos que el ejercicio de los PDF:

```bash
ollama list
# qwen3-embedding:0.6b
# llama3.2:latest
```

```bash
python3.14 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m ipykernel install --user --name self-rag --display-name self-rag
jupyter notebook ejercicio_4_2_self_rag.ipynb
```

En Cursor, elige el kernel `self-rag`.

La primera ejecución embebe el corpus en `chroma_db/` y descarga el reranker en `.fastembed_cache/` si no está. `preparar_indice(reconstruir=True)` repite los embeddings.

`selfrag.py` es el pipeline. El notebook mide el clasificador, el filtro de relevancia frente al reranker, y el grafo completo.
