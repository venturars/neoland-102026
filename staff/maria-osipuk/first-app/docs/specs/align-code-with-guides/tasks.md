# Tareas — Alinear el código con las guías

## 1. Guardar el comportamiento actual

Crear una copia temporal de `db/users.sqlite` y apuntar `FIRST_APP_DATABASE_FILE` a ella.
Ejecutar cada caso de `clients/terminal/` y un caso incorrecto por operación.
Guardar las salidas para compararlas después.

## 2. Revisar `logic/find-user-by-id.js` y `logic/delete-user.js`

Dejar la validación del `id` como está y revisar el resto de cada fichero contra `docs/STYLE.md`.
Cambiar solo lo que no cumpla. Repetir los casos de ese fichero, con `"1"`, `1.5`, `0`, `-1` y `NaN`, y comparar con las salidas guardadas.

## 3. Alinear `logic/create-user.js` y `logic/find-user-by-email.js`

Separar `trim()`, `toLowerCase()` y `split("@")` en líneas distintas.
Escribir la comprobación del `@` con el bloque de banderas del plan, con el mensaje `User email is invalid`.
Repetir los casos de ambos ficheros y comparar.

## 4. Alinear `logic/update-user.js`

Aplicar los patrones del plan: email, `emailUsedByAnother`, el objeto `changes` y valores que se conservan, sin ternarios. La validación del `id` no cambia.
Repetir el caso correcto, un `id` inválido, un email repetido y unos cambios vacíos, y comparar.

## 5. Alinear `logic/list-users.js`

Revisar el fichero y cambiar solo lo que no cumpla `docs/STYLE.md`.
Repetir el listado y comparar.

## 6. Alinear `logic/count-users-by-gender.js`

Renombrar `batchSize` a `BATCH_SIZE` y separar las acciones encadenadas de `countUsersByGender`.
En `classifyNames`, repartir las condiciones largas en banderas e `if` anidados y separar el parseo del JSON.
Probar la tabla vacía y los fallos de la respuesta con un cliente simulado.

## 7. Pasar la conexión a export con nombre

En `db/connection.js`, escribir `export const database` y separar la llamada de la comparación y escribir los ternarios con `if`.
En `queries/users.js`, cambiar el import a `{ database }`.
Comprobar que sin variable abre `db/users.sqlite` y con la variable abre el otro archivo.

## 8. Alinear `queries/users.js`

Separar el cálculo del directorio y cada lectura de SQL en dos líneas.
Separar cada `database.prepare(...)` de su `get`, `all` o `run`. Las firmas no cambian.
Repetir todos los casos de terminal y comparar.

## 9. Comprobar

Ejecutar `pnpm format`, `pnpm lint` y `pnpm exec prettier --check .`.
Ejecutar `git diff --check` y comprobar que no hay ficheros nuevos ni borrados.

## 10. Sincronizar las guías

Revisar `docs/ARCHITECTURE.md` y la Constitución.
Si no necesitan cambio, decirlo en el informe.
