# Tareas — las pantallas se abren desde el archivo

1. Abre `docs/style.md`, en Comandos.
   La base sigue con `pnpm server` en `127.0.0.1:3000`.
   Las pantallas se abren con `pnpm open` sobre `src/clients/web/index.html`.
   Esas líneas se leen.

2. Abre `docs/ARCHITECTURE.md`, en `src/clients/web/`.
   No hay `src/clients/http/`.
   Quedan `index.html`, `styles.css` y `app.js`.
   `app.js` llama a `listUsers`, `findUserById`, `updateUser` y `deleteUser`.

3. Abre `docs/tree.md`, en `clients/web/`.
   No está `http/`.
   `web/` muestra `index.html`, `styles.css` y `app.js`.
   Esas líneas se leen.

4. Abre `AGENTS.md`, en Proyecto.
   El navegador se abre con `pnpm open`.
   Esa línea se lee.

5. Crea `src/clients/web/app.js`.
   Junta la lógica de las pantallas que ya existe.
   Importa `listUsers`, `findUserById`, `updateUser` y `deleteUser`.
   No llama a `fetch` por su cuenta.

6. Abre `src/clients/web/index.html`.
   La hoja es `styles.css` y el script es `app.js`.
   Las dos rutas van sin barra inicial.
   Esas rutas se leen.

7. Borra los `.js` sueltos de `src/clients/web/` y la carpeta `src/clients/http/`.
   En `web/` quedan `index.html`, `app.js` y `styles.css`.
   `http/` no está.
   El directorio se lee.

8. Abre `package.json`.
   Sale el script `start`.
   Entra `open` y abre `src/clients/web/index.html`.
   Esas líneas se leen.

9. Lanza `pnpm server` y `pnpm open` desde `first-app`.
   `pnpm open` pide permiso para abrir el navegador.
   Se elige un usuario, se cambia y se borra, como dice la spec de vanilla.
   Ir a notas no abre otra pantalla. Después se lanzan `pnpm format` y `pnpm lint`.
