# Plan — cliente REST de usuarios

Issue: #838.

No es una funcionalidad nueva. No se reemplaza ningún fichero de
`logic/`. No hay firma nueva. No hay SQL nuevo. No hay mensaje nuevo.

Hay un paquete nuevo: `express@5.3.0`. Entra Socket. El árbol de abajo
es el que resuelve npm para esa versión y sus rangos, hasta 3 capas.
Son 54 paquetes, sin repetir versión. Aún no está instalado. Si `pnpm`
resuelve otra versión dentro de un rango, esa versión no es la de este
resumen y hay que volver a pasarla por Socket.

El cliente importa las funciones que ya existen y devuelve su
resultado. Se parece a los clientes de `src/clients/terminal/`: la
llamada está en el cliente y la regla sigue en `logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`.
Ver uno usa `findUserById(id)`. Modificar usa `updateUser(id, changes)`.
Borrar usa `deleteUser(id)`. El `id` es el texto de la ruta. No se
importa `users-gender-count.js`, `find-user-by-name.js` ni
`find-user-by-email.js`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se
arranca con el comando que ya existe. Este cliente escucha en
`http://127.0.0.1:3001`. La constante es `ORIGIN`. `package.json` tiene
el script `http`. Se lanza con `pnpm http` desde `first-app`.

Express lee el cuerpo JSON. Crear y modificar leen `name` y `email`.
Si un campo no viene, no entra en `changes`, y `updateUser` conserva
el valor guardado. El cliente no valida. Si lo lanzado no es un
`Error` con un mensaje de la lista, responde 500 con el `Could not`
de esa acción. No inventa un mensaje.

Las rutas:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` modifica. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Otra ruta responde 404 y un cuerpo vacío. No hay mensaje nuevo.

Si la función lanza un `Error` de la lista, el cuerpo es JSON con la
clave `message` y ese texto.

## Ficheros

Se crean:

- `src/clients/http/app.js`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`

`package.json` añade `express@5.3.0` y el script `http`. El script
`format` también incluye `src/clients/http/**/*.js`.

En el árbol, `clients/` incluye `http/app.js`. En la arquitectura, ese
cliente llama a `src/logic/`, escucha en el puerto 3001 y no repite
sus reglas. No sustituye a `src/db/server.js`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                  | Mensaje                     | Estado |
| --------------------------------- | --------------------------- | ------ |
| El nombre queda vacío             | `Name is empty`             | 400    |
| El email no vale                  | `Email is invalid`          | 400    |
| El email es de otro usuario       | `Email is already used`     | 409    |
| El usuario no está                | `User not found`            | 404    |
| No se llega a la base al crear    | `Could not create the user` | 500    |
| No se llega al listar             | `Could not list the users`  | 500    |
| No se llega al ver uno            | `Could not find the user`   | 500    |
| No se llega al modificar          | `Could not update the user` | 500    |
| No se llega al borrar             | `Could not delete the user` | 500    |

## Socket

`threat_feed` para `express@5.3.0` respondió 403
`threat_feed_not_entitled`. La cuenta no tiene threat feed. No hay
dato de campaña por versión. En cada paquete, la campaña es esa.

`depscore` dio las cinco stats. Ninguna está por debajo de 50. La más
baja es maintenance 50, en `safer-buffer@2.1.2`. 50 no baja.

La lista de alertas npm abiertas de `ai-engineering` no está vacía.
Se leyeron las primeras 500 y la lista sigue. En esas 500, los
paquetes de este árbol que aparecen lo hacen en versiones distintas
de las que fija este plan:

- `proxy-addr@2.0.7`: alerta crítica `CVE-2026-90711`. El parche es
  `2.0.8`. Este plan fija `proxy-addr@2.0.8`. La alerta no nombra esa
  versión.
- `path-to-regexp@6.1.0`: alerta alta `CVE-2024-45296`. La línea de
  parche llega a `8.0.0`. `path-to-regexp@0.1.12`: alerta alta
  `CVE-2026-4867`, parche `0.1.13`. Este plan fija
  `path-to-regexp@8.4.2`. Ninguna de las dos nombra esa versión.
- `body-parser@1.20.3`: alerta alta `CVE-2026-111181`, parche `2.4.0`
  y `1.20.9`, y alerta baja `CVE-2026-12590`, parche `2.3.0` y
  `1.20.6`. Este plan fija `body-parser@2.4.0`. Ninguna nombra esa
  versión.
