# Diseño de la caché

Una herramienta Node `.mjs`, sin paquetes adicionales, usa `gh api` con la cuenta activa. Guarda únicamente alias, logins, nombres públicos, ETags y datos de paginación en `.git-workflow-cache.json`, en la raíz Git.

Los comandos permiten consultar, guardar, corregir y borrar alias, listar colaboradores y consultar perfiles. `--refresh` revalida respuestas vigentes con ETag: `304` conserva el contenido y `200` lo sustituye. Después de 48 horas se descartan también los ETags.

Un bloqueo exclusivo coordina escritores y una sustitución atómica evita JSON truncado. Si el bloqueo o el almacenamiento fallan, la operación sigue sin persistencia. Las respuestas fallidas no se guardan ni se sustituyen por datos vencidos.

`create-pr` gestiona creación y revisión como encargos distintos; solo el segundo carga la skill de caché y `assign-reviewers`. La copia personal retira su caché y sus referencias, conservando el resto del workflow.
