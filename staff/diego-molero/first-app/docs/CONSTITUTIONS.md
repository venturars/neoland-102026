# Constitución — first-app

first-app permite gestionar usuarios y clasificar sus nombres mediante IA local. Las specs recogen los requisitos, la implementación prevista y las comprobaciones de cada desarrollo.

## Guías

- [Arquitectura](ARCHITECTURE.md): responsabilidades de las capas y ficheros.
- [Árbol](TREE.md): estructura de la aplicación.
- [Base de datos](DATABASE.md): almacenamiento y consultas.
- [Errores](ERRORS.md): mensajes y comportamiento de fallos.
- [Estilo](STYLE.md): convenciones del código y de los textos.

## Contratos compartidos

Una operación por fichero de logic. Las operaciones llaman directamente a queries, validan entradas y devuelven datos ordinarios: un usuario, una lista o un recuento. Borrar no devuelve datos. Los fallos se señalan con Error, sin códigos ni clases propios.

Crear recibe un objeto con name y email. Actualizar recibe ID y objeto de cambios; undefined conserva el valor guardado. Los mensajes, validaciones y orden de cada operación están en su plan.

Hay una única conexión por proceso y una base local. La creación de tablas es explícita y repetible; importar no crea tablas. Se conserva el esquema y las fechas UTC. Los cambios de esquema requieren migración.

Las bases, credenciales, entornos y archivos generados no se versionan. La clasificación consulta IA local, envía solo nombres y no guarda categorías.

## Specs

Cada desarrollo con alcance propio tiene spec.md (qué se necesita), plan.md (cómo se construye) y tasks.md (pasos y evidencia). Las ampliaciones pequeñas actualizan su trío; se conserva el historial de tareas terminadas.

Antes de cambiar comportamiento se actualizan las specs. Se implementa lo aprobado y solo se marca como comprobado lo que tiene evidencia real.

- [Usuarios](specs/users/spec.md).
- [Clasificador](specs/classifier/spec.md).
- [Búsqueda por nombre](specs/find-user-by-name/spec.md).
- [Cliente Jupyter](specs/jupyter-client/spec.md).
- [Arranque de Jupyter](specs/jupyter-cross-platform/spec.md).
- [Script y archivos locales](specs/jupyter-script-untrack-sqlite/spec.md).
- [Validación con Socket](specs/socket-package-validation/spec.md).
- [Organización de las guías](specs/split-sdd-guides/spec.md).
- [Código conforme a las guías](specs/align-code-with-guides/spec.md).

## Paquetes

Un paquete de Node nuevo, o un cambio de versión, se valida con Socket antes de aceptar el plan que lo incorpora. El procedimiento está en AGENTS.md y los resultados en el plan correspondiente. La falta de información se registra como pendiente.

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

### Jupyter

Se necesita Python 3 con venv y, en Windows, el sh incluido en Git for Windows disponible en PATH. Se utiliza el entorno .venv de esta aplicación.

```powershell
pnpm jupyter
```

La primera ejecución crea el entorno e instala Notebook 7.6.3; las siguientes lo reutilizan. Se abre Notebook con los nueve documentos de clients/jupyter. El script admite argumentos adicionales, por ejemplo:

```powershell
pnpm jupyter --no-browser --port=8899
```

Preparar la tabla antes de las operaciones. Para recorrer una base nueva: preparar tablas, crear Ada, buscar por ID/correo/nombre, listar, clasificar, actualizar y borrar al final. Si ya hay datos, revisar los IDs y correos de las celdas antes de ejecutarlas. Los ejemplos de actualización y borrado modifican la base local. Al terminar, parar el servidor con Ctrl+C y guardar los notebooks sin salidas.

### Clasificador

Abrir Ollama y disponer de llama3.2; se prepara con `ollama pull llama3.2`. Las variables OLLAMA_MODEL y OLLAMA_BASE_URL se describen en el [plan del clasificador](specs/classifier/plan.md).

## Comprobación

No se añade una suite de tests a first-app. Las operaciones se comprueban en copias temporales sin la base personal. Se revisan sintaxis, imports, enlaces, UTF-8 y resultados; las llamadas a IA real se distinguen de respuestas controladas. Los sistemas operativos no ejecutados quedan pendientes.
