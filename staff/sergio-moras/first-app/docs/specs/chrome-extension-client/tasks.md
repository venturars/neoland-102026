# Tasks: Cliente de extensión de Chrome

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. El paquete
- [ ] `pnpm add fastify@5.12.8 --save-exact`, sin `pnpm-workspace.yaml` ni excepciones.
- [ ] Comprobar que `package.json` tiene `"fastify": "5.12.8"` en `dependencies` y que `pnpm-lock.yaml` cambió.

## T2. La API
- [ ] Generar la clave de la extensión y calcular su id. Guardar solo la parte pública.
- [ ] Crear `src/clients/chrome/server.js` como dice el plan, con `EXTENSION_ORIGIN` de ese id.
- [ ] Añadir a `package.json` el script `chrome` y `src/clients/chrome/**/*.{js,html,css,json}` al script `format`.

## T3. La extensión
- [ ] Crear `src/clients/chrome/extension/manifest.json` con la clave, el permiso y la CSP.
- [ ] Crear `popup.html`, `styles.css` y `popup.js` como dice el plan.
- [ ] `eslint.config.js`: `document` también en `src/clients/chrome/extension/**/*.js`.

## T4. Comprobación
- [ ] Guardar la salida de `list-users.txt` antes de empezar.
- [ ] La API con `curl` y `tmp-998-1`: rutas, códigos, errores, `Origin` ajeno y base parada.
- [ ] La extensión con CDP y `tmp-998-2`: el recorrido completo, los errores, API parada, base parada y la CSP.
- [ ] El id de la extensión cargada es el de `EXTENSION_ORIGIN`.
- [ ] No queda ningún `tmp-998-*` y `list-users.txt` da lo mismo que al empezar.
- [ ] `pnpm format` y `pnpm lint` sin errores.

## T5. Guías
- [ ] `ARCHITECTURE.md`: los ficheros nuevos y la sección del cliente de extensión, con sus rutas y sus códigos.
- [ ] `TREE.md`: `src/clients/chrome/`.
- [ ] `AGENTS.md`: el comando `pnpm chrome`, con `pnpm db` antes, y cómo cargar la extensión.
- [ ] `ERRORS.md`: el mensaje de API parada, que es de la extensión.
