# mi-primer-proyecto

CRUD de usuarios con la lógica separada de SQLite y de los clientes.

## Servidor de base de datos

Desde esta carpeta:

```powershell
corepack pnpm server
```

Deja el servicio en `http://127.0.0.1:3000`. Los clientes que usan `src/logic/` lo necesitan en marcha, salvo Electron (arranca el servidor solo).

## Clientes

- `corepack pnpm browser` — página en Chrome (requiere `pnpm server`).
- `corepack pnpm electron` — escritorio (arranca el servidor).
- `corepack pnpm http` — API Express en el puerto 3001.
- `corepack pnpm chrome` — API Fastify para la extensión en el puerto **3002**.
- `corepack pnpm nest` — API Nest en el puerto **3003** (requiere `pnpm server`).

El código de `src/clients/nest/` usa convenciones Nest y no sigue
`docs/STYLE.md` ni `docs/ERRORS.md` por dentro; el resto del proyecto
sí.

## Extensión de Chrome

Con `corepack pnpm server` y `corepack pnpm chrome` en marcha (API en
3002):

1. Abre `chrome://extensions`.
2. Activa el modo de desarrollador.
3. **Cargar extensión sin empaquetar** → carpeta `src/clients/chrome`.
4. Pulsa el icono **Usuarios** en la barra.

## Calidad

```powershell
corepack pnpm format
corepack pnpm lint
```
