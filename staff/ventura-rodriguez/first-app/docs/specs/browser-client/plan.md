# Plan — cliente del navegador

Issue: #815.

No es una funcionalidad nueva. No se reemplaza ningún fichero de `logic/`. No hay firma nueva. No hay SQL nuevo. No hay paquete nuevo. No hay mensaje nuevo.

No entra Socket.

El cliente importa las funciones que ya existen y muestra el resultado. Se parece a los clientes de `src/clients/terminal/`: la llamada está en el cliente y la regla sigue en `logic/`.

La lista usa `listUsers()`. Guardar usa `updateUser(id, { name, email })`. Borrar usa `deleteUser(id)`. El nombre y el email del formulario salen de la fila elegida en la lista. No se importa `users-gender-count.js`, porque ese fichero importa `openai`.

El id elegido vive en la página. Al volver, se muestra otra vez la lista. Al abrir de nuevo el cliente, también.

La página es un HTML que se abre en el navegador. No hay servidor de ficheros. El script de la página es `type="module"` e importa `src/logic/` con rutas relativas. `package.json` tiene el script `browser`. Se lanza con `pnpm browser` desde `first-app`. Arranca Brave con el perfil `/tmp/first-app-brave`, el permiso `--allow-file-access-from-files` y la URL `file://` de `src/clients/browser/index.html`. El SQL sigue en `src/db/server.js`, en el puerto 3000. La base se arranca con el comando que ya existe.

Las pantallas son HTML, CSS y JavaScript, sin paquetes. El texto que ve la persona está en español. El código está en inglés.

En la segunda pantalla hay tres botones: volver, modificar usuario y notas. El de notas está desactivado. No tiene acción y no abre otra pantalla.

## Ficheros

Se crean:

- `src/clients/browser/index.html`
- `src/clients/browser/app.js`
- `src/clients/browser/styles.css`

Se tocan:

- `package.json`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`

En el árbol, `clients/` incluye `browser/` con esos tres ficheros. En la arquitectura, ese cliente llama a `src/logic/` y no repite sus reglas. No se sirve la página.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                | Mensaje                     |
| ------------------------------- | --------------------------- |
| El nombre queda vacío           | `Name is empty`             |
| El email no vale                | `Email is invalid`          |
| El email es de otro usuario     | `Email is already used`     |
| El usuario ya no está           | `User not found`            |
| No se llega a la base al listar | `Could not list the users`  |
| No se llega al modificar        | `Could not update the user` |
| No se llega al borrar           | `Could not delete the user` |
