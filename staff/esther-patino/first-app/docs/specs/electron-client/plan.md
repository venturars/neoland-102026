# Plan — cliente de escritorio propio

Issue: #975.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún
fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma
nueva ni SQL nuevo. No se añade un `.txt` en `src/clients/terminal/`.

Hay un paquete nuevo: `electron@45.2.2`, en `devDependencies`. El
resumen de Socket está más abajo. Aún no está instalado. El árbol es
el que resolvió npm para esa versión y sus rangos, hasta 3 capas. Son
12 paquetes, sin repetir versión. Si `pnpm` resuelve otra versión
dentro de un rango, esa versión no es la de este resumen y hay que
volver a pasarla por Socket.

Todo el cliente vive en `src/clients/electron/`. No abre la página de
`src/clients/web/` ni importa sus ficheros. No pide la API de
`src/clients/http/` ni la de `src/clients/chrome/`. La parte que abre
la ventana llama a `src/logic/`. La página no importa `src/logic/`:
pide esa acción a la parte que abre la ventana. Se parece a los
clientes de `src/clients/terminal/`: la llamada está en el cliente y
la regla sigue en `src/logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`.
Ver uno usa `findUserById(id)`. Modificar usa `updateUser(id, changes)`.
Borrar usa `deleteUser(id)`. No se importa `users-gender-count.js`,
`find-user-by-name.js` ni `find-user-by-email.js`.

Esas cinco funciones solo llegan a `src/queries/users.js` y a los
textos SQL. Usan `fetch` contra `http://127.0.0.1:3000`. No importan
módulos de Node ni paquetes de `node_modules`. `users-gender-count.js`
importa `openai`, y este cliente no lo usa.

`main.js` importa `app`, `BrowserWindow` e `ipcMain` desde `electron`.
`package.json` ya tiene `"type": "module"`, así que `main.js` es un
módulo ES. Electron admite ese formato desde la versión 28. Cuando la
app está lista, abre una ventana y carga el HTML que está junto a
`main.js`, no el del directorio de trabajo. `webPreferences.preload`
apunta a `preload.js`, en esa misma carpeta. `contextIsolation` sigue
en su valor por defecto, que es activo. `nodeIntegration` sigue en su
valor por defecto, que es inactivo. Al cerrar todas las ventanas, la
app sale si la plataforma no es `darwin`. Al activarla en `darwin`,
si no hay ventanas, abre una. El campo `main` de `package.json` sigue
en `index.js`.

`preload.js` publica cinco llamadas con `contextBridge`. Cada una usa
`ipcRenderer.invoke`. La página las usa y no importa `electron`.

`ipcMain.handle` recibe la acción y llama a la función de `src/logic/`.
El id es el del usuario elegido. No se teclea. Si un campo no viene,
no entra en `changes`, y `updateUser` conserva el valor guardado. El
cliente no valida el nombre ni el email. Si lo lanzado es un `Error`
con un mensaje de la tabla de abajo, la ventana muestra ese texto. Si
el mensaje no está en la tabla, la ventana muestra el `Could not` de
esa acción. No inventa un mensaje. `Query failed` no se muestra.

La página es HTML, CSS y JavaScript, sin otro paquete. El texto que
ve la persona está en español. El código está en inglés. La lista
muestra id, nombre y email. Si no hay usuarios, está vacía. Elegir
uno muestra el id, el nombre, el email y las dos fechas. Desde ahí se
modifica o se borra. Al borrar, ese usuario sale de la lista.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. La
base se arranca con `pnpm server`. Este cliente no escucha en un
puerto. `package.json` tiene el script `electron`. Se lanza con
`pnpm electron` desde `first-app`. El comando es
`electron src/clients/electron/main.js`. Los scripts `server`, `http`,
`chrome`, `open`, `format` y `lint` siguen. `format` sigue siendo
`prettier --write .`.

No se generan instaladores.

## Ficheros

Se crean:

