# Arquitectura

- `src/db/connection.js` abre la única conexión a `src/db/users.sqlite`; no crea tablas al importar.
- `src/queries/queries/` contiene un fichero SQL parametrizado por consulta.
- `src/queries/users.js` carga SQL en UTF-8, prepara las consultas y devuelve objetos normales. Traduce el conflicto UNIQUE del correo; no valida reglas de negocio.
- `src/logic/` contiene una operación por fichero: crear, actualizar, borrar, listar, buscar por correo, ID o nombre y clasificar nombres. Valida las entradas y aplica las reglas de cada spec.
- `src/clients/terminal/` contiene ejemplos pequeños: importar, llamar y mostrar. Es la comprobación manual básica de cada operación.
- `src/clients/jupyter/` presenta esas mismas operaciones en nueve notebooks con tablas. Python ejecuta Node en el directorio de la aplicación; las reglas permanecen en `src/logic/`.
- `scripts/jupyter.sh` prepara el entorno local y arranca Notebook.
- `docs/CONSTITUTIONS.md` contiene reglas compartidas, el índice de specs y los comandos de ejecución.
- `docs/TREE.md`, `DATABASE.md`, `ERRORS.md` y `STYLE.md` describen el árbol, los datos, los errores y el estilo.
- `docs/specs/<nombre>/` agrupa spec, plan y tareas de cada desarrollo.
- `agents/git-workflow-agent.md` coordina los momentos de Git y delega cada encargo en un subagente real con instrucciones de `agents/`.
- `skills/` contiene los procedimientos concretos y sus entradas; `tools/` ejecuta las operaciones Git locales. No forman parte de las reglas de negocio.
- `templates/` define el contenido de issues y PR. `MCPS/` reúne las referencias de GitHub y Socket; `.mcp.example.json` es solo un ejemplo público, sin tokens.
- `docs/SOCKET.md` describe autenticación, puntuaciones, alertas, campañas y sus límites. Socket se consulta durante la preparación de cambios de dependencias; no se integra en el CRUD ni envía datos de usuarios.

Las operaciones llaman directamente a queries. El clasificador usa fetch nativo para consultar Ollama local dentro de su operación. No se añaden adaptadores, clases ni capas intercambiables.
