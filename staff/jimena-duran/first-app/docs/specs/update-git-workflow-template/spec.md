Issue: #741

# Actualizar la automatización de Git por tipo

Estado: spec y plan aprobados; T01–T12 completadas. Commit selectivo, push y PR draft contra staging autorizados; publicación pendiente. Sin revisores ni merge. Resultados en [verification.md](verification.md).

## Comportamiento y aceptación

1. Al registrar una tarea, se utiliza la plantilla de su tipo. Si el tipo no tiene plantilla, se utiliza la más cercana.
2. Cada plantilla define la forma del título, el tipo y el nombre habitual de rama. Las instrucciones de los agentes remiten a esa fuente sin repetir sus reglas editoriales. Los títulos siguen en inglés y los cuerpos en español.
3. Al preparar una revisión autorizada, se utiliza la plantilla del tipo; si no tiene plantilla, se utiliza la más cercana. Incluye motivo, cambio, comprobación, lista de comprobación e issue. El borrador resume la tarea, conserva las casillas sin marcar y toma de ella los pasos de comprobación; las casillas se completan al pedir revisión según resultados comprobados.
4. El agente que abre la revisión deja vacía la sección Issue. Después, el orquestador añade una única referencia de cierre con el número real, preservando el resto del cuerpo y los vínculos existentes. Nunca se publican marcadores pendientes ni se cierra una issue manualmente.
5. El flujo conserva Windows y PowerShell, agentes reales, MCP con alternativa gh, conservación de datos y cambios ajenos y las autorizaciones de cada operación. Ante un bloqueo, informa sin descartar trabajo ni forzar operaciones.
6. La issue precede a la documentación. Se revisan primero spec y plan; después se preparan tareas y se vuelve a detener el flujo. Solo se implementa con autorización posterior. Commit, push y PR requieren autorización propia.

## Límites

Solo se actualiza la automatización de Git de first-app. Quedan fuera la lógica y los clientes de la aplicación, SQLite, ChromaDB, otras aplicaciones, paquetes, configuración personal y trabajos independientes. No se repiten comprobaciones históricas.
