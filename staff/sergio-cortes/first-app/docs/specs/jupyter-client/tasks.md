# Tareas — cliente Jupyter

1. Abre [docs/CONSTITUTIONS.md](../../CONSTITUTIONS.md). En `clients/jupyter/` deja solo los ocho cuadernos. Quita `bridge.py`, `requirements.txt`, Python y `rich`.

2. Abre [package.json](../../../package.json). Añade el script `jupyter`: crea `.venv` si falta, instala `notebook==7.6.3` si no está `jupyter-notebook`, y abre `clients/jupyter`. Añade `cli-table3` `0.6.5` y `@colors/colors` `1.6.1` con pnpm. No cambies `test`.

3. Borra `clients/jupyter/bridge.py` y `clients/jupyter/requirements.txt`.

4. Reescribe los ocho cuadernos. Cada uno lleva título, qué hace, qué pasa en la base de datos, qué funciones del dominio usa, anotaciones, un bloque JavaScript y la tabla de `cli-table3` con el encabezado en cian y negrita.

5. Desde `first-app`, ejecuta el JavaScript de `list-users`. La salida es una tabla con encabezados `id`, `name`, `email`, `createdAt` y `updatedAt`.

6. Ejecuta `createUser({ name: "", email: "ada@example.com" })`. Se ve `Name is empty`. No sale una tabla de usuario.
