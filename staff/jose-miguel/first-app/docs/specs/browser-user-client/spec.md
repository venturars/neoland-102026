# Cliente de navegador (módulos ES, sin rutas HTTP de UI)

Issue: #779.

Quien prueba la app elige quién es y, desde ahí, cambia o borra a ese usuario. No hay contraseña.

Se abre con `pnpm browser` desde `first-app` (HTML en `file://` con módulos ES). **No** se sirve la página desde Node. **No** hay GET/POST de pantallas en el navegador ni `/api/*`.

La base debe estar en marcha (`pnpm server`), porque `logic/` llega a SQLite vía `queries/` y `fetch` a `/execute`.

## Pantallas

1. Lista: id, nombre y email; elegir uno sin contraseña. Lista vacía si no hay usuarios.
2. Menú: volver, modificar, notas desactivado.
3. Edición: guardar, volver, eliminar (con confirmación).

## Errores visibles

`Name is empty`, `Email is invalid`, `Email is already used`, `User not found`, `Could not list the users`, `Could not update the user`, `Could not delete the user`.

## Migración SQLite

Tras el nuevo DDL (`createdAt` / `updatedAt`), puede hacer falta borrar `src/db/users.sqlite` y recrear usuarios.

Queda fuera contraseña, crear usuarios desde el browser, notas activas y servir HTML.

## Arranque

Desde la raíz de `first-app`:

1. `pnpm server` — dejar la terminal abierta (`http://127.0.0.1:3000`).
2. `pnpm browser` — en otra terminal (Edge/Chrome con `file://`).

Pasos completos, requisitos y migración SQLite: [`src/clients/browser/README.md`](../../../src/clients/browser/README.md).
