# Tareas — cliente Jupyter

1. Abre [docs/CONSTITUTIONS.md](../../CONSTITUTIONS.md). En la línea de `clients/jupyter/`, escribe que el bloque copia el interior del `.txt` de terminal, que el `console.log` se sustituye por la tabla y que `pnpm jupyter` ejecuta ese bloque con el directorio actual en `first-app`.

2. Abre [package.json](../../../package.json). El script `jupyter` sigue creando `.venv` si falta e instalando `notebook==7.6.3` si no está `jupyter-notebook`. Al arrancar, el bloque queda con el directorio actual en `first-app`.

3. Abre cada cuaderno de `clients/jupyter/` y el `.txt` del mismo nombre en `clients/terminal/`. Sustituye el bloque por las líneas de dentro del `.txt`. Los `import` y la llamada quedan iguales. El `console.log` pasa a ser la tabla de `cli-table3` con el encabezado en cian y negrita.

4. Desde `first-app`, ejecuta el bloque de `list-users`. La salida es una tabla con encabezados `id`, `name`, `email`, `createdAt` y `updatedAt`.

5. Ejecuta `createUser({ name: "", email: "ada@example.com" })`. Se ve `Name is empty`. No sale una tabla de usuario.
