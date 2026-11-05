# Cliente HTTP Nest

API Nest en `http://127.0.0.1:3003` con las mismas cinco rutas y códigos HTTP que el cliente Express (`pnpm http`). Importa `src/logic/` desde el servicio. Requiere `pnpm server` en el puerto 3000.

**Este cliente se aparta de** `docs/STYLE.md` **y de la forma de código de** `docs/ERRORS.md` (clases, decoradores, filtro Nest). El resto de first-app sigue esas guías.

## Arranque

Ver [`docs/STARTUP.md`](../../../docs/STARTUP.md).

1. `pnpm server` en la raíz de first-app.

2. Otra terminal:

   ```text
   pnpm nest
   ```

   Compila `src/` a `dist/` con Babel y arranca Nest. Debe mostrar `http://127.0.0.1:3003`.

3. Ejemplo:

   ```text
   curl -s -X POST http://127.0.0.1:3003/users -H "Content-Type: application/json" -d "{\"name\":\"Ada\",\"email\":\"ada@example.com\"}"
   ```

## Spec

- `docs/specs/nest-http-client/`
- Issue: [#1016](https://github.com/venturars/neoland-102026/issues/1016)
