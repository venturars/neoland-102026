# Cliente de Chrome para usuarios

Issue: #973.

## Qué se pide

Quien usa first-app elige quién es en una lista, sin contraseña, para ver sus opciones y cambiar o borrar ese usuario desde una extensión de Chrome.

El flujo y el aspecto son los del cliente de navegador, en el popup de la acción. Las tres pantallas, los textos visibles y el comportamiento son los mismos. La interfaz usa tonos crema y cyan/teal, legible y sobria.

En la primera pantalla entra la lista de usuarios ya guardados. Cada uno se ve con su id, su nombre y su email en un desplegable. Se elige uno por su id y se continúa. No se escribe una contraseña.

En la segunda sale el resumen de ese usuario. Las acciones principales van en una fila horizontal: modificar usuario e ir a notas. Ir a notas se ve deshabilitado, con un tooltip que explica que aún no está disponible, y no abre otra pantalla. Volver a la selección va en un bloque aparte, ancho completo, claramente secundario.

Modificar abre la tercera pantalla. Se cambia el nombre y el email, o se borra el usuario. Volver sin guardar deja los datos como estaban. Al pedir borrar, aparece un popover sobre la pantalla con el texto de confirmación y las opciones confirmar o cancelar. Cancelar cierra el popover y no quita al usuario. La tecla Escape y pulsar fuera del popover cierran el popover sin borrar. Tras un borrado confirmado, se vuelve a la pantalla de selección y la lista se actualiza sin ese usuario.

El popup no crea usuarios.

La extensión no habla con el cliente HTTP de Express ni con la base. Habla con una API Fastify en este equipo, `http://127.0.0.1:3002`. Declara permiso de host a esa dirección. Fastify no añade CORS extra. Las peticiones y las respuestas son JSON.

| Ruta                | Qué hace            | Entrada           | Respuesta correcta         |
| ------------------- | ------------------- | ----------------- | -------------------------- |
| `GET /users`        | Lista los usuarios  | —                 | 200, la lista de usuarios  |
| `GET /users/:id`    | Ve un usuario       | —                 | 200, el usuario            |
| `POST /users`       | Crea un usuario     | `{ name, email }` | 201, el usuario creado     |
| `PATCH /users/:id`  | Modifica un usuario | `{ name, email }` | 200, el usuario modificado |
| `DELETE /users/:id` | Borra un usuario    | —                 | 200                        |

El usuario que sale lleva lo que ya devuelve cada función de usuarios (`id`, `name`, `email`, `createdAt`, `updatedAt`). Fastify sí crea usuarios; el popup, por ahora, no.

Se abre desde first-app. Si la base no está en marcha, este arranque la pone en marcha. Si ya está, la usa. Luego queda Fastify en el puerto 3002. Express en el 3001 sigue igual.

La extensión se carga en Chrome sin empaquetar.

## Quién lo usa

Quien ya tiene usuarios guardados y quiere elegir uno y gestionarlo desde Chrome, sin el navegador de la app, el escritorio, la terminal ni Express.

## Entrada

La misma que ya usan listar, buscar por id, actualizar y borrar: la lista de usuarios guardados y, al elegir uno, su id; en la edición, nombre y email. Crear, desde Fastify, entra nombre y email.

## Salida

El mismo resultado que esas funcionalidades ya devuelven. En el popup, la lista de selección muestra id, nombre y email por usuario. En Fastify, el cuerpo es JSON.

Ejemplo. Están Ada, ada@example.com, con id 1, y Grace, grace@example.com, con id 2. Se pulsa el icono de la extensión. Se elige el id 1. Se cambia el nombre a Ada Lovelace y el email a ada.lovelace@example.com. Al volver a la lista, el id 1 se ve con esos datos. Grace sigue igual. Esos datos siguen ahí al abrir el popup otra vez.

Si se borra el id 1 y se confirma en el popover, la lista solo muestra a Grace. Si se cancela el borrado, Ada sigue.

`POST /users` con `{ "name": "Ana", "email": "ana@mail.com" }` responde 201 con el usuario nuevo. Ese usuario sale en la lista del popup. Repetir el mismo email responde 409 `{ "error": "Email is already used" }`.

## Fallo

Si el nombre queda vacío, el fallo es `Name is empty`.

Si el email no vale, el fallo es `Email is invalid`.

Si el email es el de otro usuario, el fallo es `Email is already used`.

Si el id no es un entero mayor o igual que 1, el fallo es `Id is invalid`.

Si ese usuario ya no está, el fallo es `User not found`.

Si no hay usuarios, se ve que la lista está vacía. No es un fallo.

Un fallo de Fastify responde `{ "error": "<mensaje>" }`. Los mensajes son los de Errores, sin traducir. `Body is invalid` e `Internal error` son los mismos que ya usa el cliente HTTP con Express:

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

## Fuera

Publicar o empaquetar la extensión para la Chrome Web Store. Crear un usuario desde el popup (se agregará luego). Pedir contraseña. La pantalla de notas. Contar usuarios según el sexo del nombre. Autenticación, paginación, búsqueda por nombre o por email. Cambiar lo que ya se puede hacer desde la terminal, Jupyter, el navegador, el escritorio, el cliente HTTP con Express o en las reglas de usuarios.
