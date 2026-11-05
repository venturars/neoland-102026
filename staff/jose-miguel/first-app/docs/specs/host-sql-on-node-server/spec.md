# Base de datos en un servidor

Issue: #779 (fase 1).

Quien usa una acción de la app llega a los mismos datos que antes. La base corre en un servidor Node. El texto de cada consulta sigue aparte. Quien llama espera la respuesta del servidor.

Lo usa quien prueba la app y quien llama a `logic/` desde JavaScript del navegador (`file://`).

Entra lo mismo que ya entra en cada acción. Sale lo mismo, con `createdAt` y `updatedAt`.

Si el dato de entrada es malo, se ven los mensajes de `docs/ERRORS.md` (`Name is empty`, `Email is invalid`, etc.).

Si no se llega a la base, se ven los mensajes `Could not …` de esa lista.

Queda fuera el cliente del navegador (fase 2 en `browser-user-client/`), acciones nuevas, mensajes nuevos y una API REST de usuarios.
