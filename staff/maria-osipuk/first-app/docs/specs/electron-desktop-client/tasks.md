Issue: #1009

# Tareas del cliente de escritorio

1. En `package.json`, añade `electron` fijado en `45.2.2` a `devDependencies` con `pnpm add -D -E electron@45.2.2`.
   Añade el script `electron`.
   Comprueba en `pnpm-lock.yaml` que las 13 versiones son las de «Revisión con Socket». Si alguna cambia, para y revísala.

2. En `eslint.config.js`, añade un bloque para `src/clients/electron/app.js` con `document` y `window`.
   Añade otro para `src/clients/electron/preload.cjs`, en CommonJS, con `require` y las mismas reglas.
   `pnpm lint` termina bien.

3. Crea `src/clients/electron/user-actions.js` con las cinco funciones que llaman a `src/logic/`.
   Cada una devuelve `{ data }` o `{ error }`. No importa `electron`.

4. Crea `tests/electron-client.test.js` con un servidor de datos sobre una base temporal.
   Comprueba las cinco funciones, los errores de negocio y el `{ error }` de cada una con el servidor parado.
   `pnpm test` pasa.

5. Crea `src/clients/electron/main.js` y `src/clients/electron/preload.cjs`.
   La ventana usa `contextIsolation`, `sandbox` y sin `nodeIntegration`. Cerrarla termina la aplicación.
   `users:delete` pide la confirmación antes de llamar a la lógica. `window.users` publica solo cinco funciones.

6. Crea `src/clients/electron/index.html`, `app.js` y `styles.css`.
   La página tiene la política de seguridad del plan, la lista a la izquierda y el panel a la derecha.
   `app.js` traduce con su tabla `MESSAGES` y escribe con `textContent`.

7. Con `FIRST_APP_DATABASE_FILE` en una base temporal, arranca el servidor de datos y `pnpm run electron`.
   Recorre el caso correcto de la spec, con cancelar y confirmar el borrado.
   Se ven los datos esperados en cada paso.

8. Recorre los casos que deben fallar de la spec, también con el servidor de datos parado.
   Se ve cada mensaje en español, lo escrito se conserva y `<b>Ada</b>` se ve como texto.

9. Comprueba la base compartida con `pnpm run web` y `pnpm run http` sobre la misma base temporal.
   Lo creado en la ventana se ve en los otros clientes, y al revés.

10. Actualiza `README.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/ERRORS.md` y `docs/STYLE.md`.
    Enmienda `docs/CONSTITUTION.md` con el texto aprobado en el plan.
    Cada guía describe solo lo implementado.

11. Pasa `pnpm exec prettier --write` a los archivos de esta tarea, `pnpm lint` y `pnpm test`.
    Las tres comprobaciones terminan bien y no cambian archivos ajenos.
