Issue: #1105.

# Cliente HTTP con node:http para usuarios

first-app guarda usuarios y ya tiene reglas para crearlos, verlos, cambiarlos y borrarlos. Hace falta un cliente nuevo que los exponga por HTTP usando solo el módulo HTTP que trae Node, sin frameworks. Así se puede comparar cómo se usa la misma lógica desde otra forma de servir HTTP. Su API se documenta con un cuaderno de Jupyter.

## Qué se pide

Un cliente nuevo que atiende las mismas cinco operaciones que el cliente HTTP con Express, con el mismo contrato: las mismas rutas, los mismos estados y el mismo cuerpo de respuesta. Quien llame a los dos clientes no nota diferencia en esas cinco.

Además, este cliente tiene una sexta ruta que el cliente Express no tiene: el conteo de usuarios por género (`GET /users/gender-count`). Usa la misma lógica que `src/logic/user-gender-count.js` y necesita Ollama en marcha.

Además, un cuaderno de Jupyter por cada operación de la API de este cliente. Cada uno muestra la petición, la respuesta real y los fallos que puede dar.

## Quién lo usa

- Quien quiere probar o consumir los usuarios desde fuera de la app, con `curl` o con un programa.
- Quien lee los cuadernos para saber cómo llamar a la API.

## Qué entra

| Ruta                | Qué hace            | Entrada           | Respuesta correcta         |
| ------------------- | ------------------- | ----------------- | -------------------------- |
| `GET /users`        | Lista los usuarios  | —                 | 200, la lista de usuarios  |
| `GET /users/:id`    | Ve un usuario       | —                 | 200, el usuario            |
| `POST /users`       | Crea un usuario     | `{ name, email }` | 201, el usuario creado     |
| `PATCH /users/:id`  | Modifica un usuario | `{ name, email }` | 200, el usuario modificado |
| `DELETE /users/:id` | Borra un usuario    | —                 | 204, sin cuerpo            |
| `GET /users/gender-count` | Cuenta usuarios por género | —        | 200, `{ woman, man, genderUndefined }` |

El conteo por género clasifica los nombres de los usuarios con Ollama en `http://127.0.0.1:11434`, con el modelo `llama3.2`. Si no hay usuarios, responde `{ "woman": 0, "man": 0, "genderUndefined": 0 }` sin llamar a Ollama. Si el modelo no clasifica un nombre, ese usuario cuenta como `genderUndefined`.

El servidor escucha solo en este equipo, en el puerto 3004, y escribe esa dirección en la consola al arrancar. Las peticiones con cuerpo y las respuestas son JSON.

El usuario que sale lleva `id`, `name`, `email`, `createdAt` y `updatedAt`.

Ejemplo: `POST /users` con `{ "name": "Ana", "email": "ana@mail.com" }` responde 201 con el usuario nuevo. Repetir el mismo email responde 409 con `{ "message": "Email is already used" }`.

Una ruta que no existe, o un método que esa ruta no admite, responde 404 sin cuerpo.

## Cuadernos de Jupyter

Hay un cuaderno por cada una de las seis rutas. Cada uno tiene, en este orden: título, qué hace la operación, qué pasa en la base de datos, qué petición hace, qué fallos puede dar y la respuesta ya ejecutada. La respuesta se ve en una tabla de colores, como en la terminal. Si la operación no devuelve cuerpo (el borrado), se ve solo el estado.

Se ejecutan con la base y este cliente en marcha, sin errores, en el orden crear, listar, ver, modificar, borrar y contar. El cuaderno de conteo necesita Ollama en marcha.

## Fallos

Un fallo responde con `{ "message": "<texto>" }`. El texto es el de la lista de «Errores», sin traducir.

| Fallo                                                    | Mensaje                 | Estado |
| -------------------------------------------------------- | ----------------------- | ------ |
| El id de la URL no es un entero válido                   | `Id is invalid`         | 400    |
| El nombre está vacío                                     | `Name is empty`         | 400    |
| El email no vale                                         | `Email is invalid`      | 400    |
| El email ya lo tiene otro usuario                        | `Email is already used` | 409    |
| No hay ese usuario                                       | `User not found`        | 404    |
| El cuerpo está mal formado, falta, o no es un objeto     | `Body is invalid`       | 400    |
| Ollama no responde al conteo por género                  | `Could not classify the users` | 500    |
| La base no puede completar la operación                  | `Could not ...`         | 500    |

## Fuera de alcance

- Autenticación.
- Paginación.
- Búsqueda por nombre o por email.
- Cambios en la lógica de usuarios, en la base de datos o en los demás clientes.
- Añadir el conteo por género a los clientes que ya existen.
- Un cliente de terminal para este cliente.
- Recuperar clientes HTTP anteriores.

## Dependencias

Ninguna. El módulo HTTP viene con Node. No se instala ningún paquete nuevo.

Para la ruta de conteo: Ollama en `127.0.0.1:11434` con el modelo `llama3.2` descargado. El paquete `openai` ya está en `package.json` por la lógica de conteo.
