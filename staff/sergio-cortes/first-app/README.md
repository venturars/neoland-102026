# first-app

App de usuarios del curso IA Engineer (SDD). Los clientes comparten la misma base (`src/db/users.sqlite`) y las operaciones de `src/logic/`.

## Base de datos

Desde la raíz de first-app:

```bash
pnpm server
```

Deja el servidor en `http://127.0.0.1:3000`. Muchos clientes lo necesitan en marcha.

## Cliente VS Code

1. En una terminal, desde **first-app**: `pnpm server` (si el puerto 3000 está libre).
2. En otra terminal, también desde **first-app**: `pnpm vscode`. Se abre VS Code en `src/clients/vscode` con la extensión en modo desarrollo.
3. En esa ventana de VS Code (no hace falta **F5**): Paleta de comandos → **`First App: Abrir usuarios`**. El panel queda como pestaña de editor.

Tras cerrar VS Code, repite los mismos pasos. **F5** solo hace falta si quieres depurar la extensión con breakpoints; para usar el panel, basta con los pasos de arriba.

## Cliente Chrome

1. Desde first-app: `pnpm chrome`. Si el puerto 3000 está libre, arranca la base; si ya está (`pnpm server`), la reutiliza. Fastify queda en `http://127.0.0.1:3002`.
2. En Chrome: **Extensiones** → **Gestionar extensiones** → **Cargar descomprimida** → carpeta `src/clients/chrome/`.
3. Pulsa el icono de la extensión para abrir el popup.

## Otros comandos

- `pnpm web` — cliente en Brave
- `pnpm http` — API Express en el puerto 3001
- `pnpm electron` — ventana de escritorio
- `pnpm vscode` — VS Code con la extensión en modo desarrollo
- `pnpm jupyter` — cuadernos en `src/clients/jupyter/`
- `pnpm run format` / `pnpm run lint`
