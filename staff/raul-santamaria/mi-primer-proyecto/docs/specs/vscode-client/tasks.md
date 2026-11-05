# Tareas — cliente VS Code

Issue: #969.

- [x] 1. Crear `src/clients/vscode/package.json`, `extension.cjs` y `.vscode/launch.json`. Registrar la vista lateral y comprobar activación con F5.
- [x] 2. Implementar el protocolo de mensajes y las llamadas a `listUsers` y `createUser`. Comprobar lista y creación con el servidor activo.
- [x] 3. Crear `panel.html`, `panel.css` y `panel.js` con listado, estado vacío en español y formulario de creación.
- [x] 4. Añadir búsqueda por nombre, email e id según el plan. Comprobar sin resultados e id inválido.
- [x] 5. Añadir edición con `updateUser({ id, name, email })` y mensajes de error conservando campos.
- [x] 6. Añadir borrado con confirmación por email y cancelación.
- [x] 7. Revisar foco y uso con teclado en botones e inputs.
- [x] 8. Actualizar `docs/ARCHITECTURE.md`, `docs/TREE.md` y `README.md`.
- [x] 9. Ampliar `eslint.config.js` y el script `format` de `package.json`. Ejecutar `pnpm format` y `pnpm lint`.
- [x] 10. Probar con datos ficticios, otro cliente y servidor detenido. Documentar reapertura tras cerrar VS Code.
