# mi-primer-proyecto

CRUD de usuarios con la lógica separada de SQLite y de los clientes.

## Servidor de base de datos

Desde esta carpeta:

```powershell
pnpm server
```

Deja el servicio en `http://127.0.0.1:3000`. Los clientes que usan `src/logic/` lo necesitan en marcha, salvo Electron (arranca el servidor solo).

## Clientes

- `pnpm browser` — cliente del navegador (requiere `pnpm server`).
- `pnpm electron` — cliente de escritorio (arranca el servidor).
- `pnpm http` — API REST Express en el puerto 3001.
- `pnpm nest` — API REST Nest en el puerto 3002 (requiere `pnpm server`).

El código de `src/clients/nest/` usa convenciones Nest y no sigue
`docs/STYLE.md` ni `docs/ERRORS.md` por dentro; el resto del proyecto
sí.

## Calidad

```powershell
pnpm format
pnpm lint
```
