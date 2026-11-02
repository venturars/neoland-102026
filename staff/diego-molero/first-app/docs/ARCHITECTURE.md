# Arquitectura

- `db/connection.js` abre la única conexión a `db/users.sqlite`; no crea tablas al importar.
- `queries/queries/` contiene un fichero SQL parametrizado por consulta.
- `queries/users.js` carga SQL en UTF-8, prepara las consultas y devuelve objetos normales. Traduce el conflicto UNIQUE del correo; no valida reglas de negocio.
- `logic/` contiene una operación por fichero: crear, actualizar, borrar, listar, buscar por correo, ID o nombre y clasificar nombres. Valida las entradas y aplica las reglas de cada spec.
- `clients/terminal/` contiene ejemplos pequeños: importar, llamar y mostrar. Es la comprobación manual básica de cada operación.
- `clients/jupyter/` presenta esas mismas operaciones en nueve notebooks con tablas. Python ejecuta Node en el directorio de la aplicación; las reglas permanecen en logic.
- `scripts/jupyter.sh` prepara el entorno local y arranca Notebook.
- `docs/CONSTITUTIONS.md` contiene reglas compartidas, el índice de specs y los comandos de ejecución.
- `docs/TREE.md`, `DATABASE.md`, `ERRORS.md` y `STYLE.md` describen el árbol, los datos, los errores y el estilo.
- `docs/specs/<nombre>/` agrupa spec, plan y tareas de cada desarrollo.

Las operaciones llaman directamente a queries. El clasificador usa fetch nativo para consultar Ollama local dentro de su operación. No se añaden adaptadores, clases ni capas intercambiables.
