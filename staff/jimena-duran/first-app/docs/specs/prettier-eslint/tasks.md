# Tareas — formato y revisión de código

- [x] Disponer de pnpm e incorporar como dependencias de desarrollo exactas
  `prettier@3.9.10`, `eslint@10.13.0` y `@eslint/js@10.0.1`.
  Actualizar el lockfile y contrastar sus versiones con la revisión de Socket
  del plan; si difieren, actualizar esa revisión antes de continuar.
- [x] Añadir los scripts `format` y `lint` exactamente como indica el plan,
  conservando los demás scripts y dependencias existentes.
- [x] Crear `eslint.config.js` ESM con `defineConfig`, `@eslint/js`,
  exclusiones globales `.venv/**` y `node_modules/**`, y `js/recommended`
  para `**/*.js`, sin otras reglas ni configuración propia de Prettier.
- [x] Actualizar los comandos y el cierre de tareas en `AGENTS.md` para
  ejecutar `pnpm format` y `pnpm lint`, conservando sus demás reglas.
- [x] Añadir la configuración a `docs/TREE.md` y explicar su responsabilidad
  y exclusiones en `docs/ARCHITECTURE.md`, sin modificar otras guías.
- [x] Ejecutar formato dos veces y comprobar que la segunda no cambia nada;
  ejecutar lint y revisar enlaces y diff. Si hacen falta cambios fuera del
  alcance aprobado, registrar el caso antes de realizarlos.

Verificado con pnpm 10.33.0 mediante Corepack: las 69 versiones coinciden con
la revisión de Socket; formato idempotente, lint sin errores y enlaces válidos.
Sin cambios en el JavaScript existente, SQL ni base de datos. Sin commit ni push.
