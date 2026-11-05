# Spec — plantillas de git por tipo

Una tarea nueva de first-app ya no usa una plantilla genérica. Hay una plantilla de issue y una de pull request para cada tipo: `feat`, `fix`, `docs`, `refactor`, `test` y `chore`.

El mismo tipo vale para la plantilla de la issue, el nombre de la rama y la plantilla de la pull request. Si el tipo no es uno de esos seis, se elige el más cercano y se dice cuál. No se renombra una rama que ya existe.

En el draft, las casillas quedan sin marcar y la línea de la issue queda sin número. Al pedir revisión se marca solo lo que se ha comprobado. El enlace posterior es `Closes #N`. La base de la pull request sigue siendo `staging`. Si el merge cierra la issue depende de la rama por defecto real, no de suponer que es `main`.

## Few-shot

- Una tarea de mantenimiento usa `chore` en la issue, en la rama y en la pull request.
- Llega un tipo que no tiene plantilla. Se elige uno de los seis, se dice cuál, y no se cambia el script que crea la rama.
- El draft describe lo previsto y deja las casillas vacías. No afirma un cambio que todavía no está hecho.
- Al pedir revisión, una casilla sin comprobar se queda vacía y se dice antes de pedir la revisión.
- La rama por defecto es `staging`. Fusionar ahí, con `Closes #N`, cierra la issue. La base no se mueve para forzar ese cierre.

No se tocan los scripts de `tools/`, `package.json` ni el código de la app. Las specs ya escritas conservan su texto.
