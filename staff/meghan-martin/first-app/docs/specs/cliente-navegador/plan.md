# Plan — personas en el navegador

Cumple `docs/specs/cliente-navegador/spec.md`. No es una acción nueva de `src/logic/`.

## Tocar

- `src/clients/browser/server.js`: sirve las páginas en `127.0.0.1:3000` y llama a las funciones que ya existen.
- `src/clients/browser/list.html`: la lista.
- `src/clients/browser/options.html`: volver y editar.
- `src/clients/browser/edit.html`: el nombre, el email, y la ventana de borrar. Cancel cierra la ventana y no borra.
- `src/clients/browser/styles.css`: el aspecto.
- `package.json`: el script `browser`. No se añade ningún paquete.
- `docs/CONSTITUTIONS.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md`: nombran este cliente.

La lista llama a `listUsers`. La persona elegida llama a `findUserById`. Guardar llama a `updateUser(id, { name, email })`. Borrar llama a `deleteUser(id)`.

No hay SQL nuevo. No hay firma nueva.

## Frases

Las que ya están en `docs/ERRORS.md`:

- Nombre vacío: `Name is empty`
- Email que no vale: `Email is invalid`
- Email de otra persona: `Email is already used`
- Número que no vale: `Invalid id`
- Persona que no está: `User not found`

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/` y `src/clients/jupyter/`
- Paquetes y el lock

## Comprobar

Desde `first-app`, `npm run browser` y abrir `http://127.0.0.1:3000`. Luego `npm run format` y `npm run lint`. El formato no cambia `src/logic/`.
