# Tareas — Prettier y ESLint

## 1. Instalar las herramientas

Desde `first-app`, añadir Prettier `3.9.10` y ESLint `10.13.0` como dependencias de desarrollo exactas.
Comprobar que `package.json` y `pnpm-lock.yaml` contienen esas versiones.

## 2. Añadir los comandos

Abrir `package.json` y añadir los scripts `format` y `lint`.
Crear `.prettierignore` para excluir `.venv/`, `node_modules/` y `pnpm-lock.yaml`.
Comprobar que los scripts lanzan Prettier y ESLint respectivamente.

## 3. Configurar ESLint

Crear `eslint.config.js` en la raíz de `first-app`.
Ignorar el entorno y las dependencias, analizar los `.js` y activar las reglas del plan.

## 4. Actualizar el cierre de tareas

Abrir `AGENTS.md` y crear el apartado «Al terminar una tarea».
Indicar que se ejecutan `pnpm format` y `pnpm lint` antes de darla por terminada.

## 5. Sincronizar las guías

Documentar los comandos en `docs/STYLE.md`.
Añadir la configuración y los scripts a `docs/ARCHITECTURE.md`, y los nuevos ficheros a `docs/TREE.md`.

## 6. Comprobar

Ejecutar `pnpm format`, `pnpm lint` y `pnpm exec prettier --check .`.
Ejecutar `git diff --check` y revisar que no haya cambios ajenos al pedido.

## 7. Revisar la Constitución

Comparar el resultado con `docs/CONSTITUTION.md`.
Actualizarla solo si el estado real cambia en alguno de los puntos que gobierna.
