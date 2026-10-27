# Tareas — formato y lint

- [x] 1. Abrir `package.json` y añadir `eslint` `10.13.0` y `@eslint/js` `10.0.1` en `devDependencies`, más el script `lint`. `prettier` y `format` se conservan.
- [x] 2. Instalar en `mi-primer-proyecto`. Quedan las versiones del plan. `jiti` no se instala. Se actualiza `pnpm-lock.yaml`.
- [x] 3. Crear `eslint.config.js` con el texto del plan. Ignora `.venv` y `node_modules`. Reglas recomendadas.
- [x] 4. Abrir `docs/TREE.md` y añadir `eslint.config.js` en la raíz. El resto del árbol sigue igual.
- [x] 5. Abrir `docs/ARCHITECTURE.md` y añadir el punto del plan sobre `eslint.config.js`. El resto sigue igual.
- [x] 6. Abrir `AGENTS.md`: Comandos con `pnpm format` y `pnpm lint`; al terminar, lanzar los dos. Se conserva el cliente `.txt`.
- [x] 7. Comprobar: `pnpm format` y `pnpm lint` terminan bien. No hay `.prettierrc`. `logic/`, `queries/` y `db/` sin cambios de reglas.
