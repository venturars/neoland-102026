# Arquitectura — ChromaDB

Hay dos cauces. No se mezclan. El RAG no importa `src/`. El CRUD no usa Chroma ni Ollama.

## Cauce del RAG

Vive en `scripts/`. Cada fichero tiene una función. No usa las capas de `src/`.

Lo que lanza una persona, en este orden:

1. `download_docs.py` baja el HTML oficial a `python-docs/`.
2. `convert_docs.py` lo pasa a Markdown en `python-docs-md/`.
3. `count_chunks.py` revisa el troceado. No escribe el índice.
4. `build_index.py` trocea, pide los vectores a Ollama y los guarda en `chroma_db/`.
5. `search.py` busca por significado. `get_doc.py` busca por nombre exacto.

Los demás scripts son pasos de esos cinco: trocear, convertir una página, calcular un vector. Siguen siendo un fichero y una función. Un script puede llamar a otro script. No llama a `sdk`, `core`, `storage` ni `db`.

## Cauce del CRUD

Vive en `src/`. Guarda usuarios en SQLite. Cada capa solo llama a la de debajo:

1. `clients/jupyter/`. Un notebook por acción. Solo usa `sdk`.
2. `sdk/`. Adapta lo que llega del cliente y llama a `core`.
3. `core/`. Valida los datos, aplica las reglas y llama a `storage`.
4. `storage/`. Lee y escribe. El SQL va en `storage/queries/`.
5. `db/`. Abre `users.sqlite`, aplica `schema.sql` y devuelve la conexión.

`core` no escribe SQL. `storage` no decide si un email es válido. `sdk` no abre la base. Un notebook no importa `core` ni `storage`.

El cuerpo de una función de `src/` sigue el orden de `docs/STYLE.md`: validar la entrada, validar las reglas, aplicar la lógica, estructurar la salida.

## Qué no hace un cambio de arquitectura

Mover un script del RAG a una capa de `src/`, o hacer que el CRUD consulte Chroma, es otro cambio. Esta separación se mantiene.
