# Plan: Cliente de extensión de Chrome

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. Añade un paquete, `fastify`, validado con Socket más abajo (principio 8). Sin cambios en la tabla.

## Dónde encaja
Chrome solo carga una extensión con los ficheros de su carpeta: la extensión no puede importar `src/logic/`. Por eso tiene dos partes. La extensión pide por HTTP a su API, y la API llama a `logic/` como la terminal.

```
extensión (src/clients/chrome/extension/, en Chrome)
   │ fetch, con permiso solo para 127.0.0.1:3001
   ▼
src/clients/chrome/server.js (Fastify, 127.0.0.1:3001)
   │ import
   ▼
src/logic/*  →  src/queries/users.js  →  servidor de la base (4000)
```

Ni la extensión ni la API validan ni deciden mensajes: el resultado y el mensaje del error salen de `logic` tal cual. Lo único suyo es el código HTTP de la API y el mensaje de la extensión cuando la API no contesta.

## Ficheros
```
src/clients/chrome/server.js              NUEVO: la API con Fastify
src/clients/chrome/extension/manifest.json NUEVO: la extensión, sus permisos, su CSP y su clave
src/clients/chrome/extension/popup.html    NUEVO: las dos pantallas y el aviso de borrar
src/clients/chrome/extension/styles.css    NUEVO: el aspecto
src/clients/chrome/extension/popup.js      NUEVO: pide a la API y pinta los resultados
package.json                               fastify 5.12.8, el script chrome y format de la carpeta nueva
pnpm-lock.yaml                             lo actualiza pnpm
eslint.config.js                           document también en la extensión
docs/ARCHITECTURE.md, docs/TREE.md, AGENTS.md
```
`server.js` va fuera de `extension/` para que Chrome no cargue el código de la API como parte de la extensión. No se tocan `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes.

## Comprobado antes del plan
Con una extensión mínima en una carpeta aparte, cargada en Chrome 156 sin ventana con CDP (`Extensions.loadUnpacked`):
- **Permiso del manifest.** Con `host_permissions` para la API, la extensión hace `POST` con JSON y `DELETE` aunque la API no dé permisos de navegador (`Access-Control-Allow-Origin`), y Chrome no hace la pregunta `OPTIONS` antes.
- **`Origin`.** Cada petición lleva `Origin: chrome-extension://<id>`.
- **Id fijo.** Con el campo `key` del manifest, el id es siempre el mismo y sale de esa clave. El id calculado a mano coincidió con el que dio Chrome.
- **CSP.** Sin CSP, una llamada a una dirección sin permiso llega al servidor, aunque la extensión no puede leer la respuesta. Con `connect-src` en el manifest, esa llamada ya no sale.
- **Paquete.** `fastify` 5.12.8 se publicó el 2026-11-02: pasa el tiempo mínimo de pnpm sin excepciones.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Paquete | `fastify` 5.12.8, la última, con versión exacta en `dependencies` (`pnpm add fastify@5.12.8 --save-exact`) | Lo pide la issue. Como `express`, es para arrancar un servidor de la app |
| Dirección | `127.0.0.1:3001`. `HOST` y `PORT` son constantes | Solo este equipo. El 3000 es de la API REST y el 4000 de la base |
| Arranque | `pnpm chrome`, que lanza `node --no-warnings src/clients/chrome/server.js` y escribe `Chrome extension API: http://127.0.0.1:3001` | Como `pnpm db` y `pnpm api` |
| Rutas | `GET /users`, `POST /users` con `{ name, email }` (201), `PATCH /users/<id>` con `{ name, email }` y `DELETE /users/<id>` (200 y `{ id }`). Cada una es una función con nombre que llama a `listUsers`, `createUser`, `updateUser` o `deleteUser` con `await` | Solo lo que usa la extensión |
| Códigos | `getStatus(message)` de la API mira cómo empieza el mensaje: 400 para `Name is required.`, `Email is required.`, `Invalid email:`, `Invalid id:` y `Provide a new name, a new email, or both.`; 404 para `User not found:`; 409 para `Email already exists:`; 503 para `Database is not running.`; 500 para otro. Responde `{ "error": error.message }` | Los mismos que la API REST, sin los de las operaciones que esta API no tiene |
| Errores de Fastify | `setErrorHandler`: un cuerpo que no es JSON da 400 y `Invalid request.`, y lo demás pasa por `getStatus`. `setNotFoundHandler`: 404 y `Not found.` | Las mismas palabras que el servidor de la base y la API REST |
| Solo la extensión | `EXTENSION_ORIGIN = "chrome-extension://<id>"`. Una petición con otra cabecera `Origin` recibe 403 y `Forbidden origin.` Una sin `Origin`, como `curl`, pasa | Una web no puede hacerse pasar por la extensión: su `Origin` lo pone el navegador. Igual que el servidor de la base con `file://` |
| Sin permisos de navegador | La API no envía `Access-Control-Allow-Origin` | La extensión no lo necesita (comprobado) y una web no puede leer las respuestas |
| Clave de la extensión | Se genera una vez una clave RSA. En `manifest.json` va solo la parte pública, en `key`. La privada no se guarda | Con la clave pública el id es fijo, así que la API puede aceptar solo ese `Origin`. La privada solo sirve para empaquetar, que queda fuera |
| Manifest | Versión 3, nombre `first-app usuarios`, `action.default_popup` con `popup.html`, `host_permissions` solo con `http://127.0.0.1:3001/*` | Lo mínimo para abrir la ventanita y llamar a la API |
| CSP | `content_security_policy.extension_pages`: `default-src 'none'; script-src 'self'; style-src 'self'; connect-src http://127.0.0.1:3001` | Solo carga sus ficheros y solo habla con su API. Comprobado antes del plan |
| Pantallas | Dos `<section>`, una visible cada vez, y un `<dialog>` para borrar, como el cliente de escritorio, en una ventana de 380 px de ancho | Ficheros propios: no se reutilizan los otros clientes |
| Ficha | Los datos salen del usuario elegido en la lista. Después de guardar, salen de lo que devuelve la API | Sin función nueva para buscar por id |
| Peticiones | `callApi(method, path, body)` en `popup.js`: hace el `fetch`, y si la respuesta no es buena lanza `Error` con su `error`. Si el `fetch` no llega, lanza `API is not running. Start it with pnpm chrome.` | Un solo sitio para hablar con la API |
| Errores en pantalla | `Error: <mensaje>` en un párrafo propio de cada pantalla, que se borra al empezar la siguiente acción | Igual que los otros clientes |
| Textos | En la página con `textContent`, nunca con HTML | Un nombre con `<` se ve tal cual |
| ESLint | El bloque que da `document` pasa a cubrir también `src/clients/chrome/extension/**/*.js` | `popup.js` usa `document`. `server.js` no necesita nada más |
| Formato | `format` incluye `src/clients/chrome/**/*.{js,html,css,json}` | Como los otros clientes, y también el manifest |
| Estilo | El de [STYLE.md](../../STYLE.md): funciones con nombre, una acción por línea, sin `?.` | Igual que el resto del código |

