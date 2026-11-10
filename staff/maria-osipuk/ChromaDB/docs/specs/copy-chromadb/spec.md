# Spec · ChromaDB en la carpeta de Maria

Issue #576.

El ejercicio `exercises/ChromaDB` es un RAG con la documentación oficial de Python. En `staff/maria-osipuk/` aún no existe una copia propia con su base de datos.

## Qué hay que hacer

- `exercises/ChromaDB` se copia a `staff/maria-osipuk/ChromaDB`. La copia es fiel: mismos ficheros, sin `.venv/`, `python-docs/`, `python-docs-md/` ni `chroma_db/`.
- En la copia se crea el entorno virtual, se instalan las dependencias y se descarga el modelo `qwen3-embedding:0.6b` con Ollama.
- Se descarga la documentación de Python **3.14**, la versión de Python instalada en este equipo (3.14.4). El README usa 3.15 solo como ejemplo. Se convierte a Markdown.
- Se construye la base de datos de Chroma en `chroma_db/`. La colección es `python_3_14_docs`.
- `exercises/ChromaDB` no se modifica.
- Si Ollama se cae a mitad de un lote (`llama-server` aborta en Mac con Metal, en el lote 102 de 343), `embed_texts.py` reintenta hasta 3 veces con 5 s de pausa. `EMBED_RETRIES` y `EMBED_PAUSE` van en `scripts/settings.py`. Los embeddings no cambian.

## Comprobaciones

1. `staff/maria-osipuk/ChromaDB` tiene los mismos ficheros versionados que `exercises/ChromaDB` (`diff -rq`, sin contar las carpetas ignoradas). Las únicas diferencias son `docs/specs/copy-chromadb/`, `scripts/embed_texts.py` y `scripts/settings.py`.
2. `exercises/ChromaDB` no tiene cambios en git.
3. `ollama list` muestra `qwen3-embedding:0.6b`.
4. `python-docs-md/` existe y `convert_docs.py` ha impreso cuántas páginas convirtió.
5. `build_index.py` termina sin error y su última línea es `Collection python_3_14_docs: ... chunks`.
6. `python scripts/search.py "read the contents of a text file"` devuelve resultados.
7. `python scripts/get_doc.py pathlib.Path.read_text` devuelve el documento.
8. `git status` no muestra `.venv/`, `python-docs/`, `python-docs-md/` ni `chroma_db/`: están ignorados.
9. No queda ningún proceso de Chroma ni de los scripts en marcha.

## Fuera de alcance

- Cambiar otros scripts, el modelo de embeddings, los tamaños de `scripts/settings.py` o el CRUD de usuarios. Solo se tocan `embed_texts.py` y las dos constantes de reintento.
- Tocar `src/core` o `src/sdk`.
- Indexar más de una versión de Python.
- Arrancar ChromaDash.
