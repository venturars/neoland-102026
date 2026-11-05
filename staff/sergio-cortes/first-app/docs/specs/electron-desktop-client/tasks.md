# Tareas — cliente de escritorio

Issue: #924.

El paso 1 solo se ejecuta tras la aprobación de «Paquetes».

1. Desde `first-app`, ejecutar `pnpm add -D electron@45.2.2 --save-exact`.
   `package.json` queda con `electron` en `devDependencies`, `45.2.2`, sin `^`.
   Cambia `pnpm-lock.yaml`. No se añade ninguna otra dependencia.

2. Abrir `pnpm-lock.yaml`.
   Las versiones de `electron` y de sus dependencias, hasta 3 capas, son las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.
   No se instala otra versión para hacerla coincidir.

3. Abrir `package.json`. Añadir el script `electron`: si nada escucha en
   `127.0.0.1:3000` (`nc -z`), arranca `src/db/server.js` en segundo plano y lo
   para al salir; después ejecuta `electron src/clients/electron/main.js`.
   No se tocan `server`, `web`, `http`, `jupyter`, `format`, `lint` ni `test`.

4. Abrir `eslint.config.js`. Declarar `process` como global para
   `src/clients/electron/main.js`. Declarar `document` y `fetch` como globales
   para `src/clients/electron/app.js`. No se cambian los bloques de `http/` ni de `web/`.

5. Abrir `docs/STYLE.md`. La excepción de varias funciones en un fichero cubre
   también `src/clients/electron/app.js`. El resto de la guía no cambia.

6. Copiar `src/clients/web/index.html`, `styles.css` y `app.js` a
   `src/clients/electron/`. No se edita `src/clients/web/`.
   Las rutas relativas `../../logic/` de `app.js` siguen valiendo.

7. Crear `src/clients/electron/main.js`, siguiendo `docs/STYLE.md`.
   Importa `app` y `BrowserWindow` desde `electron`. La ventana carga el
   `index.html` que está junto a este fichero, no el de `web/`.
   Al cerrar todas las ventanas, sale si la plataforma no es `darwin`. Al activar en `darwin`, si no hay ventanas, abre una.

8. Abrir `docs/TREE.md` y `docs/ARCHITECTURE.md`.
   Añadir `src/clients/electron/` con `main.js`, `index.html`, `styles.css` y `app.js`.
   Ese cliente llama a `src/logic/` con `await`, abre su ventana y no modifica `src/clients/web/`.
   El script `electron` arranca la base si el puerto 3000 está libre, como `http`.

9. `pnpm run format` y `pnpm run lint` sobre lo tocado.
   No cambia `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes.

10. Desde `first-app`, `pnpm electron`. Se abre una ventana con las tres pantallas
    (selección, menú, edición), no una pestaña de Brave. Si el puerto 3000 está
    libre, arranca la base; si ya está, la reutiliza.
    Probar listar, elegir, guardar y borrar contra `src/logic/`, y los fallos de la spec.
    No hay cliente `.txt` de terminal.
