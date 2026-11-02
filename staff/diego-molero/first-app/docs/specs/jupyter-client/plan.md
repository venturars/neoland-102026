# Plan — cliente jupyter

Copiar los nueve notebooks a `clients/jupyter/` y adaptar los datos del ejemplo a Ada, ada@example.com e ID 1. Mantener las llamadas a las funciones actuales, las tablas con `cli-table3@0.6.5` y el kernel Python que ejecuta Node por subprocess.

Fijar encoding UTF-8 al capturar la salida, limpiar outputs y execution_count y centralizar el arranque en la constitución. La búsqueda por nombre se describe en su propia spec. Antes de ejecutar ejemplos se inicializa la tabla.

La revisión de la dependencia está en [Socket](../socket-package-validation/plan.md). Comprobar los nueve bloques con un kernel real y una base temporal, errores, listas vacías y ausencia de datos de ejecución versionados.
