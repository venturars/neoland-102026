# Cliente HTTP Nest (JavaScript)

Issue: #1016.

Como quien prueba la app, quiero las mismas cinco operaciones de usuarios por HTTP en un cliente Nest sin TypeScript, para tener otra API al lado de Express y Chrome sin repetir reglas en el cliente.

El cliente escucha en `http://127.0.0.1:3003` (`pnpm nest`). Llama a `src/logic/` y devuelve el mismo JSON y los mismos códigos HTTP que el cliente Express del puerto 3001. No valida de más: los mensajes visibles son los que ya lanza la logic.

POST `/users` crea (201). GET `/users` lista (200). GET `/users/:id` ve uno (200). PATCH `/users/:id` modifica (200). DELETE `/users/:id` borra (204, cuerpo vacío). Otra ruta responde 404 y cuerpo vacío.

Los fallos visibles son los de siempre: `Name is empty`, `Email is invalid` (400), `Email is already used` (409), `User not found` (404), y los `Could not …` (500) según la acción.

Este cliente usa convenciones Nest (módulo, controlador, servicio, filtro, decoradores, clases). **Se aparta de** `docs/STYLE.md` **y de la forma de código de** `docs/ERRORS.md`; esas guías no se reescriben y el resto de clientes no cambia de estilo.

Queda fuera TypeScript, contraseña, auth, permisos, contar por género, búsquedas extra, reglas o mensajes nuevos, tocar `logic/`, `queries/`, `db/` o modificar clientes existentes salvo entradas de documentación de arranque.
