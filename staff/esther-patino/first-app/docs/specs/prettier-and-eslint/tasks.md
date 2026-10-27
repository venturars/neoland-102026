# Tareas — formato y comprobación del código

1. Desde `staff/esther-patino/first-app`, instala con pnpm Prettier `3.9.10` y ESLint `10.13.0`.
   Quedan en `devDependencies` de `package.json`. `pnpm-lock.yaml` fija esas versiones.
   No se añade fichero de configuración de Prettier.
   Esas dos versiones se leen en `package.json`.

2. Abre `package.json` y añade los scripts `format` y `lint`.
   `format` lanza Prettier y escribe el formato estándar.
   `lint` lanza ESLint.
   Los dos scripts se leen en `package.json`.

3. Crea `eslint.config.js` en la raíz de first-app.
   ESLint avisa de la sintaxis y de las reglas de código en los `.js`.
   No cambia el comportamiento de la app.
   El fichero se lee.

4. Abre `AGENTS.md` de first-app, en `## Al terminar una tarea`.
   Mantén las dos frases del cliente de terminal.
   Añade que, antes de dar la tarea por terminada, se lanza `format` y se lanza `lint`.
   Ese apartado se lee.

5. Abre `docs/style.md`, en `## Comandos`.
   La línea de ejecutar deja de decir que `package.json` no tiene scripts.
   La línea de lint y formato dice que `format` lanza Prettier, sin fichero de configuración, y que `lint` lanza ESLint con `eslint.config.js`.
   Esas líneas se leen.

6. Abre `docs/ARCHITECTURE.md`, en la frase de `package.json`.
   Quita el script `jupyter`.
   Nombra los scripts `format` y `lint`.
   Esa frase se lee.

7. Desde first-app, lanza `pnpm exec prettier --check .` y `pnpm lint`.
   El primero dice si el formato ya es el estándar. `lint` avisa de sintaxis y de reglas.
   No se reescriben a mano los `.js` que ya existían.
   Los dos resultados se ven en la terminal.
