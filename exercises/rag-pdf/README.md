# Pipeline RAG sobre los PDF de Python 3.13

`ejercicio_3_1_rag_pdf.ipynb` indexa la documentación oficial de Python 3.13 en PDF y responde con una cadena LCEL. El corpus es el lenguaje, no la biblioteca estándar: tutorial, referencia y siete howtos (477 páginas). `library.pdf` se queda fuera porque son 2.419 páginas y mezclan toda la stdlib.

No hay API de pago. Ollama, en local, calcula los embeddings con `qwen3-embedding:0.6b` y las respuestas con `llama3.2`. ChromaDB guarda el índice en `chroma_db/`.

`ejercicio_3_2_hybrid_search.ipynb` usa ese mismo índice. Compara búsqueda densa, BM25 y la mezcla de las dos, y repite la mezcla dentro de Qdrant en local.

`ejercicio_3_3_reranking.ipynb` reordena el top 30 de esa mezcla con `bge-reranker-v2-m3` en local. Si `.env` tiene `COHERE_API_KEY`, también llama a `rerank-v3.5`.

Python 3.15 ya no publica esos PDF. El archivo de 3.13 sigue en https://docs.python.org/3.13/download.html

## Entorno

ChromaDB necesita `onnxruntime`, y esa rueda no existe todavía para Python 3.15. Usa 3.14.

Ollama tiene que estar en marcha y con estos dos modelos, que en esta máquina ya están descargados:

```bash
ollama list
# qwen3-embedding:0.6b
# llama3.2:latest
```

```bash
python3.14 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m ipykernel install --user --name rag-pdf --display-name rag-pdf
jupyter notebook ejercicio_3_1_rag_pdf.ipynb
```

En Cursor, elige el kernel `rag-pdf`.

Los nueve PDF ya están en `data/pdfs/`. Si faltan, el notebook descarga el archivo oficial y se queda solo con esos nueve. `RECONSTRUIR = True` vuelve a calcular los embeddings.
