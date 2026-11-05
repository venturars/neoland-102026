# Plan — personas en el navegador

Cumple `docs/specs/cliente-navegador/spec.md`. No es una acción nueva de `src/logic/`.

## Tocar

- `src/clients/browser/index.html`: la lista, las opciones, la edición y la ventana de borrar.
- `src/clients/browser/app.js`: llama a `listUsers`, `findUserById`, `updateUser` y `deleteUser`.
- `src/clients/browser/styles.css`: el aspecto.
- `package.json`: el script `browser` abre ese HTML. No se añade ningún paquete y no se sirve la página.

No hay SQL nuevo. No hay firma nueva.

## Frases

Las que ya están en `docs/ERRORS.md`:

- Nombre vacío: `Name is empty`
- Email que no vale: `Email is invalid`
- Email de otra persona: `Email is already used`
- Número que no vale: `Invalid id`
- Persona que no está: `User not found`
- Base parada: `Database is not running. Start it with npm run db.`

## Comprobar

Desde `first-app`, con `npm run db` en marcha, `npm run browser`. Luego `npm run format` y `npm run lint`.
