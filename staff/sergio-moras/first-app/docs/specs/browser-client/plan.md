# Plan: Cliente de navegador

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. Sin paquetes nuevos ni cambios en la tabla, así que no hay validación de Socket.

## Cómo llega el navegador a `logic/`
Desde #819, `queries/users.js` ya no abre la base: pide cada consulta al servidor de la base con `fetch`, que existe en el navegador. Así el navegador importa las funciones de `logic/` directamente, igual que la terminal y Jupyter:

```
navegador: app.js
   │ import
   ▼
src/logic/list-users.js, update-user.js, delete-user.js
   │ import
   ▼
src/queries/users.js
   │ POST http://127.0.0.1:4000/query   (servidor de la base, #819)
   ▼
src/db/server.js  →  src/db/connection.js  →  src/db/users.sqlite
```

`src/clients/browser/server.js` solo sirve ficheros: las pantallas y los módulos de `logic/` y `queries/` que importan. No llama a `logic` y no tiene rutas de datos. Hace falta porque el navegador no carga módulos desde `file://`.

## Ficheros
```
src/clients/browser/server.js           sirve las pantallas y los módulos que importan
src/clients/browser/public/index.html   las tres pantallas
src/clients/browser/public/styles.css
src/clients/browser/public/app.js       cambia de pantalla y llama a logic
src/db/server.js                        acepta peticiones del navegador (cambio 1.2)
package.json                            script browser y format de los ficheros nuevos
eslint.config.js                        globales del navegador para app.js
docs/ARCHITECTURE.md, docs/TREE.md, docs/STYLE.md, AGENTS.md
```
No se tocan `src/logic/`, `src/queries/`, `src/db/connection.js` ni los clientes de terminal y Jupyter.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Servidor | `node:http` en `127.0.0.1:3000`. `PORT` y `HOST` son constantes | Viene con Node. Solo escucha en este equipo |
| Arranque | `pnpm browser`, que lanza `node --no-warnings src/clients/browser/server.js` y escribe la dirección | Un solo comando, como `pnpm format` |
| Ficheros que se sirven | Las rutas son las de `src/`, para que los `import` relativos funcionen igual en el navegador y en el disco. `GET /` da `clients/browser/public/index.html`. Se sirven solo los de una lista fija: `index.html`, `styles.css` y `app.js` de `public/`, `logic/list-users.js`, `logic/update-user.js`, `logic/delete-user.js` y `queries/users.js`, con su `Content-Type` | Cualquier otra ruta da 404 y `Not found.`, así que no se puede pedir `users.sqlite`, `users-sql.js` ni otra carpeta |
| Llamadas a `logic` | `app.js` importa `listUsers`, `updateUser` y `deleteUser` con su ruta relativa (`../../../logic/list-users.js`) y las llama con `await` | Sin rutas de datos ni JSON propio: el resultado y el error salen de `logic` tal cual |
| Errores | `app.js` enseña `Error: <error.message>` | Igual que la terminal. Con la base parada se ve `Error: Database is not running. Start it with pnpm db.` |
| Permiso al navegador | `src/db/server.js` responde a `OPTIONS /query` con 204 y añade `Access-Control-Allow-Origin: http://127.0.0.1:3000` en sus respuestas. Solo esa dirección, nunca `*`. La constante es `BROWSER_ORIGIN` | El navegador está en el 3000 y la base en el 4000: sin este permiso, el navegador bloquea las respuestas |
| Peticiones de otras páginas | `src/db/server.js` responde 403 y `{ "error": "Forbidden origin." }` si llega una cabecera `Origin` que no es `BROWSER_ORIGIN`, y 400 `Invalid request.` si el `Content-Type` no es `application/json` | Una página de otra dirección no puede borrar ni cambiar usuarios. Pedir JSON obliga al navegador a preguntar antes con `OPTIONS`. La terminal y Jupyter no envían `Origin` y siguen igual |
| Pantallas | Un solo `index.html` con tres `<section>`. `app.js` enseña una y oculta las otras | Sin recargar la página y sin router |
| Estado | `app.js` guarda la lista y el usuario elegido en dos variables. Al guardar, el usuario elegido pasa a ser el que devuelve `updateUser` | La pantalla 2 no necesita pedir nada al servidor |
| Notas | `<button disabled>` con el texto `Notas` y una etiqueta `Próximamente` | Se ve y no hace nada |
| Confirmar el borrado | Ventana propia con `<dialog>` de HTML y `showModal()`: título, la pregunta con el nombre y el id, y los botones `Cancelar` y `Eliminar`. `Esc` o pulsar fuera cancela | Con el estilo de la app. `<dialog>` ya viene en el navegador: sin librerías |
| Aspecto | Los criterios de la sección [Aspecto](#aspecto) | La primera versión se veía anticuada y sosa |
| Idioma | Los textos de las pantallas (títulos, botones, campos, la lista vacía y la confirmación) van en español. Los mensajes de error salen tal cual los lanza `logic`, en inglés, con `Error: ` delante. El código, los nombres y lo que escribe el servidor en la terminal siguen en inglés | Quien usa las pantallas lee español. Los errores no se traducen para no duplicar [ERRORS.md](../../ERRORS.md). `STYLE.md` recoge esta excepción |
| Estilo del código | El de [STYLE.md](../../STYLE.md): funciones con nombre, una acción por línea, sin clases y sin `?.` | Igual que el resto del código |
| Lint | `eslint.config.js` gana un bloque para `src/clients/browser/public/**/*.js` con `document` como global. `console` y `fetch` ya están en el bloque general | `eslint .` ya revisa los ficheros nuevos; sin el paquete `globals` |
| Formato | `pnpm format` añade `src/clients/browser/**/*.{js,html,css}` | Prettier ya sabe formatear HTML y CSS |

## `server.js`
1. Comentario inicial con su responsabilidad.
2. Importa `createServer` de `node:http` y `readFile` de `node:fs/promises`.
3. `SERVED_FILES`: la lista fija de rutas, cada una con su fichero dentro de `src/` y su `Content-Type`.
4. `sendNotFound(response)` y `sendFile(response, servedFile)`.
5. `handleRequest(request, response)`: si es `GET` y la ruta está en la lista, envía el fichero. Si no, `sendNotFound`.
6. `createServer(handleRequest).listen(PORT, HOST)` y escribe `Browser client: http://127.0.0.1:3000`.

## `app.js`
- Importa `listUsers`, `updateUser` y `deleteUser` de `logic/`.
- `showScreen(name)`: enseña una `<section>` y oculta las demás.
- `loadUsers()`: `await listUsers()` y pinta la lista, o el texto de lista vacía.
- `selectUser(user)`: guarda el usuario y pinta la pantalla 2.
- `openEditor()`: rellena los campos y pinta la pantalla 3.
- `saveUser()`: `await updateUser(id, name, email)`. Si va bien, vuelve a la pantalla 2 con los datos nuevos. Si no, enseña `Error: <mensaje>`.
- `askDeleteConfirmation()`: escribe la pregunta en la ventana y la abre con `showModal()`.
- `removeUser()`: se llama desde el botón `Eliminar` de la ventana. Cierra la ventana, hace `await deleteUser(id)` y vuelve a la lista. `Cancelar` solo cierra la ventana.
- Los botones se enganchan con `addEventListener` al cargar la página.

## `src/db/server.js` (cambio 1.2)
- `BROWSER_ORIGIN = "http://127.0.0.1:3000"`.
- Antes de lo demás: si la petición trae `Origin` y no es `BROWSER_ORIGIN`, 403.
- `OPTIONS /query`: 204 con `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods: POST` y `Access-Control-Allow-Headers: Content-Type`.
- `POST /query` comprueba que el `Content-Type` es `application/json` antes de leer el cuerpo.
- `sendJson` añade `Access-Control-Allow-Origin: BROWSER_ORIGIN` a todas las respuestas.

## Aspecto
Minimalista y amable: pocas cosas en pantalla, con aire, y una sola acción destacada en cada pantalla.

- **Colores:** fondo `#f7f7f8`, tarjetas blancas, texto principal negro (`#000`), texto secundario gris (`#6b7280`), un acento índigo (`#4f46e5`) para la acción principal y rojo (`#dc2626`) solo para eliminar. Van como variables CSS en `:root`.
- **Forma:** una tarjeta centrada de 560 px como máximo, esquinas de 16 px, sombra suave y 32 px de margen interior. En móvil ocupa el ancho.
- **Letra:** la del sistema. Títulos de 28 px en negrita, texto de 16 px y textos secundarios de 14 px.
- **Pantalla 1:** la tabla pasa a ser una lista de filas. Cada fila es un `<button>` con un círculo con las iniciales, el nombre en negrita, el email debajo en gris y el id a la derecha. Al pasar el ratón la fila se resalta. Con el teclado se llega con Tab y se elige con Enter. La lista vacía se ve como un aviso centrado.
- **Pantalla 2:** arriba, `← Volver` como enlace. Debajo, el usuario con el círculo de iniciales grande, nombre y email. Las opciones son dos filas grandes: `Modificar`, y `Notas` desactivada con la etiqueta `Próximamente`.
- **Pantalla 3:** `← Volver` arriba, los campos con su etiqueta encima y un borde índigo al tener el foco, y `Guardar` como botón principal. `Eliminar usuario` va aparte, al final, en rojo y separado por una línea.
- **Errores:** un recuadro rojo claro con el texto `Error: <mensaje>`.
- **Ventana de confirmación:** tarjeta blanca centrada sobre el fondo oscurecido, `Cancelar` como botón secundario y `Eliminar` en rojo.
- **Movimiento:** solo transiciones cortas (150 ms) en el resalte de botones y filas.

## Cómo se prueba
- Con el servidor en marcha, `curl` contra las tres rutas, con un usuario temporal `tmp-768-1@example.com` creado con `src/clients/terminal/create-user.txt`. Casos: lista, modificar bien, email inválido, email repetido, nombre y email vacíos, id inexistente, id no numérico, borrar, y una ruta desconocida.
- Las pantallas en el navegador, de principio a fin, con otro usuario temporal `tmp-768-2@example.com`: elegir, ver Notas desactivado, volver, modificar, los errores, cancelar el borrado y confirmarlo.
- Al terminar no queda ningún `tmp-768-*` y `list-users.txt` da los mismos usuarios que antes.
- `pnpm format` y `pnpm lint` sin errores.
- Desde la versión 1.2, las pruebas son las de T8 a T10 de [tasks.md](tasks.md).

## Cambios aprobados
| Versión | Fecha | Cambio | Motivo |
|---|---|---|---|
| 1.1 | 2026-11-03 | La confirmación del borrado pasa de `confirm()` a una ventana propia con `<dialog>`. Se añade la sección Aspecto. Pantalla 1 con filas en vez de tabla | Al ver la primera versión, la persona usuaria la encontró anticuada y sosa y pidió una confirmación con el estilo de la app |
| 1.2 | 2026-11-03 | `app.js` importa `logic/` directamente. `server.js` solo sirve ficheros y pierde las rutas `/users`. `src/db/server.js` acepta peticiones solo desde `http://127.0.0.1:3000` | La persona usuaria pidió que el navegador use `logic` sin API. Lo permite #819, que lleva la base a un servidor |
