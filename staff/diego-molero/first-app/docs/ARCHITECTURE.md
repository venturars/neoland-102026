# Arquitectura

- `src/db/connection.js` abre la única conexión a `src/db/users.sqlite` con claves foráneas activas en cada proceso; no crea tablas al importar.
- `src/queries/initialize-database.js` prepara usuarios y notas en una transacción explícita y comprueba columnas, fechas, relación de cascada e índice de notas antes de confirmar.
- `src/queries/queries/` contiene un fichero SQL parametrizado por consulta.
- `src/queries/users.js` carga SQL en UTF-8, prepara las consultas y devuelve objetos normales. Traduce el conflicto UNIQUE del correo; no valida reglas de negocio.
- `src/queries/notes.js` carga el SQL de `src/queries/queries/notes/`; las consultas individuales filtran usuario e ID de nota.
- `src/logic/` contiene una operación por fichero: crear, actualizar, borrar, listar, buscar por correo, ID o nombre y clasificar nombres, además de crear, listar, consultar, actualizar y borrar notas por usuario. Valida las entradas y aplica las reglas de negocio.
- `src/clients/terminal/` contiene ejemplos pequeños: importar, llamar y mostrar. Es la comprobación manual básica de cada operación.
- `src/clients/jupyter/` presenta esas mismas operaciones en nueve notebooks con tablas. Python ejecuta Node en el directorio de la aplicación; las reglas permanecen en `src/logic/`.
- `src/clients/http/` contiene una aplicación Express que ofrece las rutas JSON y solo sirve los archivos públicos enumerados. Traduce los errores de logic a códigos HTTP y escucha en el equipo local.
- `src/clients/web/` contiene seis pantallas HTML, CSS y JavaScript vanilla, incluido el alta de usuario. La selección vive en memoria y las acciones llaman a HTTP.
- `src/clients/postman/` contiene el recorrido importable de usuarios REST y sus comprobaciones de respuesta.
- `scripts/jupyter.sh` prepara el entorno local y arranca Notebook.
- `docs/CONSTITUTIONS.md` contiene reglas compartidas, el índice de specs y los comandos de ejecución.
- `docs/TREE.md`, `DATABASE.md`, `ERRORS.md` y `STYLE.md` describen el árbol, los datos, los errores y el estilo.
- `agents/git-workflow-agent.md` coordina los momentos de Git y delega cada encargo en un subagente real con instrucciones de `agents/`.
- `skills/` contiene los procedimientos concretos y sus entradas; `tools/` ejecuta las operaciones Git locales. No forman parte de las reglas de negocio.
- `templates/` define seis plantillas de issues y seis de PR, una pareja por tipo: feat, fix, docs, refactor, test y chore. Los agentes y sus skills eligen el mismo tipo; el orquestador añade `Closes #N` y conserva el borrador hasta que se pida revisión. `MCPS/` reúne las referencias de GitHub y Socket; `.mcp.example.json` es solo un ejemplo público, sin tokens.
- `docs/SOCKET.md` describe autenticación, puntuaciones, alertas, campañas y sus límites. Socket se consulta durante la preparación de cambios de dependencias; no se integra en el CRUD ni envía datos de usuarios.

Las operaciones llaman directamente a queries. El clasificador usa fetch nativo para consultar Ollama local dentro de su operación. No se añaden adaptadores, clases ni capas intercambiables.

## Notas y cliente web · Issues #778 y #782

La persistencia y lógica de notas está implementada en la issue #782. Sus cinco clientes de terminal y el notebook de preparación llaman a las operaciones actuales. El borrado de usuario conserva su firma y elimina las notas mediante la relación de cascada. El cliente web añade HTTP y pantallas vanilla que llaman a logic. La interfaz confirma los borrados antes de hacer la petición.

La ampliación de frontend y API permite dar de alta usuarios en la web y en `POST /api/users`, migra el transporte HTTP a Express sin mover las reglas de negocio y añade la colección Postman. El workflow incorpora la comprobación de una issue lista y la creación de rama y PR antes de editar.
