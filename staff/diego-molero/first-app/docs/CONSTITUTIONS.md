# Constitución — first-app

first-app permite gestionar usuarios, guardar sus notas y clasificar sus nombres mediante IA local. Las specs recogen los requisitos, la implementación prevista y las comprobaciones de cada desarrollo.

## Guías

- [Arquitectura](ARCHITECTURE.md): responsabilidades de las capas y ficheros.
- [Árbol](TREE.md): estructura de la aplicación.
- [Base de datos](DATABASE.md): almacenamiento y consultas.
- [Errores](ERRORS.md): mensajes y comportamiento de fallos.
- [Estilo](STYLE.md): convenciones del código y de los textos.
- [Socket](SOCKET.md): autenticación y comprobación de alertas, puntuaciones y campañas.

## Contratos compartidos

Una operación por fichero de `src/logic/`. Las operaciones llaman directamente a `src/queries/`, validan entradas y devuelven datos ordinarios: un usuario, una lista o un recuento. Borrar no devuelve datos. Los fallos se señalan con Error, sin códigos ni clases propios.

Crear un usuario recibe un objeto con name y email. Actualizar recibe ID y objeto de cambios; undefined conserva el valor guardado. Los mensajes, validaciones y orden de cada operación están en su plan.

Hay una única conexión por proceso y una base local en `src/db/users.sqlite`, junto al módulo de conexión. La creación de tablas es explícita y repetible; importar no crea tablas. Se conserva el esquema y las fechas UTC. Los cambios de esquema requieren migración. El traslado de una base existente a `src/db/` conserva sus bytes; no se inicializa una base vacía para sustituirla.

Las bases, credenciales, entornos y archivos generados no se versionan. La clasificación consulta IA local, envía solo nombres y no guarda categorías.

## Specs

Cada desarrollo con alcance propio tiene spec.md (qué se necesita), plan.md (cómo se construye) y tasks.md (pasos y evidencia). Las ampliaciones pequeñas actualizan su trío; se conserva el historial de tareas terminadas.

Antes de cambiar comportamiento se actualizan las specs. Se implementa lo aprobado y solo se marca como comprobado lo que tiene evidencia real.

La automatización Git se define en `agents/`, `skills/`, `tools/` y `templates/`, con las referencias de los servicios en `MCPS/`. El manual enlaza el orquestador de esta copia. La persona puede autorizar anticipadamente las fases de una tarea concreta y su entrega; esa autorización se registra sin inventar revisiones individuales. Se respetan las decisiones humanas sobre alertas nuevas, los cambios de alcance y la revisión de compañeros.

- [Usuarios](specs/users/spec.md).
- [Clasificador](specs/classifier/spec.md).
- [Búsqueda por nombre](specs/find-user-by-name/spec.md).
- [Cliente Jupyter](specs/jupyter-client/spec.md).
- [Arranque de Jupyter](specs/jupyter-cross-platform/spec.md).
- [Script y archivos locales](specs/jupyter-script-untrack-sqlite/spec.md).
- [Validación con Socket](specs/socket-package-validation/spec.md).
- [Organización de las guías](specs/split-sdd-guides/spec.md).
- [Código conforme a las guías](specs/align-code-with-guides/spec.md).
- [Automatización Git](specs/git-workflow/spec.md).
- [Capas dentro de src](specs/move-layers-under-src/spec.md).
- [Notas por usuario](specs/notes/spec.md) — persistencia y operaciones implementadas.
- [Cliente web vanilla](specs/vanilla-web-client/spec.md) — HTTP y pantallas implementados.

Las rutas vigentes están en arquitectura y TREE. Las evidencias anteriores conservan las rutas utilizadas cuando se ejecutaron sus comprobaciones; el traslado a `src/` no cambia los contratos de usuarios, búsqueda ni clasificador.

## Paquetes

Un paquete de Node nuevo, o un cambio de versión, se valida con Socket antes de aceptar el plan que lo incorpora. La regla de trabajo está en AGENTS.md, el procedimiento en [Socket](SOCKET.md) y los resultados en el plan correspondiente. La falta de información se registra como pendiente. Los tokens se gestionan en el cliente, fuera del repositorio.

## Ejecución

