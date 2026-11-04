# Plan — cliente VS Code

Issue: #969.

Cliente nuevo en `src/clients/vscode/`, independiente de
`src/clients/browser/`. WebviewView en la barra lateral. `extension.cjs`
(CommonJS) importa con `import()` los módulos ESM de `src/logic/`:
`listUsers`, `createUser`, `findUserById`, `updateUser`, `deleteUser`.
La webview envía mensajes; no repite reglas de negocio.

Búsqueda sin módulos nuevos: por nombre y email filtra el resultado de
`listUsers()` (nombre exacto con mayúsculas; email normalizado); por id
llama a `findUserById`. Borrar exige email guardado en el cliente antes
de `deleteUser({ id })`.

El servidor SQLite se ejecuta aparte (`pnpm server` desde
mi-primer-proyecto). Abrir `src/clients/vscode` en VS Code y F5
(Extension Development Host). `launch.json` con
`--extensionDevelopmentPath=${workspaceFolder}`.

Ficheros nuevos: `package.json`, `extension.cjs`, `panel.html`,
`panel.css`, `panel.js`, `.vscode/launch.json`. Tocan `package.json`
(format), `eslint.config.js`, `docs/ARCHITECTURE.md`, `docs/TREE.md`,
`README.md` (nuevo).

Paquetes npm: ninguno. Socket no aplica.

Errores: los de la spec; `error.message` en pantalla. Confirmación de
email distinta: texto en español en el panel, sin llamar a la lógica.

Verificación: copia con datos ficticios; prueba manual en F5; `pnpm
format` y `pnpm lint`.
