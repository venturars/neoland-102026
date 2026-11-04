# Cliente de navegador (módulos ES)

El browser importa `src/logic/` directamente. No hay rutas GET/POST de pantalla ni `/api/*`. La base SQLite vive en el servidor Node (`POST /execute`).

## Requisitos

- Node con `fetch` nativo.
- Usuarios en `src/db/users.sqlite` con el esquema actual (`createdAt`, `updatedAt`). Si migraste desde columnas antiguas, borra `users.sqlite` y ejecuta `create-users-table.txt` con el servidor en marcha.

## Arranque

Ver también [`docs/STARTUP.md`](../../../docs/STARTUP.md) (por qué hacen falta dos terminales).

1. Terminal en la raíz de first-app (`staff/jose-miguel/first-app`).

2. Servidor SQL:

   ```text
   pnpm server
   ```

   Debe imprimir `http://127.0.0.1:3000`. Déjalo abierto.

3. Otra terminal, cliente browser:

   ```text
   pnpm browser
   ```

   Abre Edge o Chrome con `file://…/src/clients/browser/index.html` y permiso para módulos ES.

4. Detener el servidor con **Ctrl+C** en la primera terminal.

## Pantallas

1. Lista de usuarios (id, nombre, email).
2. Menú: volver, modificar, notas deshabilitado.
3. Edición: guardar, volver, eliminar (con confirmación).

## Spec

- `docs/specs/browser-user-client/`
- Issue: [#779](https://github.com/venturars/neoland-102026/issues/779)
