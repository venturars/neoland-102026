Issue: #1007

# Tareas del cliente de VS Code

1. En `package.json`, añade el script `vscode` del plan.
   En `eslint.config.js`, añade un bloque para `src/clients/vscode/view.js` con `document`, `window` y `acquireVsCodeApi`.
   `pnpm lint` termina bien y `pnpm-lock.yaml` no cambia.

2. Crea `src/clients/vscode/user-actions.js` con las cinco funciones que llaman a `src/logic/`.
   Cada una devuelve `{ data }` o `{ error }`. No importa `vscode`.

3. Crea `tests/vscode-client.test.js` con un servidor de datos sobre una base temporal.
   Comprueba las cinco funciones, los errores de negocio y el `{ error }` de cada una con el servidor parado.
   `pnpm test` pasa, con `pnpm start` y `pnpm run http` parados.

4. Crea `src/clients/vscode/package.json` y `users.svg`, con los datos de «Manifiesto» del plan.
   El manifiesto no tiene `dependencies` ni `devDependencies`.

5. Crea `src/clients/vscode/extension.js`.
   Exporta `activate`, registra `firstAppUsers.view` y prepara el HTML con `asWebviewUri` y `cspSource`.
   Responde cada mensaje con su `request`. `delete` abre el diálogo modal antes de llamar a `deleteUserAction`.
   Cancelar responde `{ request, cancelled: true }`. Una acción desconocida responde `{ request, error }`.

6. Crea `src/clients/vscode/index.html` y `styles.css`.
   La página tiene la política de seguridad del plan, la pantalla de lista con el alta y la de detalle.
   El texto visible está en español. Los colores salen de las variables `--vscode-*`.

7. Crea `src/clients/vscode/view.js`.
   `call` envía el número `request` y resuelve su promesa. Al abrir, pide la lista.
   Crear, elegir, guardar, volver y borrar siguen la spec. Escribe con `textContent`.
   Traduce con su tabla `MESSAGES`, y un mensaje desconocido muestra la frase genérica.

8. Con `FIRST_APP_DATABASE_FILE` en una base temporal, arranca `pnpm start` y `pnpm run vscode`.
   Recorre el caso correcto de la spec, con cancelar y confirmar el borrado.
   Se ven los datos esperados en cada paso, con el cliente REST parado.

9. Recorre los casos que deben fallar, también guardar y borrar un usuario borrado desde otro cliente.
   Crea un usuario con caracteres HTML en el nombre: se ve como texto.
   Se ven las frases en español de la spec y lo escrito se conserva.

10. Para el servidor de datos y repite listar, ver, crear, guardar y borrar.
    Cada acción muestra su frase y no aparece una lista vacía.
    Oculta la vista y vuelve a mostrarla: empieza por la lista.

11. Sobre la misma base temporal, abre `pnpm run web` y `pnpm run http`.
    Un usuario creado en la extensión aparece en la web y en el cliente REST.
    Un usuario modificado en la web se ve con los datos nuevos en la extensión.

12. Actualiza `README.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/ERRORS.md` y `docs/STYLE.md`, según «Archivos» del plan.
    Añade el cliente a los apartados 1 y 3 de `docs/CONSTITUTION.md`.
    Los enlaces y las rutas nuevas existen.

13. Lanza `pnpm exec prettier --write` solo sobre los archivos de esta tarea, y después `pnpm lint` y `pnpm test`.
    Las dos comprobaciones terminan bien.
    `git status` solo muestra archivos de esta tarea.
