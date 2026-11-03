# Plan: Cliente de navegador

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. Sin paquetes nuevos ni cambios en la tabla, así que no hay validación de Socket.

## Cómo llega el navegador a `logic/`
El JavaScript del navegador no puede importar `src/logic/`, porque `logic` usa `node:sqlite` y eso solo existe en Node. Por eso el cliente tiene dos partes:

```
navegador (index.html, styles.css, app.js)
   │ fetch a http://127.0.0.1:3000
   ▼
src/clients/browser/server.js   (node:http, viene con Node)
   │ import directo
   ▼
src/logic/*  →  src/queries/users.js  →  src/db/connection.js
```

El servidor es un cliente más, como la terminal y Jupyter: llama a una función de `logic/` y devuelve el resultado o el mensaje del error. No valida nada ni decide mensajes. No hay capa nueva entre `clients/` y `logic/`.

## Ficheros
```
src/clients/browser/server.js           NUEVO: sirve las pantallas y llama a logic
src/clients/browser/public/index.html   NUEVO: las tres pantallas
src/clients/browser/public/styles.css   NUEVO
src/clients/browser/public/app.js       NUEVO: cambia de pantalla y llama al servidor
package.json                            script browser y format de los ficheros nuevos
eslint.config.js                        globales del navegador para app.js
docs/ARCHITECTURE.md, docs/TREE.md, docs/STYLE.md, AGENTS.md
```
No se tocan `src/logic/`, `src/queries/`, `src/db/` ni los clientes de terminal y Jupyter.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Servidor | `node:http` en `127.0.0.1:3000`. `PORT` y `HOST` son constantes | Viene con Node. Solo escucha en este equipo |
| Arranque | `pnpm browser`, que lanza `node --no-warnings src/clients/browser/server.js` y escribe la dirección | Un solo comando, como `pnpm format` |
| Ficheros estáticos | `GET /`, `/styles.css` y `/app.js` se leen de `public/` con `node:fs/promises`, con su `Content-Type` | Solo se sirven esos tres; cualquier otra ruta da 404 |
| Rutas de datos | `GET /users` → `listUsers()`. `PUT /users/<id>` con `{ name, email }` → `updateUser(id, name, email)`. `DELETE /users/<id>` → `deleteUser(id)` | Una ruta por función que usan las pantallas. El `<id>` llega como texto y lo valida `logic`, igual que desde la terminal |
| Respuestas | Bien: 200 y el resultado en JSON. Error de `logic`: 400 y `{ "error": "<mensaje>" }`. Ruta desconocida: 404 y `Not found.` | El navegador muestra `Error: <mensaje>`, igual que la terminal |
| Pantallas | Un solo `index.html` con tres `<section>`. `app.js` enseña una y oculta las otras | Sin recargar la página y sin router |
| Estado | `app.js` guarda la lista y el usuario elegido en dos variables. Al guardar, el usuario elegido pasa a ser el que devuelve el servidor | La pantalla 2 no necesita pedir nada al servidor |
| Notas | `<button disabled>` con el texto `Notas` y una etiqueta `Próximamente` | Se ve y no hace nada |
| Confirmar el borrado | Ventana propia con `<dialog>` de HTML y `showModal()`: título, la pregunta con el nombre y el id, y los botones `Cancelar` y `Eliminar`. `Esc` o pulsar fuera cancela | Con el estilo de la app. `<dialog>` ya viene en el navegador: sin librerías |
| Aspecto | Los criterios de la sección [Aspecto](#aspecto) | La primera versión se veía anticuada y sosa |
| Idioma | Los textos de las pantallas (títulos, botones, campos, la lista vacía y la confirmación) van en español. Los mensajes de error salen tal cual los lanza `logic`, en inglés, con `Error: ` delante. El código, los nombres y lo que escribe el servidor en la terminal siguen en inglés | Quien usa las pantallas lee español. Los errores no se traducen para no duplicar [ERRORS.md](../../ERRORS.md). `STYLE.md` recoge esta excepción |
| Estilo del código | El de [STYLE.md](../../STYLE.md): funciones con nombre, una acción por línea, sin clases y sin `?.` | Igual que el resto del código |
| Lint | `eslint.config.js` gana un bloque para `src/clients/browser/public/**/*.js` con `document` y `fetch` como globales. El servidor usa `console`, que se añade al bloque general | `eslint .` ya revisa los ficheros nuevos; sin el paquete `globals` |
| Formato | `pnpm format` añade `src/clients/browser/**/*.{js,html,css}` | Prettier ya sabe formatear HTML y CSS |

## `server.js`
1. Comentario inicial con su responsabilidad.
2. Importa `createServer` de `node:http`, `readFile` de `node:fs/promises`, y `listUsers`, `updateUser` y `deleteUser` de `logic/`.
3. `sendJson(response, status, data)` y `sendFile(response, fileName, contentType)`.
4. `readBody(request)` junta los trozos del cuerpo y devuelve el JSON.
5. `handleRequest(request, response)`: mira el método y la ruta, llama a la función y responde. Todo dentro de un `try`; el `catch` responde 400 con `error.message`.
6. `createServer(handleRequest).listen(PORT, HOST)` y escribe `Browser client: http://127.0.0.1:3000`.

## `app.js`
- `showScreen(name)`: enseña una `<section>` y oculta las demás.
- `loadUsers()`: `GET /users` y pinta la lista, o el texto de lista vacía.
- `selectUser(user)`: guarda el usuario y pinta la pantalla 2.
- `openEditor()`: rellena los campos y pinta la pantalla 3.
- `saveUser()`: `PUT /users/<id>`. Si va bien, vuelve a la pantalla 2 con los datos nuevos. Si no, enseña `Error: <mensaje>`.
- `askDeleteConfirmation()`: escribe la pregunta en la ventana y la abre con `showModal()`.
- `removeUser()`: se llama desde el botón `Eliminar` de la ventana. Cierra la ventana, hace `DELETE /users/<id>` y vuelve a la lista. `Cancelar` solo cierra la ventana.
- Los botones se enganchan con `addEventListener` al cargar la página.

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

## Cambios aprobados
| Versión | Fecha | Cambio | Motivo |
|---|---|---|---|
| 1.1 | 2026-11-03 | La confirmación del borrado pasa de `confirm()` a una ventana propia con `<dialog>`. Se añade la sección Aspecto. Pantalla 1 con filas en vez de tabla | Al ver la primera versión, la persona usuaria la encontró anticuada y sosa y pidió una confirmación con el estilo de la app |