- `qs@6.13.0` y `qs@6.14.0`: alertas medias y bajas `CVE-2026-82417`
  (parche `6.16.0`), `CVE-2026-110816` (parche `6.16.1`),
  `CVE-2026-8723` (parche `6.15.2`), `CVE-2025-15284` (parche
  `6.14.1`) y `CVE-2026-2391` (parche `6.14.2`). Este plan fija
  `qs@6.17.1`. Ninguna nombra esa versión.

Quien acepta el plan decide si esas alertas, en esas otras versiones,
se aceptan.

`alerts` filtrado por nombre, con la lista completa vacía, no dice que
esa versión no tenga alerta. Pasó en `accepts`, `content-disposition`,
`content-type`, `debug`, `depd`, `escape-html`, `express`, `fresh` y
`http-errors`.

`alerts` no contestó en `cookie`, `cookie-signature`, `encodeurl`,
`etag`, `finalhandler` y `merge-descriptors`: la llamada fue rechazada
antes de ejecutarse.

En el resto, el paquete no salió en las primeras 500 alertas. La lista
sigue, así que eso tampoco dice que la versión no tenga alerta.

- `accepts@2.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `body-parser@2.4.0`. Campaña: la cuenta no tiene threat feed. Alerta: las abiertas nombran `1.20.3`, no esta versión. license 100, maintenance 93, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `bytes@3.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 81, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `content-disposition@2.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `content-type@2.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 88, quality 90, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `cookie@0.7.2`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada no contestó. license 100, maintenance 85, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `cookie-signature@1.2.2`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada no contestó. license 100, maintenance 82, quality 69, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `debug@4.4.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 81, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `depd@2.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 75, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `ee-first@1.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 92, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `encodeurl@2.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada no contestó. license 100, maintenance 90, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `es-define-property@1.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 53, quality 81, supplyChain 66, vulnerability 100. Ninguna stat por debajo de 50.
- `es-errors@1.3.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 79, quality 84, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `escape-html@1.0.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 75, quality 78, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `etag@1.8.1`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada no contestó. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `express@5.3.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 92, quality 100, supplyChain 97, vulnerability 100. Ninguna stat por debajo de 50.
- `finalhandler@2.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada no contestó. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `forwarded@0.2.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 83, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fresh@2.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 83, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `http-errors@2.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `iconv-lite@0.7.3`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `inherits@2.0.4`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 76, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ipaddr.js@1.9.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `is-promise@4.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 66, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `media-typer@1.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 84, quality 98, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `merge-descriptors@2.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada no contestó. license 100, maintenance 79, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `mime-db@1.54.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `mime-types@3.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ms@2.1.3`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 84, quality 86, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `negotiator@1.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `object-inspect@1.13.4`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 81, quality 96, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `on-finished@2.4.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `once@1.4.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 91, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `parseurl@1.3.3`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `path-to-regexp@8.4.2`. Campaña: la cuenta no tiene threat feed. Alerta: las abiertas nombran `6.1.0` y `0.1.12`, no esta versión. license 100, maintenance 91, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `proxy-addr@2.0.8`. Campaña: la cuenta no tiene threat feed. Alerta: la abierta nombra `2.0.7`, no esta versión. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `qs@6.17.1`. Campaña: la cuenta no tiene threat feed. Alerta: las abiertas nombran `6.13.0` y `6.14.0`, no esta versión. license 100, maintenance 97, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `range-parser@1.3.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 85, quality 95, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `raw-body@3.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 86, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `router@2.2.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `safer-buffer@2.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 50, quality 100, supplyChain 67, vulnerability 100. Ninguna stat por debajo de 50.
- `send@1.2.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 85, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `serve-static@2.2.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 84, quality 99, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `setprototypeof@1.2.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 73, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `side-channel@1.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 53, quality 87, supplyChain 66, vulnerability 100. Ninguna stat por debajo de 50.
- `side-channel-list@1.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 80, quality 88, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `side-channel-map@1.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 79, quality 87, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `side-channel-weakmap@1.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 79, quality 87, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `statuses@2.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 83, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `toidentifier@1.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 83, quality 82, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `type-is@2.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 87, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `unpipe@1.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 78, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `vary@1.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `wrappy@1.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500. license 100, maintenance 75, quality 73, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