## `server.js`
1. Comentario inicial con su responsabilidad.
2. Imports: `fastify` y las cuatro funciones de `logic/`.
3. `HOST`, `PORT`, `EXTENSION_ORIGIN` y las listas de prefijos de cada código.
4. `getStatus(message)`.
5. `checkOrigin(request, reply)`, que corre antes de cada ruta.
6. Una función por ruta: `list`, `create`, `update` y `remove`.
7. `handleError` y `handleNotFound`.
8. Crear la app, registrar `checkOrigin`, las rutas y los manejadores, y `listen`.

## `popup.js`
1. Comentario inicial, `API_URL` y `API_STOPPED`.
2. `callApi`.
3. `showScreen`, `showError`, `clearError`, `writeText`.
4. `loadUsers`, `addUser`, `showUser`, `openUser`, `saveUser`, `askDelete`, `closeDeleteDialog`, `removeUser` y `goBack`.
5. `connectButtons()` y la carga inicial de la lista.

## Validación con Socket
Paquete nuevo: `fastify@5.12.8`. Su árbol, sacado de un `package-lock` de prueba fuera del proyecto, son 48 paquetes. Revisado el 2026-11-04.

- **Puntuaciones (`depscore`)**: los 48 contestan. Ninguna puntuación baja de 50. Las más bajas:
  - Mantenimiento 75: `fast-deep-equal@3.1.3`, `require-from-string@2.0.2`, `fast-decode-uri-component@1.0.1`, `quick-format-unescaped@4.0.4`, `abstract-logging@2.0.1`, `json-schema-traverse@1.0.0` y `atomic-sleep@1.0.0`.
  - Calidad 75: `real-require@1.0.0`. Calidad 77: `abstract-logging@2.0.1`.
  - `fastify@5.12.8`: licencia 100, mantenimiento 97, calidad 100, cadena de suministro 98 y vulnerabilidades 100.
- **Alertas (`alerts`)**, con la organización `sergiomoras` y el nombre `fastify`: la lista está vacía. Es la lista de alertas de la organización, no dice que estas versiones no tengan alertas.
- **Campañas (`threat_feed`)**: la cuenta no tiene esa fuente (`403 threat_feed_not_entitled`).

Quien acepta el plan acepta estas puntuaciones.

## Cómo se prueba
- Guardar la salida de `list-users.txt` antes de empezar.
- **API con `curl`**, con `pnpm db` y `pnpm chrome` en marcha y el usuario temporal `tmp-998-1`: cada ruta con su código, los errores de la spec, una ruta que no existe, un cuerpo que no es JSON, un `Origin` que no es el de la extensión (403) y, con la base parada, 503.
- **Extensión con CDP**: Chrome sin ventana con un perfil aparte, `Extensions.loadUnpacked` y la ventanita abierta en una pestaña. Con `tmp-998-2`: la lista, el alta, la ficha con sus cinco datos, guardar el nombre, el email y los dos, borrar cancelando y confirmando, volver sin guardar, los errores de la spec, un usuario borrado desde la terminal con la ficha abierta, el error de API parada y el de base parada, y que una llamada a otra dirección se bloquea.
- Comprobar que el id de la extensión cargada es el que espera la API.
- Al terminar no queda ningún `tmp-998-*` y `list-users.txt` da lo mismo que al empezar.
- `pnpm format` y `pnpm lint` sin errores.
- Después, el alumno carga la extensión en su Chrome y la prueba a mano.
