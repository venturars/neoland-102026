# Plan — cliente Electron

Issue: #899.

Cliente nuevo en `src/clients/electron/`, independiente de
`src/clients/browser/`. Mismo comportamiento que la spec del browser
(#864): importa `listUsers`, `updateUser` y `deleteUser` desde
`../../logic/` con `type="module"`. UI propia (estilos de escritorio).

El proceso main de Electron arranca `src/db/server.js` con
`ELECTRON_RUN_AS_NODE=1` y `process.execPath`, espera a
`http://127.0.0.1:3000`, abre `BrowserWindow` con `loadFile` de
`index.html`, y mata el hijo al cerrar la app. `contextIsolation: true`,
`nodeIntegration: false`.

Scripts en `package.json`: `electron` (`electron .`), `electron:dist`
(`electron-builder --win`). Campo `main`:
`src/clients/electron/main.js`. Bloque `build` para NSIS en Windows.

Tras `pnpm install`, si falta el binario de Electron, ejecutar
`node node_modules/electron/install.js` (pnpm 12 puede ignorar el script
de postinstall hasta aprobar builds).

## Paquetes y Socket

Versiones: `electron@45.2.2`, `electron-builder@26.18.0` (dev).

`electron@45.2.2` (depscore): license 100, maintenance 97, quality 99,
supplyChain 99, vulnerability 100.

`electron-builder@26.18.0` (depscore): license 100, maintenance 98,
quality 68, supplyChain 99, vulnerability 100.

`alerts` (`org_slug` `ai-engineering`): la organización no existe en
Socket (404). No hay lista de alertas de org.

`threat_feed` (`org_slug` `ai-engineering`): 404, organización no
encontrada.

## Ficheros

Crean: `src/clients/electron/main.js`, `index.html`, `app.js`,
`styles.css`, `docs/specs/electron-client/spec.md`, `plan.md`, `tasks.md`.

Tocan: `package.json`, `pnpm-lock.yaml`, `eslint.config.js`,
`docs/ARCHITECTURE.md`, `docs/TREE.md`.

## Errores

Los de la spec; mensajes en `docs/ERRORS.md`. El renderer muestra
`error.message` en pantalla.
