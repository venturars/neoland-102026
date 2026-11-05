# Plan · Cliente de escritorio Electron

Issue: #951.

Paquete nuevo: `electron@45.2.2` en `devDependencies`, versión exacta. El cliente nuevo vive en `src/clients/electron/` y no reutiliza ficheros de `src/clients/browser/`.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/electron-desktop-client/spec.md`, `plan.md`, `tasks.md` |
| Crear | `src/clients/electron/main.js`, `index.html`, `app.js`, `styles.css`, `README.md` |
| Tocar | `package.json` (script `electron`, `devDependencies`, glob `format`) |
| Tocar | `eslint.config.js` (globales en `electron/`) |
| Tocar | `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STARTUP.md`, `AGENTS.md` |

No se toca: `src/logic/**`, `src/queries/**`, `src/db/server.js`, clientes existentes.

## Comportamiento

- `main.js`: módulo ES, ventana 800×600, `loadFile` del `index.html` contiguo.
- `app.js`: importa `createUser`, `listUsers`, `findUserById`, `updateUser`, `deleteUser` desde `../../logic/`.
- Script: `"electron": "electron src/clients/electron/main.js"`. No arranca el servidor SQL; hace falta `pnpm server` en paralelo (ver `docs/STARTUP.md`).

## Árbol npm (3 capas)

```text
electron@45.2.2
  @electron-internal/extract-zip@1.0.8
  @electron/get@5.1.0
    debug@4.4.3 -> ms@2.1.3
    env-paths@3.0.0
    graceful-fs@4.2.11
    progress@2.0.3
    semver@7.8.6
    sumchecker@3.0.1 -> debug@4.4.3
  @types/node@24.19.2
    undici-types@7.24.6
```

`@electron/get` declara `undici` opcional; no se añade como dependencia directa.

## Validación Socket

Organización OAuth: `miguelturra` (plan free). `alerts` con `artifact_name` electron y estado open: lista vacía en el inventario monitorizado (no garantiza ausencia fuera del inventario). `threat_feed`: plan free sin acceso; campañas no verificables (`n/d (plan free)`).

`depscore` con plataforma `win32-x64`. Columnas: license, maintenance, quality, supplyChain, vulnerability. Ninguna puntuación inferior a 50.

| capa | paquete@versión | campaña | alertas | license | maintenance | quality | supplyChain | vulnerability | stats < 50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | electron@45.2.2 | n/d (plan free) | no | 100 | 97 | 99 | 99 | 100 | ninguna |
| 1 | @electron-internal/extract-zip@1.0.8 | n/d (plan free) | no | 100 | 94 | 98 | 95 | 100 | ninguna |
| 1 | @electron/get@5.1.0 | n/d (plan free) | no | 100 | 82 | 100 | 99 | 100 | ninguna |
| 1 | @types/node@24.19.2 | n/d (plan free) | no | 100 | 96 | 80 | 100 | 100 | ninguna |
| 2 | debug@4.4.3 | n/d (plan free) | no | 100 | 81 | 100 | 99 | 100 | ninguna |
| 2 | env-paths@3.0.0 | n/d (plan free) | no | 100 | 80 | 99 | 100 | 100 | ninguna |
| 2 | graceful-fs@4.2.11 | n/d (plan free) | no | 100 | 79 | 100 | 99 | 100 | ninguna |
| 2 | progress@2.0.3 | n/d (plan free) | no | 100 | 75 | 99 | 100 | 100 | ninguna |
| 2 | semver@7.8.6 | n/d (plan free) | no | 100 | 95 | 100 | 100 | 100 | ninguna |
| 2 | sumchecker@3.0.1 | n/d (plan free) | no | 100 | 75 | 98 | 99 | 100 | ninguna |
| 3 | ms@2.1.3 | n/d (plan free) | no | 100 | 84 | 86 | 100 | 100 | ninguna |
| 3 | undici-types@7.24.6 | n/d (plan free) | no | 100 | 96 | 74 | 100 | 100 | ninguna |

Instalación prevista: `pnpm add -D electron@45.2.2 --save-exact` desde first-app, solo tras aprobar spec y plan.

## Verificación

Manual según spec (Ada / Ada Lovelace / errores). `pnpm format` y `pnpm lint` en first-app.
