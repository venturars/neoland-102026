# Plan — buscar usuarios por nombre desde Chrome, VS Code y la API de Nest

Issue: #1064

Funcionalidad nueva, solo en `src/clients/chrome/`, `src/clients/vscode/` y `src/clients/nest/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje de error nuevo. No hay paquetes nuevos, así que no hay comprobación de Socket.

Los tres clientes llaman a `findUserByName(name)` de `src/logic/find-user-by-name.js`, sin cambiarla. La consulta es `WHERE name = :name`, así que la coincidencia es exacta.

## Ficheros

Se tocan:

- `src/clients/chrome/server.js` — la ruta nueva.
- `src/clients/chrome/index.html` — el formulario y la lista de resultados.
- `src/clients/chrome/popup.js` — envía la búsqueda y muestra los resultados.
- `src/clients/vscode/extension.js` — la acción nueva en `runAction`.
- `src/clients/vscode/index.html` — el formulario y la lista de resultados.
- `src/clients/vscode/panel.js` — envía la acción y muestra los resultados.
- `src/clients/nest/users.service.js` y `users.controller.js` — la ruta nueva.
- `src/clients/nest/logic-exception.filter.js` — su caso en `elegirFallo`.
- `docs/ARCHITECTURE.md` — los tres clientes también buscan por nombre.

No se crea ningún fichero de código. La lista de resultados reutiliza la clase `user-list`, así que `styles.css` no cambia.

## API

| Método y ruta | Operación | Respuesta buena |
| --- | --- | --- |
| `GET /users/by-name?name=` | `findUserByName(name)` | 200, array de usuarios, vacío si no hay |

Vale para Chrome (3002) y Nest (3003). La comprobación de `Host` y `Origin` de cada API ya cubre todas sus rutas.

- **Nest:** `@Get("by-name")` va **antes** de `@Get(":id")`, porque gana la primera ruta que coincide. El nombre entra con `@Bind(Query("name"))`.
- **Fastify:** elige la ruta fija antes que `:id` sin importar el orden. Se escribe también antes, para que se lea igual que en Nest. El nombre entra por `request.query.name`.
- El cliente no valida: un nombre que no llega entra como `undefined` y la lógica responde `Name is empty`.

## Ventana de Chrome

Un formulario `find-name-form`, con un campo de tipo `text` y sin `required`, y una lista `found-users`. Al enviarlo:

1. Vacía los mensajes y los resultados anteriores.
2. Llama a `callApi` con `/users/by-name?name=` y el texto pasado por `encodeURIComponent`, con `Could not find the user` como fallo.
3. Pinta cada usuario con `userText` y `textContent`. Si no hay ninguno, muestra el aviso con `showMessage`.

## Vista de VS Code

- `extension.js`: `action === "find-by-name"` devuelve `{ foundUsers: await findUserByName(name) }`. No entra en `CAMBIAN_DATOS`. La clave es `foundUsers` y no `users`, porque `users` repinta la lista general.
- `panel.js`: los mismos pasos que en Chrome. `handleReply` pinta `foundUsers`.

## Resultados anteriores

Los resultados desaparecen al hacer otra acción, porque pueden quedar viejos. Igual que con el recuento por género, se vacían dentro de `showViewedUser`, que todas las acciones ya llaman al empezar.

## Firma

No hay función nueva en `src/logic/`.

## SQL

No hay SQL.

## Errores

| Fallo de la spec | Mensaje de `docs/ERRORS.md` | Estado |
| --- | --- | --- |
| El nombre queda vacío | `Name is empty` | 400 |
| No se llega a la base | `Could not find the user` | 500 |
| La API de Chrome está parada | `Could not find the user`, lo pone `popup.js` | sin estado |

- **Chrome:** `responderError(reply, error, "Could not find the user")`.
- **Nest:** los dos mensajes ya están en `ESTADOS`. `elegirFallo` devuelve `Could not find the user` si `request.path` es `/users/by-name`. Sin este caso, un error desconocido saldría como `Could not list the users`, porque la ruta no lleva id.
- «No hay usuarios con ese nombre» es un aviso de pantalla, no un error, así que no entra en `docs/ERRORS.md`. Tampoco lo devuelve ninguna API: responden la lista vacía.

## Comentarios

Líneas cortas y comentarios por bloques en castellano, también en los imports. Cada comentario es una frase sencilla, que dice qué hace el bloque y, si no es obvio, por qué, sin palabras técnicas sin explicar. Por ejemplo:

- `// Va antes que /users/:id. Si no, "by-name" se tomaría por un id.`
- `// Pasa a la función el nombre que llega en la dirección.`
- `// El nombre puede llevar espacios o acentos: se prepara para la dirección.`

Antes de cada commit se releen los comentarios nuevos con esta regla.

## Relación con la PR #1060

Esta rama incluye la del recuento por género, con sus conflictos ya resueltos. Hay que fusionar primero la PR #1060 y después esta. Si se fusiona esta antes, el recuento entra con ella.

## Pruebas

No hay tests en el proyecto. Con `pnpm start`, `pnpm chrome` y `pnpm nest` en marcha, en 3002 y 3003:

1. `Ana García` (con el espacio y el acento en la dirección): 200 y su usuario. Así se comprueba `encodeURIComponent` y la lectura del texto.
2. `Ana`: 200 y lista vacía.
3. Con espacios alrededor del nombre: lo encuentra igual, porque la lógica los quita.
4. Sin `name` y con `name` vacío: 400 con `Name is empty`.
5. Dos usuarios con el mismo nombre: salen los dos. Se crean con emails únicos y se borran al terminar.
6. Con el servidor de datos parado de verdad: 500 con `Could not find the user`. Si Diego lo tiene en marcha, se le avisa antes.
7. `Host` ajeno y `Origin` no permitido: 403 en la ruta nueva.
8. `GET /users/1`, `GET /users` y las demás rutas responden como antes.
9. Diego prueba las dos ventanas a mano: una búsqueda con resultado, una sin resultado, el campo vacío y que los resultados desaparecen al hacer otra acción.
10. `pnpm format` y `pnpm lint` pasan. Los saltos de línea que `format` cambia en ficheros ajenos se restauran y no entran en la PR.
