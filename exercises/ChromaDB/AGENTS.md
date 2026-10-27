# AGENTS.md — ChromaDB

## Proyecto

ChromaDB es un RAG con la documentación oficial de Python 3.15. Un agente la consulta con scripts cuando genera código.

Está hecho en Python, con ChromaDB y embeddings de Ollama en local. Las condiciones, el estilo y las convenciones están en `docs/CONSTITUTION.md`.

## Reglas

- Lee `docs/CONSTITUTION.md` antes de tocar código.
- Antes de escribir, investiga y mira si lo que vas a hacer se parece a algo que ya existe.
- Temperatura próxima a 0. No inventes. Si algo no está claro, o si la constitución y el código dicen cosas distintas, pregunta antes de escribir código.
- No propongas código que no se haya comprobado.
- No hagas commits ni pushes sin que la persona lo pida.

## Comandos

Desde `exercises/ChromaDB/`, en PowerShell:

- Activar el entorno: `.venv\Scripts\Activate.ps1`
- Instalar dependencias: `pip install -r requirements.txt`
- Tests: no hay.
- Formato y lint: no hay.

## Al terminar una tarea

- Ejecuta el script para comprobar que funciona antes de dar la tarea por terminada.
- Para todo lo que hayas arrancado. Si arrancaste el servidor de Chroma, páralo y comprueba que el puerto queda libre: `Get-NetTCPConnection -LocalPort 8000` no debe devolver nada.
