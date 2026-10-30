# Tareas — script de Jupyter multiplataforma

1. Crear `scripts/jupyter.sh` según el plan. El fichero es ejecutable y entra
   en la raíz de first-app al arrancar.

2. En `package.json`, dejar el script `jupyter` como `sh scripts/jupyter.sh`.
   Quitar la línea inline actual.

3. Actualizar `docs/TREE.md`, `docs/ARCHITECTURE.md` y el apartado de arranque
   de `docs/specs/jupyter-client/plan.md` para describir `scripts/jupyter.sh`.

4. Ejecutar `pnpm run format` y `pnpm run lint` desde first-app.

5. Comprobar `pnpm run jupyter` en Mac (o anotar si no hay entorno). Dejar
   pendiente la validación en Windows y Linux si no se pueden ejecutar aquí.
