# Cliente HTTP Nest

API Nest en `http://127.0.0.1:3003` con las mismas cinco rutas y códigos HTTP que el cliente Express (`pnpm http`). Importa `src/logic/` desde el servicio. Requiere `pnpm server` en el puerto 3000.

Abre esa URL en el navegador para usar **Swagger UI** y probar crear, listar, ver, modificar y borrar usuarios desde la documentación interactiva.

**Este cliente se aparta de** `docs/STYLE.md` **y de la forma de código de** `docs/ERRORS.md` (clases, decoradores, filtro Nest). El resto de first-app sigue esas guías.

## Arranque

Ver [`docs/STARTUP.md`](../../../docs/STARTUP.md).

1. `pnpm server` en la raíz de first-app.

2. Otra terminal:

   ```text
   pnpm nest
   ```

   Compila `src/` a `dist/` con Babel y arranca Nest. Debe mostrar `http://127.0.0.1:3003`.

3. Navegador: misma URL → Swagger UI.

4. Ejemplo con curl:

   ```text
   curl -s -X POST http://127.0.0.1:3003/users -H "Content-Type: application/json" -d "{\"name\":\"Ada\",\"email\":\"ada@example.com\"}"
   ```

## Spec

- `docs/specs/nest-http-client/` — API Nest (#1016)
- `docs/specs/nest-openapi-ui/` — Swagger UI (#1121)
