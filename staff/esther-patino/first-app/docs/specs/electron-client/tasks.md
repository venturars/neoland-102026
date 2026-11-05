# Tareas — cliente de escritorio propio

1. Abre `package.json`.
   Añade `electron` en `45.2.2` a `devDependencies`.
   Añade el script `electron`.
   El resto de dependencias y scripts no cambia.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `electron` queda en `45.2.2`.
   `express`, `fastify`, `@colors/colors`, `cli-table3` y `openai` siguen en su versión.

3. Abre `pnpm-lock.yaml`.
   Las versiones de `electron` y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

4. Abre `docs/tree.md`, en `clients/`.
   Añade `electron/` con `main.js`, `preload.js`, `index.html`, `app.js` y `styles.css`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

5. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `main.js` llama a `src/logic/` y abre la ventana. La página no importa `src/logic/`.
   No repite las reglas. No sustituye a `src/db/server.js` ni a HTTP, Chrome o web.
   No escucha en un puerto.

6. Abre `docs/style.md`, en Comandos.
   Añade `pnpm electron` desde `first-app`.
   La base sigue en `127.0.0.1:3000`.
   Esas líneas se leen.

7. Abre `docs/CONSTITUTIONS.md`, en la sección 1 y en la 7.
   También se crea, se lista, se ve, se cambia y se borra un usuario desde una ventana de escritorio. La base sigue en el 3000.
   Este cambio añade el cliente Electron y no añade un `.txt`.
   Esas líneas se leen.

8. Crea `src/clients/electron/main.js`.
   Importa `app`, `BrowserWindow` e `ipcMain` desde `electron`, y las cinco funciones desde `../../logic/`, con extensión `.js`.
   No importa los otros tres ficheros de `logic/`. Carga `index.html` de esa carpeta y usa `preload.js`.
   Cada acción llama a su función. Un fallo de la tabla se muestra tal cual. Otro fallo muestra el `Could not` de esa acción.

9. Crea `src/clients/electron/preload.js`.
   Publica las cinco llamadas con `contextBridge` e `ipcRenderer.invoke`.
   No importa `src/logic/`.
   La página podrá pedir crear, listar, ver, modificar y borrar.

10. Crea `src/clients/electron/index.html`, `app.js` y `styles.css`.
    Una ventana: lista con id, nombre y email, alta con nombre y email, y la ficha al elegir.
    `app.js` usa las llamadas de `preload.js`. No importa `src/logic/` ni `electron`.
    Los textos van en español. Si no hay usuarios, la lista está vacía.

11. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe los ficheros de `src/clients/electron/`.
    `pnpm lint` termina bien.
    No cambia `src/logic/` ni `src/queries/`.

12. Arranca la base con `pnpm server` y la ventana con `pnpm electron`.
    Se abre la ventana. La base sigue en el puerto 3000.
    No hace falta `pnpm http` ni `pnpm chrome`.
    Si no hay usuarios, la lista está vacía.

13. Crea Ada con ada@example.com.
    La lista lo muestra con el id, el nombre y el email en minúsculas.
    Al elegirlo se ven el id, el nombre, el email y las dos fechas.
    Cambia el nombre a Ada Lovelace. El email no cambia.

14. Crea con el nombre vacío, con un email que no vale y con el email de Ada.
    Se ven `Name is empty`, `Email is invalid` y `Email is already used`.
    No se guarda nada.
    Esas frases son las de la tabla del plan.

15. Borra a Ada.
    Ya no sale en la lista.
    Si no queda ninguno, esa lista está vacía.
    La ventana sigue abierta.

16. Para la base y vuelve a listar.
    Se ve `Could not list the users`.
    Arranca otra vez la base.
    HTTP en el 3001, Chrome en el 3002 y las pantallas del navegador siguen funcionando.
