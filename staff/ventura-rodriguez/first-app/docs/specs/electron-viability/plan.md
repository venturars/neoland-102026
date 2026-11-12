# Plan — cliente de escritorio propio

Issue: #901.

No es una funcionalidad nueva. No se reemplaza ningún fichero de
`logic/`. No hay firma nueva. No hay SQL nuevo. No hay mensaje nuevo.

Hay un paquete nuevo: `electron@45.2.2`, en `devDependencies`. Entra
Socket. El árbol de abajo es el que resuelve npm para esa versión y
sus rangos, hasta 3 capas. Son 12 paquetes, sin repetir versión. Aún
no está instalado. Si `pnpm` resuelve otra versión dentro de un
rango, esa versión no es la de este resumen y hay que volver a
pasarla por Socket.

El cliente nuevo es `src/clients/electron/`. No reutiliza
`src/clients/browser/`: no abre su página ni importa sus ficheros.
Llama a `src/logic/`. Se parece a los clientes de
`src/clients/terminal/`: la llamada está en el cliente y la regla
sigue en `logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`.
Ver uno usa `findUserById(id)`. Modificar usa
`updateUser(id, changes)`. Borrar usa `deleteUser(id)`. No se importa
`users-gender-count.js`, `find-user-by-name.js` ni
`find-user-by-email.js`.

Esas funciones solo llegan a `src/queries/users.js` y a los textos
SQL. Usan `fetch`. No importan módulos de Node ni paquetes de
`node_modules`. El proceso que pinta la ventana carga módulos con el
cargador de Chromium: ese cargador no resuelve `node:` ni
`node_modules`. Por eso este cliente no importa
`users-gender-count.js`, que importa `openai`.

El proceso principal importa `app` y `BrowserWindow` desde
`electron`. `package.json` ya tiene `"type": "module"`, así que
`main.js` es un módulo ES. Electron admite ese formato desde la
versión 28. Cuando la app está lista, abre una ventana y carga el
HTML que está junto a `main.js`, no el del directorio de trabajo. Al
cerrar todas las ventanas, la app sale si la plataforma no es
`darwin`. Al activarla en `darwin`, si no hay ventanas, abre una.
Esas dos reglas salen del tutorial oficial de la primera app de
Electron. El campo `main` de `package.json` sigue en `index.js`.

La página es HTML, CSS y JavaScript, sin otro paquete. El script es
`type="module"`. El texto que ve la persona está en español. El
código está en inglés.

La primera pantalla lista los usuarios, con id, nombre y email, y
tiene el alta con nombre y email. Si no hay usuarios, la lista está
vacía. Elegir uno abre su ficha: id, nombre, email y las dos fechas.
Desde la ficha se modifica o se borra. Un campo que no entra no va
en `changes`, y `updateUser` conserva el valor guardado. Al borrar,
se vuelve a la lista.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. La
base se arranca con el comando que ya existe. `package.json` tiene
el script `electron`. Se lanza con `pnpm electron` desde `first-app`.
El comando es `electron src/clients/electron/main.js`. Los scripts
`server`, `browser`, `http`, `jupyter`, `test`, `format` y `lint`
siguen. `format` también incluye `src/clients/electron/**/*.js`.

No se generan instaladores. No se crea `.npmrc` y no se cambia el
linker de pnpm.

## Ficheros

Se crean:

- `src/clients/electron/main.js`
- `src/clients/electron/index.html`
- `src/clients/electron/app.js`
- `src/clients/electron/styles.css`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`

`package.json` añade `electron@45.2.2` en `devDependencies` y el
script `electron`.

En el árbol, `clients/` incluye `electron/` con `main.js`,
`index.html`, `app.js` y `styles.css`. En la arquitectura, ese
cliente llama a `src/logic/`, abre su ventana y no reutiliza
`src/clients/browser/`. No sustituye a `src/db/server.js`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                  | Mensaje                     |
| --------------------------------- | --------------------------- |
| El nombre queda vacío             | `Name is empty`             |
| El email no vale                  | `Email is invalid`          |
| El email es de otro usuario       | `Email is already used`     |
| El usuario no está                | `User not found`            |
| No se llega a la base al crear    | `Could not create the user` |
| No se llega al listar             | `Could not list the users`  |
| No se llega al ver uno            | `Could not find the user`   |
| No se llega al modificar          | `Could not update the user` |
| No se llega al borrar             | `Could not delete the user` |

No hay mensaje nuevo. El cliente muestra el que ya lanza `logic/`.

## Socket

`threat_feed` para `electron@45.2.2` respondió 403
`threat_feed_not_entitled`. La cuenta no tiene threat feed. No hay
dato de campaña por versión. En cada paquete, la campaña es esa.

`depscore` dio las cinco stats. Ninguna está por debajo de 50.

`alerts` filtrado por nombre, con la lista vacía, no dice que esa
versión no tenga alerta. Pasó en los doce paquetes.

La lista de alertas npm abiertas de `ai-engineering` no está vacía.
Se leyeron las primeras 500 y la lista sigue. En esas 500 no salen
estos paquetes. Eso tampoco dice que la versión no tenga alerta.

Quien acepta el plan decide si ese resultado se acepta.

- `debug@4.4.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 81, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `electron@45.2.2`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 97, quality 99, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `env-paths@3.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 80, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `graceful-fs@4.2.11`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 79, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `ms@2.1.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 84, quality 86, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `progress@2.0.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `semver@7.8.6`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 95, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `sumchecker@3.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 75, quality 98, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `undici-types@7.24.6`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 96, quality 74, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@electron-internal/extract-zip@1.0.8`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 94, quality 98, supplyChain 95, vulnerability 100. Ninguna stat por debajo de 50.
- `@electron/get@5.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 82, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@types/node@24.19.2`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 96, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.

## Decisión

Este desarrollo crea `src/clients/electron/` y actualiza
`docs/TREE.md` y `docs/ARCHITECTURE.md`. No se reutiliza
`src/clients/browser/`. Terminal, jupyter, browser y http siguen.
`logic/` no se reemplaza. El paquete es `electron@45.2.2`.
