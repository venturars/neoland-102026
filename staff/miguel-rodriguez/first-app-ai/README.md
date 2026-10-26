# First app AI

Aplicación local de contactos. Los nueve documentos de Jupyter permiten ejecutar sus operaciones y leer los resultados desde el navegador.

## Abrir Jupyter

Requisitos: Node compatible con `node:sqlite` (`24.12.0` verificado), pnpm y Python 3.10 o posterior. En Windows, Python debe estar disponible mediante `py -3`.

Desde esta carpeta:

```sh
pnpm jupyter
```

El primer arranque instala las dependencias del cliente y prepara `.venv/` con Notebook. Los siguientes reutilizan ese entorno. Se abre **Jupyter Notebook**, con nueve documentos en `clients/jupyter/` y el kernel **First app AI**.

Si preparas dependencias por separado, usa `pnpm install --frozen-lockfile`. No hace falta instalar Jupyter globalmente. El servidor escucha solo en el equipo local y conserva la autenticación de Jupyter.

## Probar las operaciones

1. Abre **01-create-users-table** y ejecuta su celda con **Shift+Enter**.
2. Abre **02-create-user**, cambia nombre y email, ejecuta y anota el ID devuelto.
3. Usa los documentos 03–06 para listar o buscar. En la búsqueda por ID sustituye `None` por el ID real.
4. En 07 puedes actualizar ese contacto. Los campos omitidos se conservan.
5. En 08 elimina únicamente un contacto desechable: el borrado es permanente.
6. En 09 consulta las categorías estimadas por nombre. Con contactos necesita Ollama local activo y `llama3.2` ya disponible; con tabla vacía devuelve ceros sin llamar al modelo.

Cada documento funciona tras **Kernel → Restart Kernel**; no necesita variables de otro notebook. Sí necesita los datos que se preparan explícitamente en 01 y 02. Un error muestra el mensaje de la operación, sin una tabla de éxito.

## Datos y parada

Preparar, crear, actualizar y eliminar trabajan sobre **`db/users.sqlite` de esta copia**. Las consultas conservan los contactos y las fechas. Para experimentar, copia el proyecto sin su base de datos y usa datos ficticios en esa copia.

Para parar Notebook vuelve a la terminal y pulsa **Ctrl+C**; confirma la parada si Jupyter lo solicita. Cerrar una pestaña no para el servidor.

Los ejemplos anteriores siguen disponibles en `clients/terminal/`. Las reglas están en [la constitución](docs/CONSTITUTIONS.md) y la verificación del cliente en [las tareas](docs/specs/jupyter-client/tasks.md).
