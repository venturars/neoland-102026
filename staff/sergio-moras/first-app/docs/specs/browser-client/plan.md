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

Desde la versión 1.3 no hay servidor del navegador. `index.html` se abre desde el disco (`file://`) y el navegador lee de ahí `app.js` y los módulos de `logic/` y `queries/` que importa. Solo hace falta que esté en marcha el servidor de la base.

Por seguridad, Chrome no carga módulos desde `file://`. `pnpm browser` abre Chrome en un perfil aparte con `--allow-file-access-from-files`, que quita ese bloqueo solo en ese perfil.

## Ficheros
```
src/clients/browser/index.html   las tres pantallas (antes en public/)
src/clients/browser/styles.css   (antes en public/)
src/clients/browser/app.js       cambia de pantalla y llama a logic (antes en public/)
src/clients/browser/server.js    BORRADO en la versión 1.3
src/db/server.js                 acepta peticiones del navegador (cambios 1.2 y 1.3)
package.json                     script browser y format de los ficheros nuevos
eslint.config.js                 globales del navegador para app.js
docs/ARCHITECTURE.md, docs/TREE.md, docs/STYLE.md, AGENTS.md
```
No se tocan `src/logic/`, `src/queries/`, `src/db/connection.js` ni los clientes de terminal y Jupyter.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Abrir la página | `index.html` se abre desde el disco. Los ficheros van directamente en `src/clients/browser/`, sin `public/`, como en `terminal/` y `jupyter/` | Sin servidor no hay nada "público" que servir. `index.html` enlaza `./styles.css` y `./app.js` |
| Arranque | `pnpm browser` abre Chrome con `start "" chrome --user-data-dir="%TEMP%\first-app-chrome" --allow-file-access-from-files --no-first-run --no-default-browser-check "%CD%\src\clients\browser\index.html"` | `pnpm` lanza los scripts con `cmd` en Windows, y `start chrome` encuentra Chrome sin escribir su ruta. El perfil aparte hace que el flag no afecte al Chrome de siempre. Probado antes del plan: sin el flag no carga nada, y con él carga `logic` |
| Llamadas a `logic` | `app.js` importa `listUsers`, `updateUser` y `deleteUser` con su ruta relativa (`../../logic/list-users.js`) y las llama con `await` | Sin rutas de datos ni JSON propio: el resultado y el error salen de `logic` tal cual |
| Errores | `app.js` enseña `Error: <error.message>` | Igual que la terminal. Con la base parada se ve `Error: Database is not running. Start it with pnpm db.` |
| Permiso al navegador | `src/db/server.js` responde a `OPTIONS /query` con 204 y añade `Access-Control-Allow-Origin: file://` en sus respuestas. Solo ese valor, nunca `*`. La constante es `BROWSER_ORIGIN` | Chrome con el flag envía `Origin: file://` desde una página del disco (comprobado). Sin el permiso, bloquea las respuestas |
| Peticiones de otras páginas | `src/db/server.js` responde 403 y `{ "error": "Forbidden origin." }` si llega una cabecera `Origin` que no es `BROWSER_ORIGIN`, y 400 `Invalid request.` si el `Content-Type` no es `application/json` | Una web (`http://` o `https://`) no puede borrar ni cambiar usuarios, y un Chrome normal abre el disco con `Origin: null`, que también da 403. Sí podría llamar a la base otra página del disco abierta en ese mismo perfil: el perfil es solo para esta app. La terminal y Jupyter no envían `Origin` y siguen igual |
| Pantallas | Un solo `index.html` con tres `<section>`. `app.js` enseña una y oculta las otras | Sin recargar la página y sin router |
| Estado | `app.js` guarda la lista y el usuario elegido en dos variables. Al guardar, el usuario elegido pasa a ser el que devuelve `updateUser` | La pantalla 2 no necesita pedir nada al servidor |
| Notas | `<button disabled>` con el texto `Notas` y una etiqueta `Próximamente` | Se ve y no hace nada |
| Confirmar el borrado | Ventana propia con `<dialog>` de HTML y `showModal()`: título, la pregunta con el nombre y el id, y los botones `Cancelar` y `Eliminar`. `Esc` o pulsar fuera cancela | Con el estilo de la app. `<dialog>` ya viene en el navegador: sin librerías |
| Aspecto | Los criterios de la sección [Aspecto](#aspecto) | La primera versión se veía anticuada y sosa |
| Idioma | Los textos de las pantallas (títulos, botones, campos, la lista vacía y la confirmación) van en español. Los mensajes de error salen tal cual los lanza `logic`, en inglés, con `Error: ` delante. El código, los nombres y lo que escribe el servidor en la terminal siguen en inglés | Quien usa las pantallas lee español. Los errores no se traducen para no duplicar [ERRORS.md](../../ERRORS.md). `STYLE.md` recoge esta excepción |
| Estilo del código | El de [STYLE.md](../../STYLE.md): funciones con nombre, una acción por línea, sin clases y sin `?.` | Igual que el resto del código |
| Lint | `eslint.config.js` gana un bloque para `src/clients/browser/**/*.js` con `document` como global. `console` y `fetch` ya están en el bloque general | `eslint .` ya revisa los ficheros nuevos; sin el paquete `globals` |
| Formato | `pnpm format` añade `src/clients/browser/**/*.{js,html,css}` | Prettier ya sabe formatear HTML y CSS |

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
- `BROWSER_ORIGIN = "file://"` (era `"http://127.0.0.1:3000"` en la versión 1.2).
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
- Desde la versión 1.2, las pruebas son las de T8 a T10 de [tasks.md](tasks.md), y desde la 1.3, las de T11 a T13.

## Cambios aprobados
| Versión | Fecha | Cambio | Motivo |
|---|---|---|---|
| 1.1 | 2026-11-03 | La confirmación del borrado pasa de `confirm()` a una ventana propia con `<dialog>`. Se añade la sección Aspecto. Pantalla 1 con filas en vez de tabla | Al ver la primera versión, la persona usuaria la encontró anticuada y sosa y pidió una confirmación con el estilo de la app |
| 1.2 | 2026-11-03 | `app.js` importa `logic/` directamente. `server.js` solo sirve ficheros y pierde las rutas `/users`. `src/db/server.js` acepta peticiones solo desde `http://127.0.0.1:3000` | La persona usuaria pidió que el navegador use `logic` sin API. Lo permite #819, que lleva la base a un servidor |
| 1.3 | 2026-11-04 | Se borra `src/clients/browser/server.js`. `index.html`, `styles.css` y `app.js` salen de `public/` y se abren desde el disco. `pnpm browser` abre Chrome en un perfil aparte con `--allow-file-access-from-files`. `BROWSER_ORIGIN` pasa a `file://` | La persona usuaria pidió un solo servidor, el de la base, sin servir la página |
