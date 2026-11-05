# Tareas — página Swagger UI para consumir la API de usuarios

Issue: #1082.

Solo el paso 1 instala y cambia el paquete. Se ejecuta tras la aprobación de
«Paquetes»: spec y plan aprobados por la persona, y alertas aceptadas (ninguna
aplica a la versión que entra). Los demás pasos siguen al 1.

1. Abrir `first-app/package.json`. Añadir `@nestjs/swagger` con versión exacta
   `12.1.0` en `dependencies`, con `pnpm add --save-exact`. Resultado: `package.json`
   tiene `"@nestjs/swagger": "12.1.0"` y el lockfile lo recoge.

2. Abrir `pnpm-lock.yaml` y la salida de pnpm. Comprobar que solo entran los
   paquetes del plan (`js-yaml@5.5.0`, `es-toolkit@1.52.0`, `swagger-ui-dist@5.34.0`,
   `@microsoft/tsdoc@0.17.1`, `@nestjs/mapped-types@12.0.1`, `argparse@3.0.4`,
   `@scarf/scarf@1.4.0`). Resultado: `pnpm ls @nestjs/swagger` muestra `12.1.0`.

3. Confirmar que `pnpm-workspace.yaml` sigue igual: `allowBuilds` no incluye
   `@scarf/scarf`. Resultado: el fichero no cambia en git.

4. Abrir `src/clients/nest/main.js`. Añadir el import de `DocumentBuilder` y
   `SwaggerModule`, y el bloque que crea el documento y llama a
   `SwaggerModule.setup("docs", app, document)` antes de `listen`. Resultado:
   el fichero tiene ese bloque con `setTitle("Users")` y `setVersion("0.0.0")`.

5. Abrir `src/clients/nest/users.controller.js`. Al principio, añadir los
   esquemas `userSchema`, `messageSchema` y `createUserBodySchema` del plan.
   Resultado: el fichero compila con `pnpm run lint` sin errores nuevos.

6. En el mismo fichero, añadir `@ApiTags("users")` a la clase y los decoradores
   de `GET /users` y `GET /users/:id`, según la tabla del plan. Resultado: esas
   dos rutas tienen sus respuestas documentadas y las rutas no cambian.

7. En el mismo fichero, añadir los decoradores de `POST /users`, según la tabla
   del plan. Resultado: `POST` tiene `@ApiBody`, 201, 400, 409 y 500 documentados.

8. En el mismo fichero, añadir los decoradores de `PATCH /users/:id`, según la
   tabla del plan. Resultado: `PATCH` tiene `@ApiParam`, `@ApiBody` con nombre y
   email obligatorios, y sus respuestas 200, 400, 404, 409 y 500.

9. En el mismo fichero, añadir los decoradores de `DELETE /users/:id`, según la
   tabla del plan. Resultado: `DELETE` tiene `@ApiParam`, 204 sin cuerpo, 400,
   404 y 500.

10. Abrir `docs/ARCHITECTURE.md`. En la línea de `src/clients/nest/`, decir que
    la página sale en `/docs` y el documento en `/docs-json`. En la línea de
    `main.js`, decir que publica esa página. Resultado: el texto coincide con el
    plan y no se toca nada más.

11. Ejecutar `pnpm run format` y `pnpm run lint` desde `first-app`. Resultado:
    Prettier no cambia nada más y ESLint no da errores en `src/clients/nest/`.

12. Ejecutar `pnpm nest` desde `first-app`. Resultado: la terminal escribe
    `HTTP server listening on http://127.0.0.1:3003`.

13. Con el cliente en marcha, pedir `GET http://127.0.0.1:3003/docs`. Resultado:
    200 con HTML de Swagger UI.

14. Con el cliente en marcha, pedir `GET http://127.0.0.1:3003/docs-json`.
    Resultado: 200 con las cinco rutas de usuarios y sus respuestas documentadas.

15. Comprobar que las rutas no cambian: `GET /users` responde 200 con JSON;
    `GET /users/abc` responde 400 con `Id is invalid`; `GET /users/999` responde
    404 con `User not found`. Resultado: las tres respuestas son las de antes de la tarea.

16. La persona abre `http://127.0.0.1:3003/docs` en el navegador y repite el
    ejemplo de la spec: crear Ada, listar, ver, modificar con Ada Lovelace,
    borrar y volver a pedir el 1. Resultado: cada respuesta coincide con la
    spec, y los fallos muestran sus mensajes.
