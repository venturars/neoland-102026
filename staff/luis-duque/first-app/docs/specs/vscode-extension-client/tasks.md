# Tareas — cliente de extensión de Visual Studio Code

Plan aceptado. No se añade un paquete de Node. Cada paso hace una cosa.

1. Abre `package.json` en `first-app`.
   El script `vscode` queda `code --extensionDevelopmentPath="%CD%\\src\\clients\\vscode" "%CD%"`. No hay otro script para este cliente.
   `format` también escribe `src/clients/vscode/**/*.js`.
   No se añade ninguna dependencia.

2. Crea `src/clients/vscode/package.json` y `src/clients/vscode/icon.svg`.
   Manifiesto ESM, `engines.vscode` `^1.100.0`, nombre visible Usuarios, vista `webview` en un contenedor de la barra de actividad con `icon.svg`.
   No tiene `dependencies` ni `scripts`. No hay comandos ni script remoto.
   `pnpm-workspace.yaml` no lo añade. Los dos se pueden leer.

3. Crea `src/clients/vscode/index.html`.
   Lista, menú, crear y modificar. La lista tiene id, Elegir y Crear. El menú tiene Volver y Modificar usuario.
   Crear tiene nombre, email, Guardar y Volver. Modificar tiene id, nombre, email, Guardar, Eliminar y Volver.
   Enlaza Literata y Familjen Grotesk. No hay Notas ni búsqueda. El fichero se puede leer.

4. Crea `src/clients/vscode/styles.css`.
   Chapa `#E4E8EA`, tinta `#1B2830`, latón `#A6843D`, óxido `#8F3D36`, niebla `#F7F8F8` y grafito `#5C6B73`. Literata en el título y en el nombre elegido.
   Ancho de la barra lateral, texto a la izquierda, una línea por persona con raya. El latón marca el id y el foco. El óxido marca el fallo y Eliminar. No hay animación. El fichero se puede leer.

5. Crea `src/clients/vscode/extension.js` y `src/clients/vscode/app.js`.
   `extension.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`, carga `index.html` en la vista y no llama a `/execute`. `app.js` pide esas cuatro operaciones al proceso del editor y no importa la lógica.
   Listar vacía no es un fallo. Crear y eliminar vuelven a la lista. Modificar envía nombre y email y vuelve a la lista.
   Un `Error` muestra `error.message` y no cambia de vista. Elegir mira la lista ya cargada y no llama a buscar. El fichero se puede leer.

6. Abre `docs/ARCHITECTURE.md`.
   La extensión de Visual Studio Code lista, crea, modifica y elimina en la barra lateral. Se arranca con `pnpm vscode`.
   El proceso del editor llama a la lógica. La vista no importa la lógica. No busca, no cuenta el género, no incluye notas y no escucha en un puerto. El aspecto es el del libro de registro.
   La terminal, Jupyter, las pantallas, la ventana, el popup de Chrome y el cliente HTTP siguen igual. El fichero se puede leer.

7. Abre `docs/TREE.md`.
   Añade `clients/vscode/` con `package.json`, `extension.js`, `index.html`, `app.js`, `styles.css` e `icon.svg`.
   No añade más ficheros en esa carpeta.
   El fichero se puede leer.

8. Abre `docs/STYLE.md`.
   La vista usa el libro de registro, el mismo de las pantallas, de la ventana y del popup.
   Chapa, tinta, latón, óxido, Literata y Familjen Grotesk. El fichero se puede leer.

9. Abre `docs/ERRORS.md`.
   Si la extensión no se abre, no se puede pedir la operación desde ahí.
   Si el programa de consultas no está en marcha, la vista muestra el fallo de esa llamada.
   Los mensajes que ya estaban se quedan. El fichero se puede leer.

10. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
    Cuentan la vista, `pnpm vscode` y `src/clients/vscode`. El manifiesto vive en `src/clients/vscode/package.json`. El desarrollo abierto pasa a ser `docs/specs/vscode-extension-client/`.
    `extension.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. `app.js` pide esas operaciones al proceso del editor. No valida, no escribe SQL y no abre la base.
    `vscode` lo aporta el editor. `engines.vscode` queda en `^1.100.0`. No se añade otro framework. Los dos se pueden leer.

11. Lee `src/logic`, `src/queries`, `src/db` y el resto de `src/clients`.
    Siguen igual. `docs/DATABASE.md` no se toca.
    No hay dependencia nueva.
    `package.json` de `first-app` no gana ningún paquete.

12. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
    Formatean el JavaScript de `src/clients/vscode` y no dejan avisos.
    No se tocan la terminal, Jupyter, las pantallas, el cliente HTTP, la ventana ni el popup.
    Los dos comandos terminan.

13. Desde `first-app`, lanza `pnpm vscode`, con `pnpm server` en marcha.
    Se abre Visual Studio Code con la extensión cargada. El icono Usuarios de la barra de actividad abre la vista.
    La lista muestra a quien hay, o se queda vacía.
    Se puede crear, modificar y eliminar. Guardar o eliminar vuelve a la lista.
