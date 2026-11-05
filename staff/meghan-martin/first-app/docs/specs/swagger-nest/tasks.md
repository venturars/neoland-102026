# Tareas — página Swagger del cliente Nest

Estas tareas esperan a que se lean la spec y el plan. Hasta entonces no se instala el paquete ni se cambia `package.json`.

1. Abre `package.json`.
   Añade `@nestjs/swagger` en `12.1.0`, versión exacta.
   El script `nest` no cambia.

2. Desde `first-app`, instala con npm esa versión exacta.
   `package-lock.json` cambia.
   `@nestjs/swagger` queda en `12.1.0`.
   Si una dependencia del plan sale con otra versión, se para y esa versión vuelve a Socket.

3. Abre `src/clients/nest/main.js`.
   Importa `DocumentBuilder` y `SwaggerModule` de `@nestjs/swagger`.
   Tras crear la app, configura el documento con el título `Users Neoland` y la versión `0.0.0`, y monta la página en la raíz.
   `ORIGIN` y el `console.log` al arrancar siguen igual.

4. Abre `src/clients/nest/users.controller.js`.
   En crear, añade `@ApiBody` con `name` y `email` obligatorios y los ejemplos `Ada` y `ada@example.com`.
   En cambiar, añade `@ApiBody` con esos dos campos y los ejemplos `Ada Lovelace` y `ada@example.com`.
   En ver, cambiar y borrar, añade `@ApiParam` para el id, con el ejemplo `1`.

5. Abre `docs/ARCHITECTURE.md`, `docs/CONSTITUTIONS.md`, `README.md` y `AGENTS.md`.
   Dicen que el cliente Nest también tiene la página en `http://127.0.0.1:3003`.
   `docs/TREE.md` nombra `docs/specs/swagger-nest/`.
   `docs/STYLE.md` y `docs/ERRORS.md` no se tocan.

6. Arranca `npm run db` y `npm run nest` desde `first-app`.
   Abre `http://127.0.0.1:3003`.
   Comprueba las cinco acciones y un nombre vacío, como en la issue.

7. Desde `first-app`, lanza `npm run format` y `npm run lint`.
   Ambos terminan sin error.
