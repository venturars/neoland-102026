Issue: #601

# Plan de reorganización bajo src

Estado: spec, plan y T01–T18 aprobados; implementación y verificaciones realizadas. Resultados y límites en [verification.md](verification.md). Sin autorización de commit, push, PR ni merge.

## Rama y dependencia

Se ejecutó `git fetch origin`. La PR #600 sigue abierta en draft y sin integrar. Mediante `tools/create-branch.ps1` se creó `601-refactor-move-app-folders-under-src` desde `origin/jimena-duran-291020262`, commit `e7e51b11fe90b748a2cc18ae7669783905e48a34`, su último commit comprobado. La rama conserva la automatización, incluida la protección de archivos locales sin seguimiento.

Esta issue depende de #600: no añadir esta reorganización a su rama ni a su PR. Antes de publicar en una fase posterior, comprobar de nuevo su integración y acordar la base adecuada sin duplicar los cambios de automatización. Ahora no hacer commit, push, PR ni merge.

## Cambios mínimos previstos

Rutas relativas a `staff/jimena-duran/first-app`:

- Mover juntas `db/`, `clients/`, `logic/` y `queries/` a `src/`. Mantener archivos, nombres y capas; `agents/`, `skills/`, `tools/`, `templates/`, `MCPS/`, configuración y documentación permanecen en la raíz.
- Conservar los imports relativos entre las capas hermanas y la resolución de SQL y SQLite desde sus módulos. No hay firmas, SQL, errores ni reglas nuevos. La base quedará en `src/db/users.sqlite` junto a la conexión existente.
- Ajustar los nueve ejemplos de terminal: imports `./src/logic/`, `./src/queries/` y `./src/db/`, según corresponda. Mantener sus here-strings y ejecución PowerShell desde first-app.
- Los notebooks buscan hacia arriba la carpeta que contiene `logic/`: después del traslado encontrarán `src/`. Sus imports internos pueden conservarse. Cambiar únicamente una ruta concreta si la comprobación demuestra que lo necesita; no regenerar outputs ni reescribir sus celdas de negocio.
- En `package.json`, anteponer `src/` a los tres patrones de `format`; conservar `lint`, dependencias y lockfile. Actualizar el comando existente de Jupyter en `docs/JUPYTER.md` a `src/clients/jupyter`, sin añadir un lanzador Bash ni recrear entornos.
- Actualizar las rutas vigentes de `AGENTS.md`, `docs/TREE.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/STYLE.md` y `docs/ERRORS.md`; en las demás guías o herramientas, solo referencias realmente afectadas. No modificar `docs/specs/` históricos ni la automatización no afectada.

## SQLite y datos locales

Antes de mover datos en la implementación, cerrar las conexiones de esta app y comprobar que no haya escrituras o bloqueos. Si hay un proceso activo o un destino existente, informar antes de resolver; no cerrar procesos ni sobrescribir archivos automáticamente. Registrar una copia de seguridad local fuera de Git y los hashes del conjunto SQLite en reposo.

Trasladar el directorio completo con PowerShell, incluidos archivos auxiliares presentes; comprobar rutas y ausencia de colisiones antes de mover. No ejecutar clientes contra la base personal para verificar la migración. Comprobar existencia y hashes antes de abrir la app: evitar que SQLite genere una base vacía por faltar el archivo trasladado.

Las reglas globales existentes ya ignoran `*.sqlite`, `*.sqlite-wal`, `*.sqlite-shm` y `*.sqlite-journal` también bajo src. Confirmar con `git check-ignore` y el diff; no añadir SQLite ni cambiar ignore para esconder ChromaDB. En la preparación actual no se mueve ni modifica ningún dato.

## Verificación tras autorizar implementación

1. Usar una copia temporal de la app con SQLite desechable y las instalaciones existentes de Node, pnpm, Python/Jupyter y Ollama. Verificar estructura, imports y rutas desde una ubicación Windows con espacios.
2. Ejecutar las funciones existentes con sus validaciones y errores, los nueve clientes PowerShell y los nueve notebooks sobre esa copia. Comprobar el clasificador real con el modelo ya disponible; no descargar ni cambiar versiones automáticamente.
3. Ejecutar `pnpm format` y `pnpm lint` desde first-app y revisar el diff. Comparar hashes de módulos y SQL antes/después del traslado: solo deben aparecer cambios de rutas necesarios. No ejecutar de nuevo suites de Git cuyo código no haya cambiado.
4. Confirmar datos personales y archivos auxiliares conservados por hash, ausencia de bases en el índice/diff, preservación de ChromaDB y de la automatización, y specs históricas intactas. Registrar comandos, resultados y cualquier comprobación que no se pueda ejecutar.

No hay contradicciones detectadas entre el alcance y las guías: solo cambian las rutas vigentes. Las verificaciones de esta reorganización ya se realizaron y sus resultados y límites están registrados en [verification.md](verification.md).
