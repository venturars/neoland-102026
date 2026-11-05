# mi-primer-proyecto

CRUD de usuarios con la lógica separada de SQLite y de los clientes.

## Servidor de base de datos

Desde esta carpeta:

```powershell
corepack pnpm server
```

Deja el servicio en `http://127.0.0.1:3000`. Los clientes que usan `src/logic/` lo necesitan en marcha, salvo Electron (arranca el servidor solo).

## Cliente VS Code

1. Mantén `corepack pnpm server` en una terminal desde `mi-primer-proyecto`.
2. En VS Code, **Archivo → Abrir carpeta** y elige `src/clients/vscode` (no la raíz del proyecto).
3. Pulsa **F5** (configuración «Ejecutar extensión Usuarios») para abrir una ventana **Extension Development Host**.
4. En esa ventana, abre el icono **Usuarios** en la barra de actividad o ejecuta **Mi primer proyecto: Abrir usuarios** en la paleta de comandos (`Ctrl+Shift+P`).

Para volver a usar el panel después de cerrar VS Code: repite los pasos 2–4. Los datos siguen en `src/db/users.sqlite` mientras el servidor esté activo.

## Extensión de Chrome

Desde `mi-primer-proyecto`, deja dos terminales abiertas:

```powershell
corepack pnpm server
corepack pnpm chrome
```

La base escribe `http://127.0.0.1:3000`. La API escribe `http://127.0.0.1:3002`.

Chrome no carga esta extensión desde la terminal. Ábrela así:

1. Entra en `chrome://extensions`.
2. Activa el modo de desarrollador.
3. Pulsa **Cargar extensión sin empaquetar** y elige `src/clients/chrome`.
4. Abre el icono **Usuarios**.

## Otros clientes

- `corepack pnpm browser` — cliente del navegador (requiere `pnpm server`).
- `corepack pnpm electron` — cliente de escritorio (arranca el servidor).
- `corepack pnpm http` — API REST Express en el puerto 3001.
- `corepack pnpm node-http` — API REST con `node:http` en el puerto **3004** (requiere `pnpm server`).
- `corepack pnpm node-http-jupyter` — notebooks de esa API (requiere `pnpm server` y `pnpm node-http`).
- `corepack pnpm nest` — API Nest en el puerto **3003** (requiere `pnpm server`).

El código de `src/clients/nest/` usa convenciones Nest y no sigue
`docs/STYLE.md` ni `docs/ERRORS.md` por dentro; el resto del proyecto
sí.

## Calidad

```powershell
corepack pnpm format
corepack pnpm lint
```
