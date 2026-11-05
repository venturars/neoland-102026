# Tareas — cliente de VS Code para usuarios

Issue: #1018.

1. Abrir `eslint.config.js`.
   Declarar `document` y `acquireVsCodeApi` como globales para `src/clients/vscode/panel.js`.
   No se cambian los bloques de `http/`, `web/`, `electron/` ni `chrome/`.

2. Abrir `docs/STYLE.md`.
   La excepción de varias funciones en un fichero cubre también
   `src/clients/vscode/panel.js` y `src/clients/vscode/extension.js`.
   El resto de la guía no cambia.

3. Copiar `src/clients/web/index.html` y `styles.css` a `src/clients/vscode/`.
   En `index.html`, el script apunta a `panel.js`. En la primera pantalla, añadir criterio (nombre, email o id), valor y buscar.
   No se edita `src/clients/web/`.

4. Crear `src/clients/vscode/panel.js` a partir de `src/clients/web/app.js`.
   Las tres pantallas, el alta, el popover y el teclado siguen. No importa `src/logic/`.
   Lista, alta, búsqueda, selección, guardado y borrado se piden al proceso por mensajes.
   El email del popover se compara como en web; si no coincide no hay mensaje. Tras buscar, el desplegable muestra ese resultado; actualizar lista restaura todos.

5. Crear `src/clients/vscode/extension.js`, siguiendo `docs/STYLE.md` y el plan.
   Importa `vscode` y las funciones de `src/logic/` de la tabla del plan. El comando abre un webview en pestaña de editor con `index.html`.
   Cada mensaje llama a la función que toca; el id de texto pasa por `parseUserId`.
   Responde al panel con el resultado o con `error.message`. No escucha en un puerto.

6. Crear `src/clients/vscode/package.json`.
   Manifiesto de extensión: `type` `module`, `main` `./extension.js`, comando `First App: Abrir usuarios`.
   `engines.vscode` `^1.100.0`. Sin dependencias npm. No se toca el `package.json` de first-app.

7. Crear `src/clients/vscode/.vscode/launch.json`.
   Configuración F5 / Run Extension con `--extensionDevelopmentPath` de esta carpeta.
   No hay otras configuraciones.

8. Crear `README.md` en first-app.
   VS Code: `pnpm server` si hace falta, abrir `src/clients/vscode/`, F5, comando `First App: Abrir usuarios`; al cerrar VS Code, los mismos pasos.
   Chrome: `pnpm chrome`, cargar `src/clients/chrome/` sin empaquetar, icono del popup.
   No se toca el código de Chrome.

9. Abrir `docs/TREE.md` y `docs/ARCHITECTURE.md`.
   Añadir `README.md` y `src/clients/vscode/` con `package.json`, `extension.js`, `index.html`, `styles.css`, `panel.js` y `.vscode/launch.json`.
   El proceso llama a `src/logic/`; el panel solo habla con ese proceso. Sin puerto nuevo. El README explica VS Code y Chrome.

10. `pnpm run format` y `pnpm run lint` sobre lo tocado.
    No cambia `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes.

11. Desde first-app, `pnpm server` y `pnpm vscode`. Comando `First App: Abrir usuarios` (F5 no hace falta para usar el panel).
    Con datos que se puedan borrar: lista vacía o no, alta, búsqueda exacta por nombre, email e id (un resultado abre el menú; varios por nombre exigen elegir y continuar), edición, borrado con email, fallos de la spec, mismos usuarios que web o Chrome, Tab y Escape.
    Cerrar VS Code y repetir arranque. No hay cliente `.txt` de terminal.
