# Constitución — ChromaDB

ChromaDB es un RAG con la documentación oficial de Python, de la versión que se descarga. Sirve para que un agente consulte esa documentación cuando genera código.

Lo de abajo no se negocia. El detalle está en los ficheros enlazados, no se repite aquí.

## Condiciones

- Solo entra la documentación de la versión descargada. Lo de otras versiones se excluye al indexar.
- Todo corre en local: ChromaDB guarda los datos en `chroma_db/` y Ollama calcula los embeddings.
- No se recorta información: ningún fragmento se trunca al calcular su embedding.
- El agente consulta con scripts de terminal, no con un MCP.
- `python-docs/` es solo lectura.
- Los scripts abren `chroma_db/` directamente, sin servidor. El servidor de Chroma solo se arranca para usar ChromaDash, nunca mientras un script escribe, y se para al terminar.
- `python-docs/`, `python-docs-md/`, `chroma_db/` y `.venv/` no van a git.
- Cada participante construye su índice en su equipo. El modelo de embeddings no va en git.
- Cada capa de `src/` solo llama a la de debajo. El RAG de `scripts/` no usa esas capas.
- Un fichero de código contiene una función. No hay clases, salvo que una librería las pida.
- Antes de una dependencia nueva, se explica qué problema resuelve y la persona decide. En `requirements.txt` va con la versión fija.
- La contraseña del ciclo no se copia a ningún fichero.

## Dónde está el detalle

- Estilo, Black y Ruff: `docs/STYLE.md`
- Carpetas: `docs/TREE.md`
- Los dos cauces: `docs/ARCHITECTURE.md`
- Chroma y SQLite: `docs/DATABASE.md`
- Qué no sale del equipo: `docs/SECURITY.md`
- Notebooks: `docs/JUPYTER.md`
- Dependencias: `docs/DEPENDENCIES.md`
- Comandos: `docs/COMMANDS.md`
