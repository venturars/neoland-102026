# Plan: búsqueda en web, Electron y Chrome

Issue: #1029 · PR: #1030. Parte de la [spec](spec.md) aprobada.

## Objetivo

Añadir el panel «Buscar usuario» en la primera pantalla de `src/clients/web/`, `src/clients/electron/` y `src/clients/chrome/`, reutilizando el HTML/CSS de web (como VS Code) y la lógica de `searchUsers` del cliente VS Code (`panel.js` / `extension.js`) como referencia de comportamiento.

## Decisiones

1. **UI:** Tercer panel en `selection-screen`, entre lista y alta (mismo orden que VS Code: lista, búsqueda, alta). Copiar el bloque de `src/clients/vscode/index.html` (o el equivalente ya usado en #1018 si está en otra rama) a `web/index.html` y `chrome/index.html`. Electron usa el mismo HTML que web en su carpeta.
2. **Web y Electron:** Importar `findUserByName`, `findUserByEmail` y reutilizar `parseUserId` + `findUserById` en `app.js`. Función `searchUsers` alineada con VS Code: 0 → desplegable vacío; 1 → `rememberSelectedUser` + `showUserMenu()`; varios → `fillUserSelect` + mensaje para elegir y Continuar.
3. **Chrome:** El popup no importa lógica. Añadir en `server.js` rutas GET que llamen a la misma lógica (p. ej. búsqueda por query: nombre devuelve array JSON; email e id devuelven un usuario o el error HTTP que ya use el manejador). En `popup.js`, funciones `fetch` equivalentes y la misma `searchUsers` que web, adaptada a promesas API.
4. **Errores:** Validación y `User not found` en email/id se muestran como en el resto del cliente (`showMessage` con el texto de error). Búsqueda por nombre sin filas: lista vacía, sin error.
5. **Documentación:** Actualizar `docs/ARCHITECTURE.md` (y `docs/TREE.md` solo si cambia el árbol) para describir búsqueda en web, electron y chrome. No tocar README salvo que la spec lo pida (fuera).
6. **Nombre y email sin distinguir mayúsculas:** En `find-by-name.sql` y `find-by-email.sql`, comparar con `LOWER(columna) = LOWER(:param)`. Texto del panel en `index.html` de web, Electron y Chrome (mismo copy que VS Code). Reiniciar `pnpm server` tras cambiar los `.sql`.
7. **Dependencias:** Sin paquetes npm nuevos.

## Validación Socket

No se añaden dependencias npm. No aplica revisión Socket en este plan.

## Ficheros previstos

| Área | Ficheros |
|------|----------|
| Web | `index.html`, `app.js` |
| Electron | `index.html`, `app.js` (mismo cambio que web si los ficheros son paralelos) |
| Chrome | `index.html`, `popup.js`, `server.js` |
| Queries | `src/queries/queries/find-by-name.sql`, `find-by-email.sql` |
| Docs | `docs/ARCHITECTURE.md`, `docs/specs/user-search-web-electron-chrome/spec.md` |
| SDD | `tasks.md` tras aprobar spec y plan |

## Comprobación

Pasos de la issue #1029 en los tres clientes; `pnpm run format` y `pnpm run lint` desde first-app.

## Preguntas abiertas

Ninguna respecto a constitución, código y spec: el comportamiento es el de VS Code (#1018) aplicado a clientes que aún no tienen el bloque de búsqueda.
