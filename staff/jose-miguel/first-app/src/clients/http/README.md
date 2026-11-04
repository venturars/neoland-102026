# Cliente HTTP (Express)

CRUD de usuarios por HTTP. Las reglas están en `src/logic/`; hace falta la base SQL en marcha.

## Arranque

Desde `first-app`:

1. `pnpm server` — dejar abierto (`http://127.0.0.1:3000`).
2. `pnpm http` — en otra terminal (`http://127.0.0.1:3001`).

## Ejemplos

```bash
curl -s -X POST http://127.0.0.1:3001/users -H "Content-Type: application/json" -d "{\"name\":\"Ada\",\"email\":\"ada@example.com\"}"
curl -s http://127.0.0.1:3001/users
curl -s http://127.0.0.1:3001/users/1
curl -s -X PATCH http://127.0.0.1:3001/users/1 -H "Content-Type: application/json" -d "{\"name\":\"Ada Lovelace\"}"
curl -s -X DELETE http://127.0.0.1:3001/users/1
```

Errores: cuerpo JSON `{ "message": "..." }` con los textos de `docs/ERRORS.md`.
