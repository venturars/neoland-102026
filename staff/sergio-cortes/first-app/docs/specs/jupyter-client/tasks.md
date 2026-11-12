# Tareas — cliente Jupyter

1. Abre [package.json](../../../package.json). El script `jupyter` queda en una línea: si no está `.venv/bin/jupyter-notebook`, crea `.venv` si falta, instala `notebook==7.6.3` y abre `clients/jupyter`.

2. Abre cada cuaderno de `clients/jupyter/` y el `.txt` del mismo nombre en `clients/terminal/`, incluido `user-gender-count.txt`. La celda busca la app y arranca `node --input-type=module`. Dentro van las líneas del `.txt`. Los `import` y la llamada quedan iguales. El `console.log` pasa a ser la tabla de `cli-table3` con el encabezado en cian y negrita.

3. Desde `first-app`, ejecuta el bloque de `list-users`. La salida es una tabla con encabezados `id`, `name`, `email`, `createdAt` y `updatedAt`.

4. Ejecuta `createUser({ name: "", email: "ada@example.com" })`. Se ve `Name is empty`. No sale una tabla de usuario.
