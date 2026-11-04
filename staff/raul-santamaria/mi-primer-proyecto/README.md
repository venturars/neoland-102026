# mi-primer-proyecto

CRUD de usuarios con la lógica separada de SQLite y de los clientes.

## Servidor de base de datos

Desde esta carpeta:

```powershell
pnpm server
```

Deja el servicio en `http://127.0.0.1:3000`. Los clientes que usan `src/logic/` lo necesitan en marcha, salvo Electron (arranca el servidor solo).

## Cliente VS Code

1. Mantén `pnpm server` en una terminal desde `mi-primer-proyecto`.
2. En VS Code, **Archivo → Abrir carpeta** y elige `src/clients/vscode` (no la raíz del proyecto).
3. Pulsa **F5** (configuración «Ejecutar extensión Usuarios») para abrir una ventana **Extension Development Host**.
4. En esa ventana, abre el icono **Usuarios** en la barra de actividad o ejecuta **Mi primer proyecto: Abrir usuarios** en la paleta de comandos (`Ctrl+Shift+P`).

Para volver a usar el panel después de cerrar VS Code: repite los pasos 2–4. Los datos siguen en `src/db/users.sqlite` mientras el servidor esté activo.

## Otros clientes

- `pnpm browser` — cliente del navegador (requiere `pnpm server`).
- `pnpm electron` — cliente de escritorio (arranca el servidor).
- `pnpm http` — API REST en el puerto 3001.

## Calidad

```powershell
pnpm format
pnpm lint
```
