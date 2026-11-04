# Tasks: Cliente de extensión de Chrome

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. El paquete
- [x] `pnpm add fastify@5.12.8 --save-exact`, sin `pnpm-workspace.yaml` ni excepciones.
- [x] Comprobar que `package.json` tiene `"fastify": "5.12.8"` en `dependencies` y que `pnpm-lock.yaml` cambió.

## T2. La API
- [x] Generar la clave de la extensión y calcular su id. Guardar solo la parte pública.
- [x] Crear `src/clients/chrome/server.js` como dice el plan, con `EXTENSION_ORIGIN` de ese id.
- [x] Añadir a `package.json` el script `chrome` y `src/clients/chrome/**/*.{js,html,css,json}` al script `format`.

## T3. La extensión
- [x] Crear `src/clients/chrome/extension/manifest.json` con la clave, el permiso y la CSP.
- [x] Crear `popup.html`, `styles.css` y `popup.js` como dice el plan.
- [x] `eslint.config.js`: `document` también en `src/clients/chrome/extension/**/*.js`.

## T4. Comprobación
- [x] Guardar la salida de `list-users.txt` antes de empezar.
- [x] La API con `curl` y `tmp-998-1`: rutas, códigos, errores, `Origin` ajeno y base parada.
- [x] La extensión con CDP y `tmp-998-2`: el recorrido completo, los errores, API parada, base parada y la CSP.
- [x] El id de la extensión cargada es el de `EXTENSION_ORIGIN`.
- [x] No queda ningún `tmp-998-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores.

## T5. Guías
- [x] `ARCHITECTURE.md`: los ficheros nuevos y la sección del cliente de extensión, con sus rutas y sus códigos.
- [x] `TREE.md`: `src/clients/chrome/`.
- [x] `AGENTS.md`: el comando `pnpm chrome`, con `pnpm db` antes, y cómo cargar la extensión.
- [x] `ERRORS.md`: el mensaje de API parada, que es de la extensión.
