Issue: #1105.

# Tareas — cliente node:http para usuarios

Pasos en el orden en que los haría una persona. Ninguno toca `src/logic/`, `src/queries/` ni `src/db/`. Ningún paso instala paquetes.

1. Leer `src/clients/http/server.js` y `src/logic/errors.js`. Resultado: anotadas las cinco clases de error y el mapeo de `Could not ...` por método y ruta.

2. Crear `src/clients/node-http/server.js` con `import http from "node:http"`, las constantes `HOST`, `ORIGIN` y `PORT` (3004), y la función `parseUserId` igual que la del cliente Express. Resultado: `node --check src/clients/node-http/server.js` pasa.

3. En ese fichero, añadir la función que lee el cuerpo: acumula los trozos, hace `JSON.parse` y lanza `ValidationError("Body is invalid")` si falta, está mal formado o no es un objeto. Resultado: `node --check` pasa.

4. Añadir la función que responde: JSON con `Content-Type: application/json`, o 204 sin cuerpo. Resultado: `node --check` pasa.

5. Añadir la función que despacha las cinco rutas por método y ruta, en el orden de la tabla de la spec, y responde 404 sin cuerpo si no hay ruta. Resultado: cada ruta llama a su función de `src/logic/`.

6. Añadir la función que traduce el error a estado y `{ message }`, con la tabla de `plan.md`. Resultado: cada clase tiene su estado y los demás errores salen como `Could not ...` según método y ruta.

7. Añadir el servidor: `http.createServer` que llama al despacho dentro de `try/catch`, y `listen(PORT, HOST)` que escribe `node-http server listening on http://127.0.0.1:3004`. Resultado: `node src/clients/node-http/server.js` escribe esa dirección.

8. Crear `scripts/jupyter-node-http.sh` copiando `scripts/jupyter.sh` y cambiando solo la última línea para que abra `src/clients/node-http/jupyter`. No se modifica `scripts/jupyter.sh`. Resultado: `diff scripts/jupyter.sh scripts/jupyter-node-http.sh` muestra solo esa línea, y `git diff scripts/jupyter.sh` sale vacío.

9. Crear `src/clients/node-http/jupyter/create-user.ipynb`: celda de texto (título, qué hace, qué pasa en la base, qué acción usa, anotaciones) y celda Python que lanza `node --input-type=module -e` con `fetch` a `POST /users` y tabla de `cli-table3`. Resultado: el fichero es JSON válido.

10. Crear `src/clients/node-http/jupyter/list-users.ipynb`, con la misma estructura y `GET /users`. Si la lista está vacía, la tabla deja los encabezados y la línea `No hay filas.`. Resultado: el fichero es JSON válido.

11. Crear `src/clients/node-http/jupyter/find-user-by-id.ipynb`, con la misma estructura, `GET /users/:id` y la búsqueda del id de Ada por email. Resultado: el fichero es JSON válido.

12. Crear `src/clients/node-http/jupyter/update-user.ipynb`, con la misma estructura, `PATCH /users/:id` y la búsqueda del id de Ada. Resultado: el fichero es JSON válido.

13. Crear `src/clients/node-http/jupyter/delete-user.ipynb`, con la misma estructura, `DELETE /users/:id` y la búsqueda del id de Ada. Su celda imprime solo el estado cuando la respuesta es 204. Resultado: el fichero es JSON válido.

14. Añadir a `package.json` el script `node-http` (como `http`, con la base si el puerto 3000 está libre). Resultado: `pnpm run node-http` arranca el servidor.

15. Añadir a `package.json` el script `jupyter-node-http` (`sh scripts/jupyter-node-http.sh`). Resultado: `pnpm run jupyter-node-http` abre Jupyter en `src/clients/node-http/jupyter`.

16. Añadir en `eslint.config.js` un bloque para `src/clients/node-http/**/*.js` con `console: "readonly"`, igual que el de `src/clients/http/`. Resultado: `pnpm run lint` no marca `console` en ese cliente.

17. Ejecutar los seis cuadernos en orden (crear, listar, ver, modificar, borrar, contar), con `pnpm server`, `pnpm node-http` y `pnpm jupyter-node-http` en marcha y Ollama con `llama3.2` en marcha. Resultado: ninguna celda da error y cada respuesta coincide con la tabla de `plan.md`.

18. Comprobar con `curl` las cinco rutas del servidor en marcha. Resultado: 200, 201, 200, 200 y 204 en su orden, y 404 sin cuerpo para una ruta que no existe. La sexta ruta se comprueba en el paso 25.

19. Añadir `src/clients/node-http/` a la línea de excepciones de `docs/STYLE.md`. Resultado: `grep` encuentra esa ruta en el fichero.

20. Actualizar `docs/TREE.md` y `docs/ARCHITECTURE.md` con el cliente, su carpeta `jupyter/`, los scripts `node-http` y `jupyter-node-http`, y el script `scripts/jupyter-node-http.sh`. Resultado: `grep node-http` encuentra cada entrada en los dos ficheros.

21. Formatear solo el fichero nuevo con `pnpm exec prettier --write src/clients/node-http/server.js`. Resultado: el comando termina sin errores. No se ejecuta `pnpm run format` completo, porque reformatearía otros clientes.

22. Ejecutar `pnpm run lint`. Resultado: sin errores.

## Cambio de alcance: ruta de conteo por género

Pasos añadidos tras aprobar la spec y el plan con `GET /users/gender-count` (decisión 7 de `plan.md`). Se hacen después del paso 22 y, al terminar, se repiten los pasos 22 (lint), 17 y 18.

23. En `src/clients/node-http/server.js`, importar `usersGenderCount` de `../../logic/user-gender-count.js` y añadir la ruta literal `GET /users/gender-count` antes de la de `:id`. Responde 200 con el objeto de la lógica. Resultado: `node --check` pasa y `GET /users/gender-count` no responde `Id is invalid`.

24. Crear `src/clients/node-http/jupyter/user-gender-count.ipynb` con la misma estructura de los demás (título, qué hace, qué pasa en la base, qué acción usa, anotaciones) y una celda Python que lanza `node --input-type=module -e` con `fetch` a `GET /users/gender-count`. La tabla tiene las columnas `woman`, `man` y `genderUndefined`. Resultado: el fichero es JSON válido.

25. Comprobar la sexta ruta. Con Ollama en marcha y `llama3.2` descargado, `GET /users/gender-count` responde 200 con los tres conteos. Con Ollama parado, responde 500 con `Could not classify the users`. Resultado: los dos casos se ven con `curl`, y el cuaderno del paso 24 se ejecuta sin error con Ollama en marcha.
