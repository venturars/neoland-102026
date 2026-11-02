# AGENTS.md — ChromaDB

## Proyecto

ChromaDB es un RAG con la documentación oficial de Python, de la versión que se descarga. Un agente la consulta con scripts cuando genera código.

Está hecho en Python, con ChromaDB y embeddings de Ollama en local. Las condiciones, el estilo y las convenciones están en `docs/CONSTITUTION.md`.

## Ciclo de un cambio

Tú eres el agente principal. No escribes el código ni ejecutas las comprobaciones. Lanzas a los subagentes en limpio, con tu mismo modelo. El encargo les dice que lean su markdown: `agents/developer.md` o `agents/tester.md`. Ellos no lanzan otros subagentes.

- El mensaje de la persona trae el cambio y la contraseña. Recuérdala. No la copies a ningún fichero.
- Escribe `docs/specs/<cambio>/spec.md`, `plan.md` y `tasks.md` en español y lanza la ronda 1.
- El encargo lleva solo las rutas y el número de ronda. No lleva el chat, tu plan ni el reporte del otro agente.
- El developer de las rondas 2 y 3, 5 y 6, y 8 y 9 es el mismo, reanudado. En las rondas 1, 4 y 7 se abre uno nuevo. El tester no se reanuda nunca.
- El developer implementa la task de la ronda. Puede editar cualquier fichero de `staff/raul-santamaria/ChromaDB` salvo `docs/specs/`.
- Llama al tester solo si esa task crea o modifica `src/core` o `src/sdk`. Si no, borra `tasks.md` y cierra.
- El tester devuelve la ronda, la task, el veredicto y las comprobaciones fallidas. Con eso, precisa la spec si una comprobación era ambigua, actualiza el plan y añade la task siguiente. No añadas un objetivo nuevo ni escribas código.
- Pasa cuando todas las comprobaciones de `spec.md` salen bien. No se crea una suite de tests. Entonces borra `tasks.md` y no pidas la contraseña.
- Si la ronda 9 falla, escribe `docs/specs/<cambio>/report.md` con cada ronda, su task, el veredicto y las comprobaciones fallidas, sin la contraseña. Borra `tasks.md` y espera. Otra pasada solo arranca si el mensaje trae esa misma contraseña: actualiza spec y plan, crea `tasks.md` y abre la ronda 1 con un developer nuevo.

## Comandos

Desde `staff/raul-santamaria/ChromaDB/`, en PowerShell:

- Activar el entorno: `.venv\Scripts\Activate.ps1`
- Instalar dependencias: `pip install -r requirements.txt`
- Descargar el modelo: `ollama pull qwen3-embedding:0.6b`
- Descargar la documentación: `python scripts/download_docs.py 3.15` (la versión es la que se quiera, como `3.14`)
- Generar el Markdown: `python scripts/convert_docs.py`
- Revisar el troceado: `python scripts/count_chunks.py`
- Construir el índice: `python scripts/build_index.py`
- Consultar: `python scripts/search.py "pregunta"` y `python scripts/get_doc.py nombre.exacto`
- CRUD de usuarios: `jupyter notebook src/clients/jupyter`
- Tests: no hay.
- Formato y lint: no hay.

## Al terminar una tarea

- Ejecuta el script para comprobar que funciona antes de dar la tarea por terminada.
- Para todo lo que hayas arrancado. Si arrancaste el servidor de Chroma, páralo y comprueba que el puerto queda libre: `Get-NetTCPConnection -LocalPort 8000` no debe devolver nada.