Esta sección reúne los comandos de pnpm. Se requiere Node.js 24.14 o posterior y pnpm 11.25.0, declarada en package.json. Se conserva el lockfile. Ejecutar desde first-app en PowerShell:

```powershell
pnpm install --frozen-lockfile
pnpm run db:init
pnpm run create-user
pnpm run find-user-by-email
pnpm run find-user-by-id
pnpm run find-user-by-name
pnpm run list-users
pnpm run update-user
pnpm run classify
pnpm run delete-user
```

Los clientes de terminal pasan JavaScript a Node por stdin; no necesitan Bash. El ejemplo crea Ada con ada@example.com, consulta ese correo y el ID 1 y actualiza o elimina ese ID. Se editan los datos del ejemplo cuando sea necesario. Repetir el alta comunica el correo duplicado; repetir la inicialización conserva los datos.

### Notas

La preparación anterior añade notes e índice en una transacción y comprueba el esquema antes de confirmar; conserva usuarios y notas existentes. Antes de migrar una base personal, cerrar los procesos que la usan y guardar una copia local. Un esquema de notas incompatible produce error y rollback; no se borra ni repara automáticamente.

En una base nueva, crear primero un usuario y revisar su ID; los siguientes ejemplos usan userId 1 y noteId 1:

```powershell
pnpm run create-note
pnpm run list-notes
pnpm run find-note-by-id
pnpm run update-note
pnpm run delete-note
```

Los datos de estos clientes se editan en sus ejemplos de terminal, igual que los de usuarios. Crear recibe title y content; actualizar permite uno o ambos. El título es obligatorio y se recorta; el contenido admite vacío y conserva su texto. Una nota borrada no reutiliza su ID, por lo que se revisan los IDs antes de repetir los ejemplos. Eliminar un usuario desde cualquier cliente elimina también sus notas definitivamente; los ejemplos de terminal ejecutan la llamada explícita sin una confirmación interactiva. La interfaz web pide confirmación.

### Cliente web

Preparar la base con `pnpm run db:init` antes de arrancar. En una base existente, cerrar otros procesos y guardar una copia local antes de la migración. El servidor no crea tablas por sí mismo. Desde `first-app`:

```powershell
pnpm web
```

Abrir `http://127.0.0.1:3000/`. El puerto se puede cambiar con `$env:PORT = "3001"` antes del comando. Detener con Ctrl+C. La selección de usuario no se guarda al recargar. Eliminar desde la web pide confirmación y borra también sus notas.

### Jupyter

Se necesita Python 3 con venv y, en Windows, el sh incluido en Git for Windows disponible en PATH. Se utiliza el entorno .venv de esta aplicación.

```powershell
pnpm jupyter
```

La primera ejecución crea el entorno e instala Notebook 7.6.3; las siguientes lo reutilizan. Se abre Notebook con los nueve documentos de `src/clients/jupyter/`. El script admite argumentos adicionales, por ejemplo:

```powershell
pnpm jupyter --no-browser --port=8899
```

Preparar la tabla antes de las operaciones. Para recorrer una base nueva: preparar tablas, crear Ada, buscar por ID/correo/nombre, listar, clasificar, actualizar y borrar al final. Si ya hay datos, revisar los IDs y correos de las celdas antes de ejecutarlas. Los ejemplos de actualización y borrado modifican la base local. Al terminar, parar el servidor con Ctrl+C y guardar los notebooks sin salidas.

### Clasificador

Abrir Ollama y disponer de llama3.2; se prepara con `ollama pull llama3.2`. Las variables OLLAMA_MODEL y OLLAMA_BASE_URL se describen en el [plan del clasificador](specs/classifier/plan.md).

## Comprobación

No se añade una suite de tests a first-app. Las operaciones se comprueban en copias temporales sin la base personal. Se revisan sintaxis, imports, enlaces, UTF-8 y resultados; las llamadas a IA real se distinguen de respuestas controladas. Los sistemas operativos no ejecutados quedan pendientes.

La sintaxis y el comportamiento de los scripts Git se comprueban en repositorios temporales con remoto local. Esas comprobaciones nunca se ejecutan contra el historial o los remotos del repositorio compartido. Git for Windows proporciona Bash para las herramientas de automatización; los clientes de terminal conservan sus comandos de PowerShell y Node.
