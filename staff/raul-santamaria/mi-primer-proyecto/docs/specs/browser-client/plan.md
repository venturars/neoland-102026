# Plan — cliente del navegador

Issue: #851.

No es una funcionalidad nueva. No se reemplaza ningún fichero de `logic/`. No hay firma nueva. No hay SQL nuevo en este desarrollo. No hay paquete nuevo. No hay mensaje nuevo. No entra Socket.

**Precondición:** en mi-primer-proyecto la base aún no está en un servidor Node. Antes de implementar este plan, la app debe tener `src/db/server.js`, `pnpm server`, `queries` hablando con ese servidor y funciones de `logic/` async (alcance de issue #851, patrón del curso en first-app). Este plan describe solo el cliente del navegador, como en el spec homónimo de referencia del staff.

El cliente importa lo que ya existe en `src/logic/` y pinta el resultado. Igual que un `.txt` de terminal: la llamada vive en el cliente; las reglas, en `logic/`.

Listar: `listUsers()`. Guardar: `updateUser({ id, name, email })`. Borrar: `deleteUser({ id })`. Los campos del formulario salen del usuario elegido en la lista. No se usa `users-gender-count.js` (depende de `openai`).

El usuario activo se guarda en memoria en la página. “Volver” al listado vuelve a pedir la lista. Al reabrir la página, se empieza otra vez en el listado.

Un solo HTML con tres bloques (`<section>`) y el atributo `hidden` para cambiar de vista. CSS aparte. `app.js` como módulo ES con imports relativos a `../../logic/`. Textos de botones y títulos en español; identificadores y código en inglés. En el menú, “Notas” va deshabilitado y sin manejador.

`package.json` gana el script `browser`. Desde `mi-primer-proyecto`, `pnpm browser` abre `src/clients/browser/index.html` por `file://` en Edge o Chrome, con el flag que permita importar módulos locales en Windows. La base sigue en el puerto 3000 con `pnpm server`.

## Ficheros

Se crean:

- `src/clients/browser/index.html`
- `src/clients/browser/app.js`
- `src/clients/browser/styles.css`

Se tocan:

- `package.json`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`

En el árbol, `src/clients/` incluye `browser/` con esos tres ficheros. En arquitectura, ese cliente llama a `logic/` y no duplica validaciones. La página no se sirve.

## Firma

No hay función nueva.

## SQL

No hay SQL en este desarrollo.

## Errores

| Fallo en la spec              | Mensaje                       |
| ----------------------------- | ----------------------------- |
| Nombre vacío                  | `Name is empty`               |
| Email inválido                | `Email is invalid`            |
| Email ya usado                | `Email is already used`       |
| Id inválido                   | `User id is not valid`        |
| Usuario inexistente           | `No user exists with that id` |
| Base caída al listar          | `Could not list the users`    |
| Base caída al guardar         | `Could not update the user`   |
| Base caída al borrar          | `Could not delete the user`   |
