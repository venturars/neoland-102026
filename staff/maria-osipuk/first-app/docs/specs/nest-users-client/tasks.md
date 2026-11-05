Issue: #1076

# Tareas del cliente Nest de usuarios

Antes de empezar, leer `spec.md` y `plan.md` completos. Las comprobaciones que escriben usan una base temporal con `FIRST_APP_DATABASE_FILE`, nunca la base real.

## Paquetes y compilación

1. **Añadir los paquetes.** Con `pnpm add` los cinco de `dependencies` y con `pnpm add -D` los cinco de `devDependencies` del plan, en las versiones exactas.
   Resultado: `package.json` y `pnpm-lock.yaml` los declaran y el lockfile resuelve las versiones del plan.
2. **Crear `babel.config.json`.** `@babel/preset-env` con `targets.node` en `current` y `modules` en `false`, y `@babel/plugin-proposal-decorators` con `version` `legacy`.
   Resultado: `pnpm exec babel --version` responde con la versión del plan.
3. **Añadir el script `nest` y ampliar `format`.** `nest` borra `dist`, compila `src` a `dist` con `--config-file ./babel.config.json` y lanza `dist/clients/nest/main.js`. `format` incluye `src/clients/nest/**/*.js`.
   Resultado: ambos scripts aparecen en `package.json`.
4. **Ignorar `dist/`.** Añadir `dist/` a `.gitignore` y a `.prettierignore`.
   Resultado: tras compilar, `git status` no muestra `dist/`.
5. **Configurar ESLint.** En `eslint.config.js`, `@babel/eslint-parser` para `src/clients/nest/**/*.js` con `babel.config.json`, y `dist/` ignorado.
   Resultado: un archivo con `@` pasa `pnpm lint` y el resto de reglas siguen activas.

## Cliente

6. **Crear el servicio.** `src/clients/nest/users.service.js` llama a `createUser(name, email)`, `listUsers()`, `findUserById(id)`, `updateUser(id, changes)` y `deleteUser(id)` y devuelve su resultado, sin validar.
   Resultado: el archivo importa solo de `src/logic/` y compila con Babel.
7. **Crear el filtro.** `src/clients/nest/users-exception.filter.js` traduce cada mensaje de la lógica al estado de la spec y responde `{ message }`. Un JSON roto da `400`, otra ruta da `404` sin cuerpo y un mensaje desconocido da `500` con el `Unable to` de la operación.
   Resultado: cada fila de la tabla de errores de la spec tiene su estado en el filtro.
8. **Crear el controlador.** `src/clients/nest/users.controller.js` con las cinco rutas de la spec. Convierte el id con `Number` solo si `String(number) === text`, usa un objeto vacío si no hay cuerpo y añade `name` y `email` a `changes` solo si no son `undefined`.
   Resultado: `POST` responde `201`, `DELETE` responde `204` y las demás `200`.
9. **Crear el módulo y `main.js`.** `app.module.js` une controlador, servicio y filtro. `main.js` crea la aplicación y escucha en `127.0.0.1:3003`.
   Resultado: con el servidor de datos arrancado, `pnpm run nest` queda escuchando y `GET /users` responde `200`.

## Pruebas

10. **Escribir `tests/nest-client.test.js`.** Compila el cliente, arranca el servidor de datos con una base temporal y lanza el cliente como proceso hijo. Comprueba las cinco rutas, los errores de la spec y las cinco operaciones con el servidor de datos parado.
    Resultado: `pnpm test` pasa y no toca `src/db/users.sqlite`.
11. **Comprobar los demás clientes.** Ejecutar `pnpm test` completo.
    Resultado: las pruebas de web, REST, escritorio y Chrome siguen pasando.

## Documentación

12. **Actualizar `README.md`.** Fila del cliente Nest, comando `pnpm run nest` y uso con Postman.
    Resultado: la fila y el comando coinciden con `package.json`.
13. **Actualizar `docs/ARCHITECTURE.md` y `docs/TREE.md`.** Describir `src/clients/nest/`, el paso de Babel y el puerto 3003, y añadir los archivos nuevos, `babel.config.json`, la prueba y esta spec al árbol.
    Resultado: cada archivo creado aparece en el árbol y no se cuenta `dist/`.
14. **Actualizar `docs/STYLE.md` y `docs/ERRORS.md`.** Avisar de que el cliente se aparta de la guía por sus clases y decoradores, y añadir su apartado de errores y la excepción en «Traducción en cada cliente».
    Resultado: las guías describen lo implementado.
15. **Actualizar `docs/CONSTITUTION.md`.** Apartado 1, el cliente Nest en el alcance; apartado 3, Nest y Babel en las decisiones tecnológicas.
    Resultado: la constitución nombra el cliente y sus tecnologías sin repetir reglas de las guías.

## Cierre

16. **Pasar las comprobaciones del proyecto.** `pnpm format` limitado a los archivos del pedido, `pnpm lint` y `pnpm test`.
    Resultado: las tres terminan sin errores.
17. **Probar en Postman.** Seguir los casos de la spec con una base temporal, y repetir las cinco rutas con el servidor de datos parado.
    Resultado: cada respuesta coincide con la tabla de la spec.
18. **Comprobar la base compartida.** Crear un usuario con Postman y verlo con `pnpm run web` y `pnpm run http`.
    Resultado: el mismo usuario aparece en los tres clientes.
