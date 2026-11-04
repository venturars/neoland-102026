# Plan — cliente REST de usuarios

Issue: #879.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma nueva ni SQL nuevo. No se añade un `.txt` en `src/clients/terminal/`.

Hay un paquete nuevo: `express@5.3.0`. El resumen de Socket está más abajo. Aún no está instalado. El árbol es el que resolvió npm para esa versión y sus rangos, hasta 3 capas. Son 54 paquetes, sin repetir versión. Si `pnpm` resuelve otra versión dentro de un rango, esa versión no es la de este resumen y hay que volver a pasarla por Socket.

El cliente importa las funciones que ya existen y devuelve su resultado. Se parece a los clientes de `src/clients/terminal/`: la llamada está en el cliente y la regla sigue en `src/logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`. Ver uno usa `findUserById(id)`. Modificar usa `updateUser(id, changes)`. Borrar usa `deleteUser(id)`. No se importa `users-gender-count.js`, `find-user-by-name.js` ni `find-user-by-email.js`.

`validateId` rechaza un texto: el fallo es `Invalid id`. El id de la ruta es texto. El cliente lo pasa a número con `Number` antes de llamar. No lanza su propio mensaje. `Number("1")` es `1`. `Number("abc")` es `NaN` y `validateId` lanza `Invalid id`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se arranca con `pnpm server`. Este cliente escucha en `http://127.0.0.1:3001`. La constante es `ORIGIN`. `package.json` tiene el script `http`. Se lanza con `pnpm http` desde `first-app`. Al arrancar escribe esa dirección.

Express lee el cuerpo JSON. Crear y modificar leen `name` y `email`. Si un campo no viene, no entra en `changes`, y `updateUser` conserva el valor guardado. El cliente no valida el nombre ni el email. Si lo lanzado no es un `Error` con un mensaje de la tabla de abajo, responde 500 con el `Could not` de esa acción. No inventa un mensaje.

Las rutas:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista. Si no hay usuarios, la lista es `[]`.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` modifica. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Otra ruta responde 404 y un cuerpo vacío. No hay mensaje nuevo.

Si la función lanza un `Error` con un mensaje de la tabla de abajo, el cuerpo es JSON con la clave `message` y ese texto.

## Ficheros

Se crean:

- `src/clients/http/app.js`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`
- `docs/errors.md`

`package.json` añade `express` en `5.3.0` y el script `http`. El script `format` sigue siendo `prettier --write .`. No se cambia su glob.

`docs/tree.md` añade `http/app.js` dentro de `clients/`.

`docs/ARCHITECTURE.md` deja de decir que no hay `src/clients/http/`. Ese cliente llama a `src/logic/`, escucha en el puerto 3001 y no repite sus reglas. No sustituye a `src/db/server.js`.

`docs/style.md` añade el comando `pnpm http`.

`docs/CONSTITUTIONS.md` dice, en la sección 1, que también se crea, se lista, se ve, se cambia y se borra un usuario por HTTP, en el puerto 3001, y que la base sigue en el puerto 3000. En la sección 7 dice que este cambio añade el cliente HTTP y no añade un `.txt`. `AGENTS.md` no cambia: el `.txt` sigue siendo el cliente de una funcionalidad nueva, y esta no lo es.

`docs/errors.md` añade `Could not create the user`, `Could not list the users`, `Could not update the user` y `Could not delete the user`. `Could not find the user` también cubre no llegar a la base al ver un usuario.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, la terminal, Jupyter ni `src/clients/web/`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                          | Mensaje                     | Estado |
| ----------------------------------------- | --------------------------- | ------ |
| El nombre queda vacío                     | `Name is empty`             | 400    |
| El email no vale                          | `Email is invalid`          | 400    |
| El email es el de otro usuario            | `Email is already used`     | 409    |
| El id no es un entero mayor o igual que 1 | `Invalid id`                | 400    |
| Ese usuario no está                       | `User not found`            | 404    |
| No se llega a la base al crear            | `Could not create the user` | 500    |
| No se llega al listar                     | `Could not list the users`  | 500    |
| No se llega al ver uno                    | `Could not find the user`   | 500    |
| No se llega al modificar                  | `Could not update the user` | 500    |
| No se llega al borrar                     | `Could not delete the user` | 500    |

La lista vacía no es un fallo.

## Socket

Tres datos. Cada uno dice de dónde sale.

Las stats salen de `depscore`, con la versión exacta. Ninguna está por debajo de 50. La más baja es maintenance 50, en `safer-buffer@2.1.2`. 50 no baja.

