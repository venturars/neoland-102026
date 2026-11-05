# Colección de Bruno para el cliente HTTP de usuarios

Esta colección prueba el cliente HTTP de `src/clients/api/` (puerto 3001) con las mismas reglas que su spec (`docs/specs/express-api/spec.md`): CRUD, errores y base de datos caída. No añade ningún paquete: Bruno es una herramienta externa.

## Antes de empezar

1. Instala Bruno desde su web oficial (usebruno.com).
2. En `first-app`, arranca el programa de la base de datos: `pnpm start`.
3. En otra terminal, arranca el cliente HTTP: `pnpm api`.

## Abrir la colección

1. En Bruno: **Open Collection** y elige esta carpeta (`src/clients/api/bruno/`).
2. Arriba a la derecha elige el entorno **local**. Define `baseUrl` como `http://127.0.0.1:3001`.

## Ejecutarla

Haz clic derecho en la colección y elige **Run**, o ejecuta las peticiones una a una. Ejecuta solo las carpetas `01 CRUD`, `02 Errors` y `03 Delete`, en ese orden. Cada petición tiene unas comprobaciones (assert) que tienen que salir en verde.

| Carpeta | Petición | Responde |
|---|---|---|
| 01 CRUD | Create user | 201 y el usuario Ady. Guarda su `id` en `userId` |
| 01 CRUD | List users | 200 y la lista, con Ady |
| 01 CRUD | Find user | 200 y Ady |
| 01 CRUD | Update user | 200 y el usuario con el nombre "Ada" |
| 02 Errors | Create without name | 400 "The request is not valid." |
| 02 Errors | Create with empty name | 400 "The name is missing." |
| 02 Errors | Create with bad email | 400 "The email is not valid." |
| 02 Errors | Create with repeated email | 409 "This email is already used." |
| 02 Errors | Update with nothing | 400 "There is nothing to update." |
| 02 Errors | Create with invalid JSON | 400 "The request is not valid." |
| 02 Errors | Find missing user | 404 "No user was found." |
| 02 Errors | Find id not a number | 404 "No user was found." |
| 02 Errors | Update missing user | 404 "No user was found." |
| 02 Errors | Delete missing user | 404 "No user was found." |
| 03 Delete | Delete user | 204 sin cuerpo |
| 03 Delete | Find deleted user | 404 "No user was found." |

`userId` solo lo pone **Create user**. Si te saltas esa petición, las que usan `{{userId}}` fallan: ejecuta siempre en orden.

## Base de datos caída (500)

La carpeta `04 SQL down` no se ejecuta con el resto, porque necesita el programa de la base de datos parado.

1. Para `pnpm start` (Ctrl+C en su terminal). Deja `pnpm api` en marcha.
2. En Bruno, envía **List users, database stopped**. Responde 500 `{ "error": "The database failed." }`.
3. Vuelve a arrancar `pnpm start`.

## Si algo falla

- **Bruno no conecta**: arranca `pnpm api`.
- **Todas responden 500**: arranca `pnpm start`.
- **Create user responde 409**: una ejecución anterior se cortó antes de **Delete user** y Ady sigue en la base de datos. Envía `GET http://127.0.0.1:3001/users`, mira el `id` de Ady y envía `DELETE http://127.0.0.1:3001/users/<id>`.
