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

## Cliente HTTP con Bruno

La colección vive en `src/clients/http/bruno/`. Prueba la API Express (`http://127.0.0.1:3001`) con el CLI de Bruno instalado en el proyecto (`@usebruno/cli`).

### Carpeta online (`01-sql-online`)

1. Desde **first-app**, con la **lista de usuarios vacía**, arranca la base y el cliente HTTP:
   - `pnpm server` (puerto 3000), o deja que `pnpm http` la arranque si el 3000 está libre.
   - `pnpm http` — la consola debe mostrar `http://127.0.0.1:3001`.
2. En otra terminal, también desde **first-app**: `pnpm bruno`.

   Eso ejecuta `bru run 01-sql-online -r` dentro de la colección. Las peticiones llevan bloques `tests { }`; al final deberías ver todas en verde.

### Carpeta offline (`02-sql-offline`)

Comprueba los `Could not …` cuando la base no responde:

1. Deja **solo** el cliente HTTP en marcha (`pnpm http` en 3001).
2. Para el servidor de la base (`pnpm server` / puerto 3000).
3. Desde `src/clients/http/bruno`:

```bash
../../../../node_modules/.bin/bru run 02-sql-offline -r
```

(La ruta es relativa a esa carpeta; desde **first-app** puedes usar el mismo `bru` que en el script `bruno`.)

También puedes abrir la colección en la [app de Bruno](https://www.usebruno.com/) apuntando a `src/clients/http/bruno/`.

## Otros comandos

- `pnpm web` — cliente en Brave
- `pnpm http` — API Express en el puerto 3001
- `pnpm bruno` — ejecuta la carpeta online de la colección Bruno
- `pnpm electron` — ventana de escritorio
- `pnpm vscode` — VS Code con la extensión en modo desarrollo
- `pnpm jupyter` — cuadernos en `src/clients/jupyter/`
- `pnpm run format` / `pnpm run lint`