La alerta sale de `alerts`, con `org_slug` `socket-dev-neoland`, que es el que devolvió `organizations`. Se pidió la lista abierta, sin filtrar por paquete. `items` llegó vacío y `endCursor` llegó nulo. La misma lista vacía salió al filtrar por `npm`. Una lista vacía es la lista de la organización. No dice que estas versiones no tengan alerta.

La campaña sale de `threat_feed` para `express@5.3.0`, con ese mismo `org_slug`. Respondió 403 `threat_feed_not_entitled`: la organización no tiene threat feed. No hay dato de campaña. El rechazo es de la organización, así que tampoco hay dato de campaña para el resto del árbol.

El camino es el 2. Los cinco mensajes entran en `docs/errors.md` y en la spec. El resumen de Socket queda aceptado. Se sigue con `express@5.3.0`.

- `accepts@2.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100.
- `body-parser@2.4.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 93, quality 100, supplyChain 99, vulnerability 100.
- `bytes@3.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 99, supplyChain 100, vulnerability 100.
- `content-disposition@2.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100.
- `content-type@2.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 90, supplyChain 100, vulnerability 100.
- `cookie@0.7.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 85, quality 99, supplyChain 100, vulnerability 100.
- `cookie-signature@1.2.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 82, quality 69, supplyChain 100, vulnerability 100.
- `debug@4.4.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 100, supplyChain 99, vulnerability 100.
- `depd@2.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 100, supplyChain 99, vulnerability 100.
- `ee-first@1.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 92, supplyChain 100, vulnerability 100.
- `encodeurl@2.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 99, supplyChain 100, vulnerability 100.
- `es-define-property@1.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 53, quality 81, supplyChain 66, vulnerability 100.
- `es-errors@1.3.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 84, supplyChain 100, vulnerability 100.
- `escape-html@1.0.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 78, supplyChain 100, vulnerability 100.
- `etag@1.8.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100.
- `express@5.3.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 92, quality 100, supplyChain 97, vulnerability 100.
- `finalhandler@2.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100.
- `forwarded@0.2.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 83, supplyChain 100, vulnerability 100.
- `fresh@2.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 99, supplyChain 100, vulnerability 100.
- `http-errors@2.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100.
- `iconv-lite@0.7.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100.
- `inherits@2.0.4`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 76, supplyChain 100, vulnerability 100.
- `ipaddr.js@1.9.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100.
- `is-promise@4.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 66, supplyChain 100, vulnerability 100.
- `media-typer@1.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 98, supplyChain 100, vulnerability 100.
- `merge-descriptors@2.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 80, supplyChain 100, vulnerability 100.
- `mime-db@1.54.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100.
- `mime-types@3.0.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100.
- `ms@2.1.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 86, supplyChain 100, vulnerability 100.
- `negotiator@1.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100.
- `object-inspect@1.13.4`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 80, quality 96, supplyChain 99, vulnerability 100.
- `on-finished@2.4.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100.
- `once@1.4.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 91, supplyChain 100, vulnerability 100.
- `parseurl@1.3.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100.
- `path-to-regexp@8.4.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 91, quality 100, supplyChain 100, vulnerability 100.
- `proxy-addr@2.0.8`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100.
- `qs@6.17.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 97, quality 100, supplyChain 99, vulnerability 100.
- `range-parser@1.3.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 85, quality 95, supplyChain 100, vulnerability 100.
- `raw-body@3.0.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 86, quality 100, supplyChain 99, vulnerability 100.
- `router@2.2.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100.
- `safer-buffer@2.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 50, quality 100, supplyChain 67, vulnerability 100.
- `send@1.2.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 85, quality 100, supplyChain 99, vulnerability 100.
- `serve-static@2.2.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 99, supplyChain 99, vulnerability 100.
- `setprototypeof@1.2.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 73, supplyChain 100, vulnerability 100.
- `side-channel@1.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 53, quality 87, supplyChain 66, vulnerability 100.
- `side-channel-list@1.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 80, quality 88, supplyChain 99, vulnerability 100.
- `side-channel-map@1.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 87, supplyChain 99, vulnerability 100.
- `side-channel-weakmap@1.0.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 87, supplyChain 99, vulnerability 100.
- `statuses@2.0.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 99, supplyChain 100, vulnerability 100.
- `toidentifier@1.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 82, supplyChain 100, vulnerability 100.
- `type-is@2.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 100, supplyChain 99, vulnerability 100.
- `unpipe@1.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 78, supplyChain 100, vulnerability 100.
- `vary@1.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100.
- `wrappy@1.0.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 73, supplyChain 100, vulnerability 100.
