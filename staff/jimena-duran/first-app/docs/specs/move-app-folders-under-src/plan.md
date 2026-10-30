Issue: #601

# Plan de reorganización bajo src

Estado: spec, plan y T01–T18 aprobados; implementación existente conservada y verificación posterior completada tras integrar origin/staging. Se distinguen la implementación `b62abae3`, la integración `db267b51` y la conciliación documental publicada en `0b411ac7`. Jimena autorizó commit selectivo de los tres documentos activos, push y PR draft contra staging, sin revisores ni merge. La publicación se comprobó en [#670](https://github.com/venturars/neoland-102026/pull/670); resultados y límites en [verification.md](verification.md).

## Rama y dependencia

En la preparación inicial se ejecutó `git fetch origin`; entonces la PR #600 estaba abierta en draft y sin integrar. Mediante `tools/create-branch.ps1` se creó `601-refactor-move-app-folders-under-src` desde `origin/jimena-duran-291020262`, commit `e7e51b11fe90b748a2cc18ae7669783905e48a34`, su último commit comprobado en ese momento. La rama conserva la automatización, incluida la protección de archivos locales sin seguimiento.

Esta issue dependía de #600: la pendiente inicial de integrar esa dependencia es histórica y está resuelta. #600 ya está mergeada en staging y esta rama contiene el snapshot de origin/staging `64e3edf5` mediante `db267b51`, sin duplicar su automatización. La preparación inicial no autorizaba publicación; la autorización actual se limita al commit documental, push y PR draft contra staging, sin revisores ni merge.

El 30 de octubre de 2026, tras comprobar que #600 ya estaba integrada, Jimena autorizó incorporar origin/staging a la rama existente de #601. Los 16 cambios locales propios de la reanudación se respaldaron por bytes, hashes, diff e índice antes de apartarlos temporalmente. La integración de `origin/staging` (`64e3edf5`) terminó sin conflictos y se guardó únicamente con el commit de integración `db267b51`, cuyos padres son `b62abae3` y `64e3edf5`. Los 13 archivos operativos de #600 quedaron incorporados por ese merge, equivalentes al respaldo y conservando src. Los tres documentos activos de #601 se recuperaron como cambios locales; no se reescribieron specs históricas manualmente ni se incluyeron estas notas en el commit de integración.

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
