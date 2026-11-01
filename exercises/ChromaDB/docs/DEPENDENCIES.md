# Dependencias — ChromaDB

Antes de instalar una dependencia nueva, o de cambiar su versión, se explica qué problema resuelve y por qué no basta con lo que ya hay. La persona decide. En `requirements.txt` va con la versión fija. No se fija aquí el árbol entero de dependencias transitivas: solo lo que el proyecto pide.

Se instalan con el entorno activo, desde `exercises/ChromaDB`:

```bash
python -m pip install -r requirements.txt
```

## Las que ya estaban

- `chromadb`. Guarda y consulta el índice en `chroma_db/`.
- `ollama`. Pide los embeddings al modelo local.
- `beautifulsoup4` y `lxml`. Leen el HTML oficial al pasarlo a Markdown.
- `jupyter`. Abre los notebooks del CRUD.

## Las de esta revisión

- `black`. Formatea el Python de `scripts/`, `src/` y `tests/` a 79 columnas. El estilo a mano no se sostiene igual en cada cambio.
- `ruff`. Avisa de pycodestyle, pyflakes y el orden de imports. No formatea: eso es Black.
- `pytest`. Ejecuta los tests que escribe `code_tester`.

El modelo `qwen3-embedding:0.6b` no es un paquete de pip. Se descarga con Ollama, como dice `docs/COMMANDS.md`.