- `src/clients/electron/main.js`
- `src/clients/electron/preload.js`
- `src/clients/electron/index.html`
- `src/clients/electron/app.js`
- `src/clients/electron/styles.css`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`

`package.json` añade `electron` en `45.2.2` a `devDependencies` y el
script `electron`.

`docs/tree.md` añade `electron/` dentro de `clients/`, con `main.js`,
`preload.js`, `index.html`, `app.js` y `styles.css`.

`docs/ARCHITECTURE.md` dice que `src/clients/electron/` abre su
ventana, llama a `src/logic/` desde `main.js` y no repite sus reglas.
La página no importa `src/logic/`. No sustituye a `src/db/server.js`
ni a los clientes HTTP, Chrome o web.

`docs/style.md` añade el comando `pnpm electron`. La base sigue en
`127.0.0.1:3000`. Este cliente no escucha en un puerto.

`docs/CONSTITUTIONS.md` dice, en la sección 1, que también se crea,
se lista, se ve, se cambia y se borra un usuario desde una ventana de
escritorio, y que la base sigue en el puerto 3000. En la sección 7
dice que este cambio añade el cliente Electron y no añade un `.txt`.
`AGENTS.md` no cambia: el `.txt` sigue siendo el cliente de una
funcionalidad nueva, y esta no lo es.

`docs/errors.md` no cambia. Los mensajes de la tabla ya están.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, la terminal,
Jupyter, `src/clients/web/`, `src/clients/http/` ni
`src/clients/chrome/`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec               | Mensaje                     |
| ------------------------------ | --------------------------- |
| El nombre queda vacío          | `Name is empty`             |
| El email no vale               | `Email is invalid`          |
| El email es el de otro usuario | `Email is already used`     |
| Ese usuario no está            | `User not found`            |
| No se llega a la base al crear | `Could not create the user` |
| No se llega al listar          | `Could not list the users`  |
| No se llega al ver uno         | `Could not find the user`   |
| No se llega al modificar       | `Could not update the user` |
| No se llega al borrar          | `Could not delete the user` |

La lista vacía no es un fallo. No hay mensaje nuevo.

## Socket

Tres datos. Cada uno dice de dónde sale.

Las stats salen de `depscore`, con la versión exacta. Ninguna está
por debajo de 50. La más baja es quality 74, en `undici-types@7.24.6`.

La alerta sale de `alerts`, con `org_slug` `socket-dev-neoland`, que
es el que devolvió `organizations`. Se pidió la lista abierta de
`npm`. `items` llegó vacío y `endCursor` llegó nulo. Una lista vacía
es la lista de la organización. No dice que estas versiones no tengan
alerta.

La campaña sale de `threat_feed` para `electron@45.2.2`, con ese
mismo `org_slug`. Respondió 403 `threat_feed_not_entitled`: la
organización no tiene threat feed. No hay dato de campaña. El rechazo
es de la organización, así que tampoco hay dato de campaña para el
resto del árbol.

Quien acepta el plan decide si ese resultado se acepta.

- `@electron-internal/extract-zip@1.0.8`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 94, quality 98, supplyChain 95, vulnerability 100.
- `@electron/get@5.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 82, quality 100, supplyChain 99, vulnerability 100.
- `@types/node@24.19.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 96, quality 80, supplyChain 100, vulnerability 100.
- `debug@4.4.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 81, quality 100, supplyChain 99, vulnerability 100.
- `electron@45.2.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 97, quality 99, supplyChain 99, vulnerability 100.
- `env-paths@3.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 80, quality 99, supplyChain 100, vulnerability 100.
- `graceful-fs@4.2.11`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 79, quality 100, supplyChain 99, vulnerability 100.
- `ms@2.1.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 84, quality 86, supplyChain 100, vulnerability 100.
- `progress@2.0.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100.
- `semver@7.8.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 95, quality 100, supplyChain 100, vulnerability 100.
- `sumchecker@3.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 75, quality 98, supplyChain 99, vulnerability 100.
- `undici-types@7.24.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de npm salió vacía. license 100, maintenance 96, quality 74, supplyChain 100, vulnerability 100.
