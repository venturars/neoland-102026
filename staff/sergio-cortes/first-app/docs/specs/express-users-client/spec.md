Issue: #887.

# Cliente HTTP con Express para usuarios

first-app tiene un servicio de usuarios en `src/logic/`. Hace falta un cliente
nuevo que lo exponga por HTTP, con JSON, para que cualquier programa o `curl`
pueda listar, ver, crear, modificar y borrar usuarios.

Es un cliente nuevo. Hubo un servicio HTTP anterior en `src/clients/http/` que
se retiró en #843 («open user page without HTTP service»). Este no lo recupera.
El cliente web sigue llamando a `src/logic/` sin pasar por él.

Lo usa quien quiere probar o consumir los usuarios desde fuera de la app.

## Qué hace

El servidor escucha solo en `127.0.0.1`, puerto 3001, y escribe esa dirección en la consola al arrancar. Las peticiones y las respuestas son JSON.

| Ruta                | Qué hace            | Entrada           | Respuesta correcta         |
| ------------------- | ------------------- | ----------------- | -------------------------- |
| `GET /users`        | Lista los usuarios  | —                 | 200, la lista de usuarios  |
| `GET /users/:id`    | Ve un usuario       | —                 | 200, el usuario            |
| `POST /users`       | Crea un usuario     | `{ name, email }` | 201, el usuario creado     |
| `PATCH /users/:id`  | Modifica un usuario | `{ name, email }` | 200, el usuario modificado |
| `DELETE /users/:id` | Borra un usuario    | —                 | 200                        |

El usuario que sale lleva lo que ya devuelve cada función de `src/logic/`
(`id`, `name`, `email`, `createdAt`, `updatedAt`). El cuerpo exacto del borrado
es el que tenga `deleteUser`, que hoy no devuelve el usuario.

Ejemplo: `POST /users` con `{ "name": "Ana", "email": "ana@mail.com" }` responde
201 con el usuario nuevo. Repetir el mismo email responde 409
`{ "error": "Email is already used" }`.

## Fallos

Un fallo responde `{ "error": "<mensaje>" }`. Los mensajes son los de
`docs/ERRORS.md`, sin traducir. `Body is invalid` e `Internal error` son nuevos
y se añaden a ese fichero:

| Fallo                                       | Mensaje                       | Estado |
| ------------------------------------------- | ----------------------------- | ------ |
| El id de la URL no es un entero válido      | `Id is invalid`               | 400    |
| El nombre está vacío                        | `Name is empty`               | 400    |
| El email no vale                            | `Email is invalid`            | 400    |
| El email ya lo tiene otro usuario           | `Email is already used`       | 409    |
| No hay ese usuario                          | `User not found`              | 404    |
| La base no puede completar la operación     | `Could not ...` (el de logic) | 500    |
| El JSON está mal formado, o falta el cuerpo | `Body is invalid`             | 400    |
| Cualquier otro error del servidor           | `Internal error`              | 500    |

## Fuera de alcance

- Autenticación.
- Paginación.
- Búsqueda por nombre o por email.
- Cambios en `src/logic/`, `src/queries/` y `src/db/`.
- Un cliente `.txt` de terminal para este cliente (decisión de la persona).
- Recuperar el servicio HTTP retirado en #843 o cambiar el cliente web.

## Dependencias

Hace falta `express`. Su validación con Socket y su versión exacta están en
`plan.md`. No se instala nada hasta que una persona apruebe spec y plan y acepte
las alertas, si las hubo.
