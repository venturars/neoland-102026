# Spec: Cliente API REST

Issue: #877.

## Qué queremos conseguir
Que quien usa first-app gestione los usuarios con peticiones HTTP a una API REST local, desde cualquier herramienta que haga peticiones. La API es un cliente más, como la terminal, Jupyter y el navegador: llama a las operaciones de `src/logic/` que ya existen y no cambia sus reglas ni sus mensajes.

## Cómo se usa
Desde `first-app/` se arranca la base (`pnpm db`) y, en otra terminal, la API. La API escucha en `http://127.0.0.1:3000`, solo en este equipo, y se para con Ctrl+C. Los cuerpos de las peticiones y de las respuestas van en JSON.

| Qué | Petición | Bien |
|---|---|---|
| Listar los usuarios | `GET /users` | 200 y la lista, por id |
| Buscar por nombre exacto | `GET /users?name=<nombre>` | 200 y la lista de los que se llaman así (vacía si no hay ninguno) |
| Buscar por email | `GET /users/email/<email>` | 200 y el usuario |
| Crear | `POST /users` con `{ "name", "email" }` | 201 y el usuario creado |
| Modificar | `PATCH /users/<id>` con `{ "name" }`, `{ "email" }` o los dos | 200 y el usuario ya modificado. Un campo que no se envía, o que va vacío, no cambia |
| Borrar | `DELETE /users/<id>` | 200 y `{ "id" }` |
| Clasificar por género | `GET /users/genders` | 200 y `{ "men", "women", "undefinedGender" }`. Necesita Ollama en marcha |

Un usuario sale con los mismos campos que en la terminal: `id`, `name`, `email`, `createdAt` y `updatedAt`.

## Errores
Un error responde con `{ "error": "<mensaje>" }`. El mensaje es el mismo que en la terminal, de [ERRORS.md](../../ERRORS.md). El código HTTP dice qué tipo de fallo es:

| Fallo | Código |
|---|---|
| Un dato que falta o no vale: nombre o email que faltan, email inválido, id no válido, o modificar sin nombre ni email | 400 |
| El usuario no existe | 404 |
| El email ya es de otro usuario | 409 |
| Ollama no responde al clasificar | 502 |
| La base no está arrancada | 503 |
| Una ruta o un método que no existe | 404 y `Not found.` |
| Un cuerpo que no es JSON | 400 y `Invalid request.` |

## Ejemplo
Guardados: Carlos (`carlos.martin@gmail.com`, id 30).
- `POST /users` con `{ "name": "Ana", "email": "Ana@Mail.com " }` da 201 y Ana con `ana@mail.com`.
- `POST /users` con `{ "name": "Otra", "email": "carlos.martin@gmail.com" }` da 409 y `{ "error": "Email already exists: carlos.martin@gmail.com" }`.
- `PATCH /users/30` con `{ "name": "Carlos M." }` da 200 y Carlos con el nombre nuevo y el mismo email.
- `DELETE /users/999999` da 404 y `{ "error": "User not found: id 999999" }`.
- Con la base parada, `GET /users` da 503 y `{ "error": "Database is not running. Start it with pnpm db." }`.

## Fuera de alcance
- Autenticación o cualquier tipo de inicio de sesión.
- Operaciones nuevas, como buscar por id, o cambiar las reglas y los mensajes de `logic/`.
- Llamar a la API desde una página web.
- Cambiar los otros clientes, `src/logic/`, `src/queries/`, `src/db/` o la tabla.
