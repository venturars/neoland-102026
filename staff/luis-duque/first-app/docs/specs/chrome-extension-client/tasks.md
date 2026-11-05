# Tareas — cliente de extensión de Chrome

Plan aceptado. Se añade `fastify` `5.12.8`. Cada paso hace una cosa.

1. Abre `package.json` en `first-app`.
   El script `chrome` queda `node src/clients/chrome/server.js`. No hay otro script para este cliente.
   `format` también escribe `src/clients/chrome/**/*.js`. Se añade `fastify` `5.12.8`.
   `pnpm-lock.yaml` lo escribe pnpm.

2. Crea `src/clients/chrome/manifest.json`.
   Manifest V3, nombre Usuarios, popup `index.html` y permiso `http://127.0.0.1:3002/*`.
   Los scripts se quedan en `'self'`. Las hojas y las fuentes pueden salir de `fonts.googleapis.com` y `fonts.gstatic.com`.
   No hay script remoto. El fichero se puede leer.

3. Crea `src/clients/chrome/index.html`.
   Lista, menú, crear y modificar. La lista tiene id, Elegir y Crear. El menú tiene Volver y Modificar usuario.
   Crear tiene nombre, email, Guardar y Volver. Modificar tiene id, nombre, email, Guardar, Eliminar y Volver.
   Enlaza Literata y Familjen Grotesk. No hay Notas ni búsqueda. El fichero se puede leer.

4. Crea `src/clients/chrome/styles.css`.
   Chapa `#E4E8EA`, tinta `#1B2830`, latón `#A6843D`, óxido `#8F3D36`, niebla `#F7F8F8` y grafito `#5C6B73`. Literata en el título y en el nombre elegido.
   Popup de 360 píxeles, texto a la izquierda, una línea por persona con raya. El latón marca el id y el foco. El óxido marca el fallo y Eliminar. No hay animación. El fichero se puede leer.

5. Crea `src/clients/chrome/server.js` y `src/clients/chrome/app.js`.
   `server.js` usa Fastify `5.12.8`. Importa `listUsers`, `createUser`, `updateUser` y `deleteUser`, escucha en `127.0.0.1:3002` y no llama a `/execute`. `app.js` pide esas cuatro operaciones a ese origen.
   Listar vacía no es un fallo. Crear y eliminar vuelven a la lista. Modificar envía nombre y email y vuelve a la lista.
   Un `Error` muestra `error.message` y no cambia de vista. Elegir mira la lista ya cargada y no llama a buscar. El fichero se puede leer.

6. Abre `docs/ARCHITECTURE.md`.
   El popup de Chrome lista, crea, modifica y elimina. Su programa se arranca con `pnpm chrome`.
   El programa llama a la lógica. No busca, no cuenta el género y no incluye notas. El aspecto es el del libro de registro.
   La terminal, Jupyter, las pantallas, la ventana y el cliente HTTP siguen igual. El fichero se puede leer.

7. Abre `docs/TREE.md`.
   Añade `clients/chrome/` con `manifest.json`, `index.html`, `app.js`, `styles.css` y `server.js`.
   No añade más ficheros en esa carpeta.
   El fichero se puede leer.

8. Abre `docs/STYLE.md`.
   El popup usa el libro de registro, el mismo de las pantallas y de la ventana.
   Chapa, tinta, latón, óxido, Literata y Familjen Grotesk. El fichero se puede leer.
   El fichero se puede leer.

9. Abre `docs/ERRORS.md`.
   Si el popup no se abre, no se puede pedir la operación desde ahí.
   Si `pnpm chrome` no está en marcha, el popup muestra el fallo de esa llamada. Si el programa de consultas no está en marcha, muestra el fallo que devuelve su programa.
   Los mensajes que ya estaban se quedan. El fichero se puede leer.

10. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
    Cuentan el popup, `pnpm chrome` y `src/clients/chrome`. El manifiesto vive en `src/clients/chrome/manifest.json`. El desarrollo abierto pasa a ser `docs/specs/chrome-extension-client/`.
    `server.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser` y escucha en `127.0.0.1:3002`. No valida, no escribe SQL y no abre la base.
    Fastify queda en `5.12.8`. Los dos se pueden leer.

11. Lee `src/logic`, `src/queries`, `src/db` y el resto de `src/clients`.
    Siguen igual. `docs/DATABASE.md` no se toca.
    La dependencia nueva es `fastify` `5.12.8`.
    `package.json` no gana ningún otro paquete.

12. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
    Formatean el JavaScript de `src/clients/chrome` y no dejan avisos.
    No se tocan la terminal, Jupyter, las pantallas, el cliente HTTP ni la ventana.
    Los dos comandos terminan.

13. Desde `first-app`, lanza `pnpm chrome`, con `pnpm server` en marcha.
    El programa escucha en `127.0.0.1:3002`.
    El popup, cargado desde `src/clients/chrome`, muestra la lista de quien hay, o se queda vacía.
    Se puede crear, modificar y eliminar. Guardar o eliminar vuelve a la lista.
