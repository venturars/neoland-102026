# Plan — buscar un usuario por email desde Chrome, VS Code y la API de Nest

Issue: #1066

Funcionalidad nueva, solo en `src/clients/chrome/`, `src/clients/vscode/` y `src/clients/nest/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje de error nuevo. No hay paquetes nuevos, así que no hay comprobación de Socket.

Los tres clientes llaman a `findUserByEmail(email)` de `src/logic/find-user-by-email.js`, sin cambiarla. `validateEmail` recorta el email y lo pasa a minúsculas.

## Ficheros

Se tocan:

- `src/clients/chrome/server.js` — la ruta nueva.
- `src/clients/chrome/index.html` — el formulario.
- `src/clients/chrome/popup.js` — envía la búsqueda y muestra el usuario.
- `src/clients/vscode/extension.js` — la acción nueva en `runAction`.
- `src/clients/vscode/index.html` — el formulario.
- `src/clients/vscode/panel.js` — envía la acción.
- `src/clients/nest/users.service.js` y `users.controller.js` — la ruta nueva.
- `src/clients/nest/logic-exception.filter.js` — su caso en `elegirFallo`.
- `docs/ARCHITECTURE.md` — los tres clientes también buscan por email.

No se crea ningún fichero de código y `styles.css` no cambia.

## API

| Método y ruta | Operación | Respuesta buena |
| --- | --- | --- |
| `GET /users/by-email?email=` | `findUserByEmail(email)` | 200, usuario |

Vale para Chrome (3002) y Nest (3003). La comprobación de `Host` y `Origin` de cada API ya cubre todas sus rutas.

- **Nest:** `@Get("by-email")` va **antes** de `@Get(":id")`, porque gana la primera ruta que coincide. El email entra con `@Bind(Query("email"))`.
- **Fastify:** elige la ruta fija antes que `:id` sin importar el orden. Se escribe también antes, para que se lea igual que en Nest. El email entra por `request.query.email`.
- El cliente no valida: un email que no llega entra como `undefined` y la lógica responde `Email is invalid`.

## Ventana de Chrome

Un formulario `find-email-form`, con un campo de tipo `text` y sin `required`. Al enviarlo:

1. Vacía los mensajes y el usuario anterior.
2. Llama a `callApi` con `/users/by-email?email=` y el texto pasado por `encodeURIComponent`, con `Could not find the user` como fallo. Hace falta porque un email puede llevar `+`, que en la dirección se leería como un espacio.
3. Muestra el usuario con `showViewedUser`, igual que «Ver».

## Vista de VS Code

- `extension.js`: `action === "find-by-email"` devuelve `{ user: await findUserByEmail(email) }`. No entra en `CAMBIAN_DATOS`.
- `panel.js`: envía la acción con `send`. No hace falta tocar `handleReply`, porque ya muestra `user` con `showViewedUser`.

## Firma

No hay función nueva en `src/logic/`.

## SQL

No hay SQL.

## Errores

| Fallo de la spec | Mensaje de `docs/ERRORS.md` | Estado |
| --- | --- | --- |
| El email no vale | `Email is invalid` | 400 |
| El usuario no está | `User not found` | 404 |
| No se llega a la base | `Could not find the user` | 500 |
| La API de Chrome está parada | `Could not find the user`, lo pone `popup.js` | sin estado |

- **Chrome:** `responderError(reply, error, "Could not find the user")`.
- **Nest:** los tres mensajes ya están en `ESTADOS`. `elegirFallo` devuelve `Could not find the user` si `request.path` es `/users/by-email`. Sin este caso, un error desconocido saldría como `Could not list the users`, porque la ruta no lleva id.

## Comentarios

Líneas cortas y comentarios por bloques en castellano, también en los imports. Cada comentario es una frase sencilla, que dice qué hace el bloque y, si no es obvio, por qué, sin palabras técnicas sin explicar. Por ejemplo:

- `// Va antes que /users/:id. Si no, "by-email" se tomaría por un id.`
- `// Un email puede llevar un +: se prepara para la dirección.`

Antes de cada commit se releen los comentarios nuevos con esta regla.

## Relación con las PR #1060 y #1065

Esta rama sale de `staging`, que aún no tiene el recuento por género ni la búsqueda por nombre. Las tres tocan los mismos ficheros y en sitios parecidos: rutas antes de `:id`, `elegirFallo` y `runAction`. Las que se fusionen después tendrán conflictos pequeños, que se resuelven conservando todas las partes. `@Bind(Query(...))` también lo usa la #1065, así que el import de `Query` puede salir repetido en el conflicto y se deja uno.

## Pruebas

No hay tests en el proyecto. Con `pnpm start`, `pnpm chrome` y `pnpm nest` en marcha, en 3002 y 3003:

1. `ana@ejemplo.com`: 200 y su usuario.
2. `ANA@ejemplo.com` y con espacios alrededor: lo encuentra igual.
3. Un usuario de prueba con `+` en el email: lo encuentra. Se borra al terminar.
4. `nadie@ejemplo.com`: 404 con `User not found`.
5. Sin `email`, vacío y `ana`: 400 con `Email is invalid`.
6. Con el servidor de datos parado de verdad: 500 con `Could not find the user`. Si Diego lo tiene en marcha, se le avisa antes.
7. `Host` ajeno y `Origin` no permitido: 403 en la ruta nueva.
8. `GET /users/1`, `GET /users` y las demás rutas responden como antes.
9. Diego prueba las dos ventanas a mano: una búsqueda con resultado, un email que no está y uno que no vale.
10. `pnpm format` y `pnpm lint` pasan. Los saltos de línea que `format` cambia en ficheros ajenos se restauran y no entran en la PR.
