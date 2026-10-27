# Plan — el código se lee como las guías

Cumple `docs/specs/codigo-como-las-guias/spec.md`.

## Tocar

- `logic/create-user.js`, `logic/update-user.js` y `logic/find-user-by-email.js`. Cada comprobación del nombre y del email va en su línea. Las frases de error no cambian.
- `logic/find-user-by-id.js` y `logic/delete-user.js`. La comprobación del número se lee en nombres.
- `logic/list-users.js`. La lista saneada queda en un nombre antes de devolverse.
- `queries/users.js`. Leer cada `.sql` y preparar cada sentencia quedan en pasos separados.
- `db/connection.js`. El camino del fichero se lee en nombres. `USERS_DB_PATH` sigue ganando.

## No tocar

- Los `.sql`.
- Los ejemplos de `clients/terminal/`.
- `logic/users-gender-count.js`. Cada comprobación va en su `if`. El recuento no cambia.
- No hay frase nueva ni acción nueva.
