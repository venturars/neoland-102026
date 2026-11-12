# Tareas — formato y lint

1. Abrir `package.json`.
   Añadir las `devDependencies` del apartado «Paquetes».
   Añadir los scripts del apartado «Scripts».
   No cambiar las `dependencies` que ya están.

2. Instalar en `first-app`.
   El comando actualiza `pnpm-lock.yaml`.
   Las versiones quedan en 3.9.10, 10.13.0 y 10.0.1.
   `jiti` no se instala.

3. Crear `eslint.config.js`.
   El texto es el del apartado «ESLint».
   Ignora `.venv` y `node_modules`.
   Las reglas son las recomendadas.

4. Abrir `docs/TREE.md`.
   Añadir `eslint.config.js` como dice «Árbol».
   El resto del árbol sigue igual.
   No se añaden más ficheros.

5. Abrir `docs/ARCHITECTURE.md`.
   Añadir el punto del apartado «Arquitectura».
   El resto de los puntos sigue igual.
   No se repite el árbol.

6. Abrir `AGENTS.md` de first-app.
   La línea de lint queda como dice «AGENTS.md».
   Se añaden los dos puntos de «Al terminar una tarea».
   Los dos puntos de ahora se conservan.

7. Comprobar.
   En `first-app`, `pnpm format` termina bien.
   `pnpm lint` termina bien.
   `.venv` no cambia.
