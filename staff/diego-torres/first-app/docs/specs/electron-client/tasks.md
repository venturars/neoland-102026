Issue: #935

# Tareas — cliente de escritorio de usuarios

1. Abre `package.json`.
   Añade `electron` en `45.2.2` a `devDependencies`, el script `electron` y `src/clients/electron/**/*.{js,html,css}` en `format`.
   El resto de dependencias y scripts no cambia.

2. En `first-app`, lanza `pnpm install`.
   `pnpm-lock.yaml` cambia y `electron` queda en `45.2.2`.
   Las demás dependencias siguen en su versión.

3. Abre `pnpm-lock.yaml`.
   Las versiones de `electron` y de sus dependencias, hasta 3 capas, son las de la tabla del plan.
   Si una no coincide, para y dilo. No se instala otra versión para hacerla coincidir.

4. Abre `eslint.config.js`.
   Añade `document` y `confirm` para `src/clients/electron/**/*.js`.
   Lo demás no cambia.

5. Crea `src/clients/electron/main.js`.
   Abre la ventana y carga el `index.html` de al lado. Al cerrar todas sale, salvo en macOS. Al activar en macOS sin ventanas, abre una.
   Se lee el fichero: no importa nada de `src/clients/web/`.

6. Crea `src/clients/electron/index.html` y `styles.css`.
   Dos `<section data-screen>`, `list` y `detail`, y el `<p id="message" role="status">`. Los campos son `type="text"` y sin `required`.
   El mensaje de error se distingue del resto.

7. Crea `state.js`, `show-screen.js` y `show-message.js` en `src/clients/electron/`.
   `STATE` guarda `currentUser` e `isBusy`. Las otras dos cambian de pantalla y muestran mensajes.
   Una función exportada por fichero.

8. Crea `load-users.js`, `create-user-from-form.js` y `app.js`.
   `loadUsers` pinta la lista con `textContent`, y sin usuarios muestra `No hay usuarios todavía`. Crear llama a `createUser`.
   `app.js` conecta los formularios y botones que ya existen, y abre la lista.

9. Crea `open-user.js`, `save-user.js` y `delete-current-user.js`.
   Ver llama a `findUserById`. Guardar llama a `updateUser` y muestra `Datos guardados`. Eliminar pide `confirm`, llama a `deleteUser` y vuelve a la lista.
   Un fallo muestra `error.message`. Conecta estas funciones en `app.js`.

10. Abre `AGENTS.md`, `docs/ARCHITECTURE.md` y `docs/TREE.md`.
    Añade `electron` a las dependencias, el comando `pnpm electron`, el alcance de `pnpm format`, el cliente en la lista de los que necesitan el servidor, su fila en «Quién sabe qué», los sitios donde se ejecuta `logic` y `clients/electron/` en el árbol.
    Esas líneas se leen en cada documento.

11. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm lint` termina bien.
    `git status` no muestra cambios en `src/logic/`, `src/queries/`, `src/db/` ni `src/clients/web/`.

12. Arranca `pnpm start` y, en otra terminal, `pnpm electron`.
    Se abre una ventana propia. Sin usuarios se ve `No hay usuarios todavía`.
    Si falta el binario de Electron o el servidor rechaza la página, para y pregunta. No toques pnpm ni `src/db/server.js`.

13. Crea Ada con ada@example.com.
    Aparece en la lista como `#N · Ada — ada@example.com`.
    Pedir ese id muestra los mismos datos y las dos fechas.

14. Cambia el nombre a Ada Lovelace y guarda.
    Se ve el mismo id, el nombre nuevo, el mismo email y `Datos guardados`.

15. Prueba los errores.
    El nombre vacío muestra `Name is empty`. Un email malo, `Email is invalid`. El email de otro usuario, `Email is already used`. Un id que no está, `User not found`.

16. Pulsa «Eliminar» y cancela.
    El usuario sigue y se puede escribir en los campos. Si no se puede, para y dilo.
    Pulsa «Eliminar» y confirma: se vuelve a la lista y Ada ya no sale.

17. Para el servidor y repite cada acción.
    Se ve `Could not create the user`, `Could not list the users`, `Could not find the user`, `Could not update the user` y `Could not delete the user`.

18. Con el servidor en marcha, lanza `pnpm browser`.
    La web funciona igual que antes.
