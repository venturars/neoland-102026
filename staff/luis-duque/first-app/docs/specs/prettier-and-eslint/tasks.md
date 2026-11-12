# Tareas — formato y revisión del código

1. Abre `package.json`.
   Añade el script `format`: lanza Prettier sobre el JavaScript de `db`, `queries` y `logic`.
   Añade el script `lint`: lanza ESLint.
   Los dos scripts se pueden leer.

2. Desde `first-app`, pnpm añade `prettier` `3.9.10`, `eslint` `10.13.0` y `@eslint/js` `10.0.1` como `devDependencies`.
   `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano.
   No se usa npm ni yarn.
   `package.json` muestra esas tres versiones.

3. Crea `eslint.config.js`.
   Usa la configuración recomendada de `@eslint/js` sobre los `.js`.
   Ignora `node_modules` y `.venv`. No se crea configuración de Prettier.
   El fichero se puede leer.

4. Abre `AGENTS.MD`.
   Al final, crea el apartado «Al terminar una tarea».
   Dice que, al terminar, se lanzan `pnpm format` y `pnpm lint` desde `first-app`.
   El apartado se puede leer.

5. Abre `docs/TREE.md`.
   El árbol incluye `eslint.config.js`.
   No añade carpetas que no existan.
   El árbol se puede leer.

6. Lee `package.json`, `eslint.config.js`, `AGENTS.MD` y `docs/TREE.md`.
   `format` lanza Prettier y `lint` lanza ESLint.
   «Al terminar una tarea» nombra los dos comandos.
   `logic`, `queries`, `db`, `clients` y `docs/CONSTITUTIONS.MD` siguen igual.
