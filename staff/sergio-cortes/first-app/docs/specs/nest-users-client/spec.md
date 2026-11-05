Issue: #1036.

# Cliente HTTP con Nest.js para usuarios

first-app tiene un servicio de usuarios. Hace falta un cliente nuevo que lo
exponga por HTTP con Nest.js, con JSON, para que cualquier programa o `curl`
pueda listar, ver, crear, modificar y borrar usuarios.

Es un cliente nuevo. No sustituye al cliente HTTP con Express (puerto 3001) ni
a la API de Chrome (puerto 3002). Los tres quedan; las peticiones, los estados
de éxito y el JSON de fallo de Express y de Chrome se alinean con este.

Lo usa quien quiere probar o consumir los usuarios desde fuera de la app, por
HTTP, sin abrir el navegador, el escritorio, Chrome, VS Code ni Express.

## Qué hace

El servidor escucha solo en `127.0.0.1`, puerto 3003, y escribe esa dirección
en la consola al arrancar. Las peticiones y las respuestas son JSON.
JavaScript, sin TypeScript. Sigue la forma de Nest.

| Ruta                | Qué hace            | Entrada           | Respuesta correcta      |
| ------------------- | ------------------- | ----------------- | ----------------------- |
| `GET /users`        | Lista los usuarios  | —                 | 200, la lista           |
| `GET /users/:id`    | Ve un usuario       | —                 | 200, el usuario         |
| `POST /users`       | Crea un usuario     | `{ name, email }` | 201, el usuario creado  |
| `PATCH /users/:id`  | Modifica un usuario | `{ name, email }` | 200, el usuario         |
| `DELETE /users/:id` | Borra un usuario    | —                 | 204, sin cuerpo         |

El usuario que sale lleva id, name, email, createdAt y updatedAt. Al
modificar entran nombre y email; no se cambia uno solo. Al borrar no sale
usuario.

Ejemplo: `POST /users` con `{ "name": "Ana", "email": "ana@mail.com" }`
responde 201 con el usuario nuevo. Repetir el mismo email responde 409
`{ "message": "Email is already used" }`. Borrar a Ana responde 204 y ya no
sale en la lista.

Se arranca con `pnpm nest` desde first-app. Si el puerto 3000 está libre,
arranca la base; si ya está, la usa.

Express en 3001 y Chrome en 3002 responden igual: mismas cinco rutas, mismos
estados, mismo `{ "message": "<texto>" }`, DELETE 204 sin cuerpo.

## Fallos

Un fallo responde `{ "message": "<mensaje>" }`. Los mensajes son los de
Errores, sin traducir.

| Fallo                                       | Mensaje                       | Estado |
| ------------------------------------------- | ----------------------------- | ------ |
| El id de la URL no es un entero válido      | `Id is invalid`               | 400    |
| El nombre está vacío                        | `Name is empty`               | 400    |
| El email no vale                            | `Email is invalid`            | 400    |
| El email ya lo tiene otro usuario           | `Email is already used`       | 409    |
| No hay ese usuario                          | `User not found`              | 404    |
| La base no puede completar la operación     | `Could not ...` (el de esa acción) | 500 |
| El JSON está mal formado, o falta el cuerpo | `Body is invalid`             | 400    |
| Cualquier otro error de esa acción          | `Could not ...` (el de esa acción) | 500 |
| Una ruta que no existe                      | (sin cuerpo)                  | 404    |

## Fuera de alcance

- Autenticación.
- Paginación.
- Búsqueda por nombre o por email.
- TypeScript.
- Cambios en las reglas de usuarios, las consultas o la base.
- Un cliente `.txt` de terminal para este cliente.
- Cambiar el navegador, Electron, VS Code o Jupyter, salvo el JSON que el
  popup de Chrome lee de su API.
