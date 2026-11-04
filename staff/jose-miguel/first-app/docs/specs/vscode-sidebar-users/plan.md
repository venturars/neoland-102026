# Plan · Extensión VS Code panel lateral de usuarios

Issue: #986.

Cliente nuevo en `src/clients/vscode/` con manifest propio (`package.json` de extensión, `type: module`, `main: extension.js`). Import directo de `src/logic/` desde el extension host. Webview lateral (`WebviewViewProvider`) + comando de paleta para enfocar la vista. Sin cambios en el `package.json` raíz de first-app (sin dependencias npm nuevas en raíz).

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/vscode-sidebar-users/spec.md`, `plan.md`, `tasks.md` |
| Crear | `src/clients/vscode/package.json`, `extension.js`, `index.html`, `panel.js`, `styles.css`, `README.md`, `.vscode/launch.json` |
| Tocar | `eslint.config.js` (globales en `panel.js`) |
| Tocar | glob `format` en `package.json` raíz → `src/clients/vscode/**/*.js` |
| Tocar | `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STARTUP.md`, `AGENTS.md` |

No se toca: `src/logic/**`, `src/queries/**`, `src/db/server.js`, clientes existentes salvo docs transversales.

## Comportamiento

- `extension.js`: registra vista `firstAppJm.usersPanel` en contenedor de activity bar; maneja mensajes `list`, `create`, `searchName`, `searchEmail`, `searchId`, `update`, `delete` (con validación de email de confirmación en el host).
- `panel.js`: UI en español; protocolo request/response; lista ordenada por id; detalle con edición; borrado con campo de confirmación; banner de fallo de conexión + reintentar.
- Depuración: abrir carpeta `src/clients/vscode` en VS Code, `pnpm server` en first-app, F5.

## Paquetes

No hay paquetes nuevos en el `package.json` raíz. Validación Socket: no aplica.

## Verificación

Checklist de la issue; `pnpm format` y `pnpm lint` en first-app.
