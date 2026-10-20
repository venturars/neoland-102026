# Plan — buscar una persona por número

Cumple `docs/specs/buscar-por-id/spec.md`. Aquí el encaje en first-app.

## Reutilizar
- `parseId` y `toUser` en `logic/user-fields.js`.
- `findById` en `queries/users.js` (update y delete ya lo usan).

## Nuevo
- `findUserById(id)` en `logic/find-user-by-id.js` (fichero nuevo).
  Copiar el flujo de `logic/find-user-by-email.js`: comprobar →
  try query → si no hay fila, error → `toUser`.
- Cambiar email por id: `parseEmail`/`findByEmail` → `parseId`/`findById`.
- `clients/terminal/find-user-by-id.txt` (copia el de email, llama
  `findUserById(1)`).

## Errores (inglés, como el resto de la app)
- `Invalid id` — antes de SQLite
- `User not found`
- `Could not find the user` — si SQLite falla

## No tocar
- `find-user-by-email.js` ni los demás ficheros de logic.
- `queries/users.js` (no hace falta SQL nuevo).
