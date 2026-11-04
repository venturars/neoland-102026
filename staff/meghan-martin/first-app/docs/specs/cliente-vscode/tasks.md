# Tasks

La spec y el plan ya están leídos.

1. Crear `src/clients/vscode/package.json` con el comando `First App: Open People`. No se instala ningún paquete.
2. Crear `extension.cjs`. Abre el panel y llama a `listUsers`, `findUserByEmail`, `findUserById`, `createUser`, `updateUser` y `deleteUser`.
3. Crear `panel.html`, `panel.js` y `panel.css`. `panel.js` solo manda mensajes.
4. Crear `src/clients/vscode/.vscode/launch.json` para pulsar F5 en esa carpeta.
5. Incluir esos JavaScript en `format` y en `eslint.config.js`. `package.json` no gana dependencias.
6. Nombrar el cliente en la constitución, la arquitectura, el árbol, `AGENTS.md` y `README.md`, con cómo volver a abrirlo.
7. Con `npm run db` en marcha, pulsar F5 y probar una persona temporal: alta, `Ana` distinto de `ana`, un email que no vale, un número que no vale, cambio, confirmación distinta y borrado. Luego `npm run format` y `npm run lint`. Quitar a esa persona.
