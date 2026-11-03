# Tareas — página de usuarios en el navegador

Issue: #843.

1. Borra [src/clients/http/](../../../src/clients/http/). En
   [package.json](../../../package.json) quita `"start"` y añade `"web"` (Brave,
   plan). Deja `server`, `jupyter`, `format`, `lint` y `test`.

2. Deja en [src/clients/web/](../../../src/clients/web/) solo
   [index.html](../../../src/clients/web/index.html),
   [styles.css](../../../src/clients/web/styles.css) y
   [app.js](../../../src/clients/web/app.js). En `app.js`, importa
   `listUsers`, `findUserById`, `updateUser` y `deleteUser`; enlaza pantallas,
   popover con `deleteEmailMatches` / `syncDeleteConfirmButton`, y
   `initializeClient`. Borra el resto de `.js` de `web/`.

3. En [index.html](../../../src/clients/web/index.html), rutas relativas a
   `styles.css` y `app.js`. Popover: label e input de email; confirmar con
   `disabled`.

4. En [eslint.config.js](../../../eslint.config.js), quita el bloque de
   `src/clients/http/`.

5. Actualiza [docs/ARCHITECTURE.md](../../ARCHITECTURE.md),
   [docs/TREE.md](../../TREE.md), [docs/STYLE.md](../../STYLE.md) y
   [AGENTS.md](../../../AGENTS.md) como indica el plan.

6. Con `pnpm server` en marcha, `pnpm web`. Comprueba la spec: lista, menú,
   editar, popover (email incorrecto → confirmar deshabilitado; email correcto
   sin importar mayúsculas → borrado y lista).

7. `pnpm run format` y `pnpm run lint` sin errores.
