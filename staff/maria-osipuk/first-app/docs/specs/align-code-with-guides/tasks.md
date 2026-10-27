# Tareas — Alinear el código con las guías

## 1. Guardar el comportamiento actual

Crear una copia temporal de `db/users.sqlite` y apuntar `FIRST_APP_DATABASE_FILE` a ella.
Ejecutar cada caso de `clients/terminal/` y un caso incorrecto por operación.
Guardar las salidas para compararlas después.

## 2. Alinear `logic/find-user-by-id.js` y `logic/delete-user.js`

Escribir la validación del `id` como `Number.isInteger(id) && id > 0` en un nombre, y lanzar el error si es falso.
Repetir los casos de ese fichero y comparar con las salidas guardadas.

## 3. Alinear `logic/create-user.js` y `logic/find-user-by-email.js`

Separar `trim()`, `toLowerCase()` y `split("@")` en líneas distintas.
Dar un nombre a cada parte de la comprobación del `@` antes del `if`.
Repetir los casos de ambos ficheros y comparar.

## 4. Alinear `logic/update-user.js`

Aplicar los mismos cambios de nombre y de `id`, y sustituir los ternarios por `if`.
Repetir el caso correcto, un `id` inválido, un email repetido y unos cambios vacíos, y comparar.

## 5. Alinear `logic/list-users.js` y `countUsersByGender`

Revisar `list-users.js` y cambiar solo lo que no cumpla `docs/STYLE.md`.
En `count-users-by-gender.js`, renombrar `batchSize` a `BATCH_SIZE` sin tocar `classifyNames`.
Probar el recuento con la tabla vacía y comparar.

## 6. Alinear `db/connection.js`

Separar la llamada y la comparación de `configuredFile` y escribir los ternarios con `if`.
Comprobar que sin variable abre `db/users.sqlite` y con la variable abre el otro archivo.

## 7. Comprobar

Ejecutar `pnpm format`, `pnpm lint` y `pnpm exec prettier --check .`.
Ejecutar `git diff --check` y comprobar que `classifyNames` y `queries/users.js` no cambian.

## 8. Sincronizar las guías

Añadir la carpeta de esta spec a `docs/TREE.md`.
Revisar la Constitución y decir en el informe que no necesita cambio, si es así.
