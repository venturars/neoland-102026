# Tareas — cliente de VS Code

1. Crea `src/clients/vscode/package.json`.
   Es el manifiesto: `"type"` es `"module"` y `engines.vscode` es `^1.94.0`.
   El comando se llama «Abrir usuarios» y `main` es `./extension.js`.
   El `package.json` de la raíz no cambia y no hay paquete nuevo.

2. Crea `.vscode/launch.json` en `first-app`.
   La configuración abre la ventana de desarrollo.
   `extensionDevelopmentPath` apunta a `src/clients/vscode`.
   No abre un puerto.

3. Abre `docs/tree.md`, en `clients/`.
   Añade `vscode/` con `package.json`, `extension.js`, `index.html`, `app.js` y `styles.css`.
   Añade `.vscode/launch.json`.
   El resto del árbol no cambia.

4. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `extension.js` llama a `src/logic/` y abre el panel en una pestaña. La página no importa `src/logic/`.
   No repite las reglas. No sustituye a `src/db/server.js` ni a HTTP, Chrome, Electron o web.
   No escucha en un puerto.

5. Abre `docs/style.md`, en Comandos.
   Añade la ventana de desarrollo desde `first-app` y el comando «Abrir usuarios».
   La base sigue en `127.0.0.1:3000`.
   Este cliente no escucha en un puerto.

6. Abre `docs/CONSTITUTIONS.md`, en la sección 1 y en la 7.
   También se crea, se lista, se busca, se ve, se cambia y se borra un usuario desde un panel de VS Code. La base sigue en el 3000.
   Este cambio añade el cliente de VS Code y no añade un `.txt`.
   Esas líneas se leen.

7. Crea `src/clients/vscode/extension.js`.
   Importa `vscode` y las siete funciones desde `../../logic/`, con extensión `.js`.
   No importa `users-gender-count.js`. El id escrito pasa por `Number`.
   Un fallo de la tabla se muestra tal cual. Otro fallo muestra el `Could not` de esa acción.

8. Crea `src/clients/vscode/index.html`, `app.js` y `styles.css`.
   Una pestaña: lista con id, nombre y email, alta, búsqueda por criterio y la ficha al elegir.
   `app.js` pide las acciones a la extensión. No importa `src/logic/` ni `vscode`.
   Los textos van en español. Si no hay usuarios, la lista está vacía.

9. En `first-app`, lanza `pnpm format` y `pnpm lint`.
   `pnpm format` escribe los ficheros de `src/clients/vscode/`.
   `pnpm lint` termina bien.
   No cambia `src/logic/` ni `src/queries/`.

10. Arranca la base con `pnpm server`.
    Abre `first-app` y lanza la configuración de `.vscode/launch.json`.
    En esa ventana, el comando «Abrir usuarios» abre una pestaña.
    Si no hay usuarios, la lista está vacía. No hace falta `pnpm http` ni `pnpm chrome`.

11. Crea Ada con ada@example.com.
    La lista lo muestra con el id, el nombre y el email en minúsculas.
    El criterio nombre y el valor Ada muestran a Ada. El valor ada no la muestra.
    El criterio correo con ada@example.com y el criterio id con ese id muestran a ese usuario.

12. Elige a Ada.
    Se ven el id, el nombre, el email y las dos fechas.
    Cambia el nombre a Ada Lovelace. El email no cambia.
    La lista vuelve a mostrar a todos, con el nombre nuevo.

13. Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven `Name is empty`, `Email is invalid` y `Email is already used`.
    Busca un correo que no está y un id que no está. Se ve `User not found`.
    Busca un id que no es un entero mayor o igual que 1. Se ve `Invalid id`. Busca un nombre vacío. Se ve `Name is empty`.

14. Borra a Ada.
    Ya no sale en la lista.
    Si no queda ninguno, esa lista está vacía.
    El panel sigue abierto.

15. Para la base y vuelve a listar.
    Se ve `Could not list the users`.
    Arranca otra vez la base.
    HTTP en el 3001, Chrome en el 3002, la ventana de escritorio y las pantallas del navegador siguen funcionando.
