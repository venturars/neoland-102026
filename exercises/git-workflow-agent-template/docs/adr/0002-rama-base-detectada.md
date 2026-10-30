# La rama base se detecta, no se fija

La plantilla original daba por hecho `staging`, que solo existe en el repositorio del curso. Para que el paquete sirva en cualquier proyecto, los scripts detectan la rama base: `GIT_WORKFLOW_BASE` si está definida, si no `staging` cuando existe `origin/staging`, y si no la rama por defecto del remoto (`origin/HEAD`, después `main` o `master`). Se descartaron un fichero de configuración en cada proyecto (un paso más de instalación) y preguntar cada vez (rompe el «llama y continúa» del orquestador).

## Consecuencias

- `create-branch` y `create-branch-from-staging` se fusionan en una sola skill, y `create-pr-base-staging` pasa a `create-pr-base`.
- La función de detección está copiada en cada script que la usa: APM copia cada skill por separado y una skill no puede leer ficheros de otra.
