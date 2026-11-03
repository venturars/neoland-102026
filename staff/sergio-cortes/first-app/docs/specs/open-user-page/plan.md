# Plan — página de usuarios en el navegador

Issue: #843.

No es una funcionalidad nueva de usuarios. No hay fichero nuevo en `src/logic/`.
No hay firma nueva ni SQL nuevo. No se añade un paquete de Node ni cambia una
versión. No hay validación Socket.

El cliente HTTP y el servidor de la base escuchaban los dos en `127.0.0.1:3000`.
Este desarrollo quita el cliente HTTP. La página llama a `logic/` con `await`.
El puerto 3000 queda solo para `pnpm server`.

En `src/clients/web/` solo hay tres ficheros públicos: `index.html`, `styles.css`
y `app.js`. Toda la lógica de pantalla vive en `app.js` (varias funciones en el
mismo fichero; excepción en `docs/STYLE.md`). `app.js` importa `logic/` y
enlaza el DOM al arrancar (`initializeClient`).

## Ficheros

Se crea o queda como único JS:

- `src/clients/web/app.js` (estado, pantallas, popover de borrado, llamadas a
  `listUsers`, `findUserById`, `updateUser`, `deleteUser`)

Se borra:

- `src/clients/http/` (los siete ficheros)
- Los demás `.js` que había en `src/clients/web/` (`main.js`, módulos por
  pantalla, etc.)

Se toca:

- `src/clients/web/index.html` (`app.js` y `styles.css`, rutas relativas;
  popover con campo de email y confirmar con `disabled` inicial)
- `package.json` (se quita `start`; se añade `web`)
- `eslint.config.js` (se quita el bloque de `src/clients/http/`)
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`
- `docs/STYLE.md` (excepción del cliente web)
- `AGENTS.md` (la línea de «Ejecutar»)

No se toca:

- `src/clients/web/styles.css`
- `src/logic/`, `src/queries/`, `src/db/`, `src/queries/queries/`
- `src/clients/terminal/`, `src/clients/jupyter/`
- `docs/CONSTITUTIONS.md`, `docs/DATABASE.md`, `docs/ERRORS.md`
- `pnpm-lock.yaml` y el script `test`

## Parecido

Las funciones internas de `app.js` siguen el reparto que tenían los ficheros
sueltos (carga de lista, selección, menú, edición, navegación, borrado). Las
llamadas a `/api/users` del antiguo HTTP se sustituyen por `src/logic/` con
`await`.

El marcado de `index.html` y las reglas de `styles.css` se quedan. El popover
sigue siendo el `<dialog>` actual: campo de email, confirmar (deshabilitado
hasta que coincida), cancelar, Escape y clic en el fondo. No usa
`window.confirm`.

`deleteEmailMatches()` lee el input del popover y el email del usuario elegido.
Compara con `.trim()` y sin distinguir mayúsculas y minúsculas. Devuelve
`true` o `false`. `syncDeleteConfirmButton()` y `confirmDeleteSelectedUser()`
solo usan esa función; no repiten la regla.

Al abrir el popover, el input se vacía y confirmar queda deshabilitado. Al
escribir, `initializeClient` escucha `input` y llama a `syncDeleteConfirmButton`.
Si el email no coincide, confirmar sigue deshabilitado y no hay mensaje nuevo.
Al confirmar, si `deleteEmailMatches()` es `false`, no se llama a `deleteUser`.

## Llamadas

No hay función nueva en `logic/`.

| Pantalla               | Llamada                           |
| ---------------------- | --------------------------------- |
| La lista               | `await listUsers()`               |
| Elegir un id           | `await findUserById(id)`          |
| Guardar nombre y email | `await updateUser({ id, name, email })` |
| Borrar                 | `await deleteUser(id)`            |

`parseUserId(rawId)` lanza `ValidationError` con `Id is invalid` si el texto
del desplegable no vale. Se usa antes de `findUserById`. Si no hay opción
elegida, muestra «Elige un usuario de la lista.» y no llama.

La lista pinta `id`, `name` y `email`. No pinta `createdAt` ni `updatedAt`. El
formulario de edición envía siempre nombre y email. `deleteUser` se espera y
su valor no se pinta: se vuelve a cargar la lista.

Un `ValidationError`, `NotFoundError` o `ConflictError` muestra `error.message`
en el aviso que ya existe. Cualquier otro fallo de esa acción muestra la frase
en español que esa pantalla ya usa cuando la operación no se completa.

## Arranque

`pnpm server` sigue arrancando el servidor de la base. Tiene que estar en
marcha: `src/queries/user.js` hace `POST http://127.0.0.1:3000/execute`. El
script `web` no lo arranca.

Se quita `start`, que ejecutaba el cliente HTTP.

Se añade `web`. Desde first-app abre `src/clients/web/index.html` con el
binario de Brave en
`/Applications/Brave Browser.app`:

```text
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --allow-file-access-from-files --disable-web-security --user-data-dir=/tmp/first-app-brave "file://${PWD}/src/clients/web/index.html"
```

`--allow-file-access-from-files` deja que `app.js` importe `../../logic/`.
`--disable-web-security` deja ese import y el `POST` a `127.0.0.1:3000` desde
`file://`. `--user-data-dir` es un perfil aparte. El servidor de la base ya
responde `OPTIONS` y envía `Access-Control-Allow-Origin: *`.

## Documentación

- `docs/ARCHITECTURE.md`: sin `src/clients/http/`; `web/` con tres ficheros;
  `app.js` con toda la lógica de pantalla y `await` a `logic/`.
- `docs/TREE.md`: bajo `clients/`, sin `http/`; `web/` solo
  `index.html`, `styles.css`, `app.js`.
- `docs/STYLE.md`: excepción para `src/clients/web/app.js`.
- `AGENTS.md`: «Ejecutar» nombra `pnpm server` y `pnpm web` desde first-app.

## Validación Socket

No aplica. No hay paquete nuevo.

## Decisión

Toda la lógica JavaScript del cliente web vive en un solo `app.js`. No se aplica
«una función por fichero» de `docs/STYLE.md` en esa carpeta; la excepción queda
escrita en `STYLE.md`. En `src/logic/` la regla no cambia.
