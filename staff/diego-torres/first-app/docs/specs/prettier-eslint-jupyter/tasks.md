# Tareas — formato, lint y Jupyter en Linux y Windows

1. Abre `package.json`.
   Añade las `devDependencies` de «Paquetes» con la versión exacta.
   Añade `format` y `lint`, y cambia `jupyter`, como dice «Scripts».
   Las `dependencies` y `test` no cambian.

2. En `first-app`, ejecuta `pnpm install`.
   `pnpm-lock.yaml` se actualiza.
   Las versiones siguen siendo 3.9.10, 10.13.0 y 10.0.1.

3. Crea `eslint.config.js`.
   El texto es el de «ESLint».
   Ignora `.venv` y `node_modules`. Las reglas son las recomendadas.

4. Crea `scripts/jupyter.js`.
   Sigue los pasos de «Jupyter», en ese orden.
   La versión de `notebook` vive en una constante y vale `7.6.3`.

5. Abre `AGENTS.md`.
   Cambia las frases de «Proyecto» y «Comandos» como dice «AGENTS.md».
   El resto de la guía no cambia.

6. Comprueba en Windows.
   `pnpm lint` termina sin errores.
   `pnpm jupyter` sin `.venv` lo crea e instala `notebook`. La segunda vez no instala nada.
   El resultado queda en «Comprobaciones».

7. Comprueba en Linux.
   Los mismos pasos de la tarea 6, en una máquina Linux real.
   Hasta entonces sigue en «Pendiente».
