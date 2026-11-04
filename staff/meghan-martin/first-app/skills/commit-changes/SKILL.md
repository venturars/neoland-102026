# Commit de un trozo

Úsala para guardar ficheros ya nombrados. No añade el directorio entero.

`staff/meghan-martin/first-app/tools/commit-changes.sh "MENSAJE" FICHERO [FICHERO...]`

El mensaje es una sola línea y nombra el fichero o la función y el cambio. No uses un verbo suelto (`update files`, `fix bug`). El commit vacío sigue siendo `chore: open #N`.

Los caminos pueden llevar espacios. Un fichero sin seguimiento que no se nombró se queda fuera. No se hace en `main` ni en `staging`. Si hay un hook de git de verdad, para.
