# Tareas — cliente Electron

Plan aceptado. Electron `45.2.2` queda permitido. Cada paso hace una cosa.

1. Abre `package.json` en `first-app`.
   pnpm añade `electron` `45.2.2` en `dependencies`. El script `electron` queda `electron src/clients/electron/main.js`.
   `format` también escribe `src/clients/electron/**/*.js`. El campo `main` sigue en `index.js`.
   `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano. No hay instalador.

2. Crea `src/clients/electron/main.js`.
   Importa `app` y `BrowserWindow`. Al estar lista, abre una ventana y carga el `index.html` de esa carpeta.
   `nodeIntegration` sigue inactivo y `contextIsolation` sigue activo. No hay `preload`. Al cerrar la ventana, la app sale.
   No escucha en un puerto. El fichero se puede leer.

3. Crea `src/clients/electron/index.html`.
   Lista, menú, crear y modificar. La lista tiene id, Elegir y Crear. El menú tiene Volver y Modificar usuario.
   Crear tiene nombre, email, Guardar y Volver. Modificar tiene id, nombre, email, Guardar, Eliminar y Volver.
   No hay Notas ni búsqueda. El fichero se puede leer.

4. Crea `src/clients/electron/styles.css`.
   Usa la dirección de `docs/STYLE.md`: chapa, tinta, latón, óxido, niebla y grafito. Literata y Familjen Grotesk.
   Texto a la izquierda, una columna, una línea por persona y botones al ancho. El email baja en una ventana estrecha.
   Sin animación. El latón solo marca el id y el foco. El óxido solo marca el fallo y Eliminar. El fichero se puede leer.

5. Crea `src/clients/electron/app.js`.
   Importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa búsquedas ni `usersGender`. No llama a `/execute`.
   Listar vacía no es un fallo. Crear y eliminar vuelven a la lista. Modificar envía nombre y email y vuelve a la lista.
   Un `Error` muestra `error.message` y no cambia de vista. Elegir mira la lista ya cargada y no llama a buscar. El fichero se puede leer.

6. Abre `docs/ARCHITECTURE.md`.
   El cliente Electron lista, crea, modifica y elimina en una ventana. Se abre con `pnpm electron`, con el programa local en marcha.
   Importa la lógica. No busca, no cuenta el género y no incluye notas.
   La terminal, Jupyter, las pantallas y el cliente HTTP siguen igual. El fichero se puede leer.

7. Abre `docs/TREE.md`.
   Añade `clients/electron/` con `main.js`, `index.html`, `app.js` y `styles.css`.
   No añade `preload.js` ni más ficheros en esa carpeta.
   El fichero se puede leer.

8. Abre `docs/STYLE.md`.
   La ventana Electron usa el mismo libro de registro. Añade la vista Crear usuario.
   El menú de esta ventana es Volver y Modificar usuario. Las pantallas del navegador conservan Notas.
   El fichero se puede leer.

9. Abre `docs/ERRORS.md`.
   Si Electron no abre la ventana, no se puede pedir la operación desde ahí.
   Si el programa local no está en marcha, la ventana muestra el fallo de esa llamada.
   Los mensajes que ya estaban se quedan. El fichero se puede leer.

10. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
    Cuentan la ventana, `pnpm electron` y Electron `45.2.2` en `src/clients/electron`. El desarrollo abierto pasa a ser `docs/specs/electron-client/`.
    `app.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No valida, no escribe SQL y no abre la base.
    Express `5.3.0` sigue siendo la excepción ya aceptada. Electron `45.2.2` es la otra. Otro framework sigue prohibido. Los dos se pueden leer.

11. Lee `src/logic`, `src/queries`, `src/db` y el resto de `src/clients`.
    Siguen igual. `docs/DATABASE.md` no se toca.
    No hay otra dependencia nueva.
    `electron` en `package.json` es `45.2.2`.

12. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
    Formatean el JavaScript de `src/clients/electron` y no dejan avisos.
    No se tocan la terminal, Jupyter, las pantallas ni el cliente HTTP.
    Los dos comandos terminan.

13. Desde `first-app`, lanza `pnpm electron`, con `pnpm server` en marcha.
    Se abre la ventana. La lista muestra a quien hay, o se queda vacía.
    Se puede crear, modificar y eliminar. No hay buscar, contar el género ni notas.
    Guardar o eliminar vuelve a la lista.
