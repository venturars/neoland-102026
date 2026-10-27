# AGENTS.md — ChromaDB

## Proyecto

ChromaDB es un RAG con la documentación oficial de Python 3.15. Un agente la consulta con scripts cuando genera código.

Está hecho en Python, con ChromaDB y embeddings de Ollama en local. Las condiciones, el estilo y las convenciones están en `docs/CONSTITUTION.md`.

## Reglas

- Lee `docs/CONSTITUTION.md` antes de tocar código.
- Antes de escribir código de Python, consulta la documentación de Python 3.15 con la skill de `SKILL.md`: sigue lo que va desde la primera línea `---` hasta el final.
- Antes de escribir, investiga y mira si lo que vas a hacer se parece a algo que ya existe.
- Temperatura próxima a 0. No inventes. Si algo no está claro, o si la constitución y el código dicen cosas distintas, pregunta antes de escribir código.
- No propongas código que no se haya comprobado.
- No hagas commits ni pushes sin que la persona lo pida.

## Comandos

Desde `exercises/ChromaDB/`, en PowerShell:

- Activar el entorno: `.venv\Scripts\Activate.ps1`
- Instalar dependencias: `pip install -r requirements.txt`
- Descargar el modelo: `ollama pull qwen3-embedding:0.6b`
- Regenerar el Markdown desde el HTML: `python scripts/convert_docs.py`
- Revisar el troceado: `python scripts/count_chunks.py`
- Construir el índice: `python scripts/build_index.py`
- Consultar: `python scripts/search.py "pregunta"` y `python scripts/get_doc.py nombre.exacto`
- CRUD de usuarios: `jupyter notebook src/clients/jupyter`
- Tests: no hay.
- Formato y lint: no hay.

## Al terminar una tarea

- Ejecuta el script para comprobar que funciona antes de dar la tarea por terminada.
- Para todo lo que hayas arrancado. Si arrancaste el servidor de Chroma, páralo y comprueba que el puerto queda libre: `Get-NetTCPConnection -LocalPort 8000` no debe devolver nada.
