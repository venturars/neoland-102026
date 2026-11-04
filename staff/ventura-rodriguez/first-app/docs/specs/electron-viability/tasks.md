# Tareas — cliente de escritorio propio

1. Abre `package.json`.
   Añade `electron` en `45.2.2` a `devDependencies`.
   Añade el script `electron` y el glob `src/clients/electron/**/*.js` en `format`.
   El campo `main` sigue en `index.js`. El resto de dependencias y scripts no cambia.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `electron` queda en `45.2.2`.
   `@colors/colors`, `cli-table3`, `express` y `openai` siguen en su versión.

3. Abre `pnpm-lock.yaml`.
   Las versiones de `electron` y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

4. Abre `docs/TREE.md`, en `src/clients/`.
   Añade `electron/` con `main.js`, `index.html`, `app.js` y `styles.css`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

5. Abre `docs/ARCHITECTURE.md`, junto a los otros clientes.
   `src/clients/electron/` llama a `src/logic/`, abre su ventana y no reutiliza `src/clients/browser/`.
   No sustituye a `src/db/server.js`.
   Esas líneas se leen en la arquitectura.

6. Crea `src/clients/electron/main.js`.
   Importa `app` y `BrowserWindow` desde `electron`. La ventana carga el `index.html` que está junto a este fichero.
   Al cerrar todas las ventanas, sale si la plataforma no es `darwin`. Al activar en `darwin`, si no hay ventanas, abre una.
   No importa `src/clients/browser/`.

7. Crea `src/clients/electron/index.html`.
   Dos pantallas: la lista con el alta y el id para ver uno, y la ficha para modificar o borrar.
   El texto visible está en español. La ficha muestra el id, el nombre, el email y las dos fechas.
   El estilo es `./styles.css` y el script es `type="module"` hacia `./app.js`.

8. Crea `src/clients/electron/styles.css`.
   Da aspecto a las dos pantallas.
   El mensaje de error se distingue del resto.
   El fichero se lee.

9. Crea `src/clients/electron/app.js`.
   Importa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser` desde `../../logic/`, con extensión `.js`. No importa los otros tres ficheros de `logic/`.
   La lista muestra id, nombre y email. Crear llama a `createUser`. Ver uno llama a `findUserById`.
   Guardar llama a `updateUser`. Eliminar llama a `deleteUser` y vuelve a la lista. Un fallo muestra `error.message`.

10. En `first-app`, lanza `pnpm format` y `pnpm lint`.
    `pnpm format` escribe el JavaScript de `src/clients/electron/`.
    `pnpm lint` termina bien.
    No cambia `src/logic/` ni `src/queries/`.

11. Arranca la base con el comando que ya existe y el cliente con `pnpm electron`.
    Se abre una ventana propia, no la del navegador.
    La base sigue en el puerto 3000.
    Si no hay usuarios, la lista está vacía.

12. Crea Ada con ada@example.com.
    Sale el id, el nombre Ada y el email ada@example.com.
    La lista lo muestra.
    Pedir ese id muestra los mismos datos y las dos fechas.

13. Cambia el nombre a Ada Lovelace y guarda.
    Se ve el mismo id, el nombre Ada Lovelace y el email ada@example.com.
    El nombre vacío muestra `Name is empty`.
    Un email que no vale muestra `Email is invalid`. Un email de otro usuario muestra `Email is already used`.

14. Pide un id que no está.
    Se ve `User not found`.
    Borra a Ada. Ada ya no sale en la lista.
    Si no queda ninguno, la lista está vacía.
