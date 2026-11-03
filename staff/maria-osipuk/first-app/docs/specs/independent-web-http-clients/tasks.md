Issue: #790

# Tareas de los clientes web y HTTP independientes

## Servidor de datos y consultas

1. Crear `src/db/server.js` con `POST /execute` (`exec`, `get`, `all`, `run`), CORS y `FIRST_APP_DATABASE_FILE`. Al arrancar crea la tabla.
   Resultado: `curl` a `/execute` con `all` y `SELECT 1` responde `200` con `rows`.
2. Sustituir los 7 `.sql` de `src/queries/queries/` por `.js` que exportan su constante en mayúsculas, con el mismo SQL.
   Resultado: no queda ningún `.sql` en esa carpeta.
3. Reescribir `src/queries/users.js` con `execute()` y `fetch`, funciones `async` y sin `readFileSync` ni conexión. Borrar `src/db/connection.js`.
   Resultado: `grep "node:" src/queries` no encuentra nada.

## Lógica

4. Pasar las 7 funciones de `src/logic/` a `async`, con `await` en cada consulta. Reglas y mensajes sin cambios.
   Resultado: con el servidor arrancado sobre una base temporal, crear, buscar, modificar, listar y borrar responden igual que antes.

## Clientes

5. Añadir `await` a los ejemplos de `src/clients/terminal/`.
   Resultado: cada línea se ejecuta con el servidor de datos y muestra su resultado.
6. Hacer que `run_logic.py` espere todas las funciones y diga que hace falta el servidor de datos.
   Resultado: un cuaderno lista usuarios con el servidor arrancado.
7. Crear `src/clients/http/app.js` con `POST`, `PATCH` y `DELETE` en el `3001`; borrar los archivos que reúne y ajustar `send-http-error.js`.
   Resultado: `curl` crea, modifica y borra; `GET /api/users` da `405`.
8. Reescribir `src/clients/web/` como `index.html`, `styles.css` y `app.js`, que importa la lógica; borrar los otros 11 módulos.
   Resultado: con `pnpm run web`, la web crea, modifica y borra en Chrome desde `file://`.

## Pruebas y comandos

9. Actualizar `package.json` (`start`, `start:http`, `web`) y `eslint.config.js`.
   Resultado: `pnpm lint` pasa.
10. Reescribir `tests/http-client.test.js` y crear `tests/database-server.test.js` y `tests/shared-database.test.js`.
    Resultado: `pnpm test` pasa con bases temporales.

## Documentación

11. Actualizar `README.md`, `docs/WEB-CLIENT-GUIDE.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/ERRORS.md` y `docs/STYLE.md`.
    Resultado: las guías describen el servidor de datos, las consultas en `.js` y la lógica `async`.
12. Enmendar `docs/CONSTITUTION.md` (apartados 1 y 3).
    Resultado: el alcance de la web y la decisión del servidor de datos están escritos.
13. `pnpm format` sobre los archivos del pedido, `pnpm lint`, `pnpm test` y la verificación manual del plan.
    Resultado: todo pasa y queda anotado lo que no se pudo comprobar.
