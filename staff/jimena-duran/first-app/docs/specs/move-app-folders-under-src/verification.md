Issue: #601

# Resultado de la reorganización

## Historial: comprobaciones iniciales anteriores al commit local

En la comprobación inicial, T01–T18 estaban implementadas y verificadas en `601-refactor-move-app-folders-under-src`. Entonces HEAD era `e7e51b11fe90b748a2cc18ae7669783905e48a34`: todavía no se habían realizado commit, push, PR ni merge, y el índice estaba vacío. Esa descripción histórica no corresponde al estado publicado posteriormente.

Al comenzar se comprobó que #600 seguía abierta en draft, sin integrar. En ese momento, esta rama conservaba su implementación y dependía de ella; no se añadieron estos cambios a su rama ni a su PR.

## Cambios realizados

- Se trasladaron 37 archivos de las cuatro capas a `src/db/`, `src/clients/`, `src/logic/` y `src/queries/`. Las carpetas antiguas ya no existen en la raíz.
- Los nueve ejemplos de terminal conservan su contenido y formato PowerShell; únicamente cambian sus imports a `./src/...`, ejecutándose desde first-app.
- Los diez módulos JS, ocho archivos SQL, nueve notebooks y SQLite conservan sus hashes originales: 28 archivos sin cambios de contenido. La búsqueda ascendente de `logic/` de los notebooks ahora encuentra `src/` sin reescribir sus celdas.
- `package.json` cambia únicamente los tres patrones de `format` para anteponer `src/`. `lint`, dependencias y lockfile permanecen iguales.
- Las referencias vigentes de AGENTS, TREE, ARCHITECTURE, DATABASE, STYLE, ERRORS, JUPYTER y GIT-AUTOMATION reflejan la nueva ubicación. No se reescribieron las specs históricas.
- La automatización, configuración, node_modules y documentación permanecen fuera de src. No hay nuevos paquetes, versiones, entornos o integración de Socket.

## Conservación de SQLite y cambios locales

Antes del traslado, SQLite permitió abrir un FileStream exclusivo de solo lectura; no se detectó un bloqueo activo. No había archivos auxiliares presentes. Se creó una copia local y un inventario de los 37 archivos antes de moverlos:

```text
<TEMP>/jimena-src-backup-4f113527b40b4142bca2ddb716482386/users.sqlite
<TEMP>/jimena-src-backup-4f113527b40b4142bca2ddb716482386/inventory.json
```

Las rutas absolutas de origen y destino se comprobaron dentro de first-app antes de usar Move-Item; no se sobrescribieron destinos existentes. La base personal se trasladó a `src/db/users.sqlite` sin abrirla desde la aplicación ni usarla para las pruebas.

SHA256 antes y después del traslado y de la verificación:

```text
67AABFF0965C26E122D924C604C48D9FC9C59EF30B89629C0D5A3F08631626FF
```

`git check-ignore -v` confirmó que SQLite, WAL, SHM y journal siguen excluidos bajo src por las reglas existentes. De los 37 archivos trasladados, Git ve 36 archivos de código/clientes: la base no aparece en el índice ni como archivo por añadir. No se cambiaron reglas ignore para ocultar otros archivos.

Se comprobaron 143 archivos protegidos mediante hashes: automatización de Git, specs históricas, lockfile y configuración, y los 79 archivos visibles sin seguimiento de ChromaDB. Todos mantienen sus bytes; ChromaDB sigue sin seguimiento y no se movió ni incorporó a esta entrega.

## Verificaciones de esta entrega

| Área | Resultado |
| --- | --- |
| Estructura e imports | Las cuatro capas están bajo src y la infraestructura sigue en la raíz. Los imports relativos entre módulos continúan válidos. Los nueve clientes solo difieren en el prefijo del import. |
| Funciones | Pasaron crear, consultar por ID/correo/nombre, listar, actualizar y borrar, normalización, validaciones, duplicados, usuarios ausentes y errores de SQLite. |
| Clasificador real | Ollama ya tenía `llama3.2:latest`; caso vacío y llamada con tres usuarios pasaron. Resultado de la llamada: `{women: 2, men: 1, genderUndefined: 0}`. |
| Terminal | 9/9 clientes PowerShell ejecutados desde la raíz de la copia con datos desechables. |
| Jupyter | 9/9 notebooks ejecutados desde `src/clients/jupyter` mediante nbclient y kernel `python3`, sin celdas fallidas. |
| Formato | `pnpm format` terminó con código 0 usando los patrones src. Solo normalizó finales de línea en diez JS; tras comprobar igualdad de contenido se restauraron sus bytes originales, sin reset/restore. |
| Lint | `pnpm lint` terminó con código 0. |
| Alcance final | SQLite excluida, índice vacío, historial de Git conservado, automatización y specs históricas intactas; sin cambios de reglas de negocio, SQL, dependencias o versiones. |

La copia de pruebas se creó en una ruta Windows con espacios, sin copiar la base personal ni sus auxiliares; utilizó su propia SQLite desechable y las instalaciones existentes. Se reutilizó node_modules mediante una junction, retirada sin recursión antes de eliminar la copia temporal tras validar su ruta. El node_modules original quedó intacto.

## Comandos y herramientas usados

Desde first-app se ejecutaron formato y lint con pnpm 10.33.0 ya instalado. Los comandos equivalentes, sin la ruta local del ejecutable, son:

```powershell
pnpm format
pnpm lint
```

Las funciones y los ejemplos se ejecutaron con Node v24.22.0 y Windows PowerShell 5.1. Para los scripts se usó `-NoProfile -ExecutionPolicy Bypass` solo en el proceso de prueba, sin cambiar la política global. Los notebooks usaron nbclient con Python 3.13.9 ya instalado. No hubo instalaciones ni descargas.

Se revisaron hashes, `git check-ignore`, `git diff --check`, índice y estado local. Antes del commit de implementación, Git mostraba las rutas antiguas eliminadas y src sin seguimiento porque los traslados aún no se habían preparado; no se habían perdido los archivos.

## Historial: límites y pendientes de la fase inicial

- Jupyter emitió avisos de permisos de IPython/ZMQ sin errores de celda. No se probó su interfaz gráfica ni se inició un servidor para navegación; sí se ejecutaron los nueve notebooks reales desde su nueva ubicación.
- No se repitieron las suites de Git: su código no cambió y se verificó su conservación mediante hashes. Los resultados de aplicación de esta entrega son nuevos; no se atribuyeron pruebas históricas a la reorganización.
- La copia de seguridad local se conservó para revisión. No se ejecutaron operaciones de escritura ni consultas de la aplicación sobre la base personal.
- En esa fase, la publicación estaba pendiente de autorización y faltaba revisar la integración de #600 y su base. Esta pendiente es histórica y está resuelta: #600 fue mergeada en staging, se integró origin/staging mediante `db267b51` y la autorización de publicación actual se registra al final.

## Reanudación del 30 de octubre de 2026

Se localizó la rama existente `601-refactor-move-app-folders-under-src`, con HEAD `b62abae3b10b050f0582f7dced6e97b574fe13db` y la reorganización ya guardada en ese commit local. El bloque anterior corresponde a las comprobaciones previas a ese commit, no al estado de esta reanudación. Se conservó el trabajo; no se creó otra rama ni se rehicieron los traslados. Spec, plan y T01–T18 ya registraban aprobación de implementación y verificación.

En la primera lectura, #600 seguía abierta en draft en `ce91ee69`. Se incorporaron localmente sus 13 archivos operativos tras `git apply --check`, excluyendo los cinco documentos históricos de su spec. Antes de continuar, Jimena confirmó su integración y autorizó incorporar origin/staging a esta rama; la lectura posterior y el fetch ya mostraron staging en `64e3edf5`. Este cambio de estado se atendió antes de verificar la aplicación.

Los 16 archivos propios modificados se respaldaron en `.tmp/601-pre-staging-20261030T105407Z`, con sus bytes, SHA256, versiones de HEAD, diff binario, índice y manifiesto. Se apartaron temporalmente escribiendo únicamente sus bytes de HEAD, después de comprobar el respaldo. ARCHITECTURE mostraba una diferencia stat aunque HEAD, índice y hash-object compartían el blob `374ceebf68064b8f7aeeb8f737617e90a043cee3`; se refrescó únicamente esa entrada con el mismo blob. El árbol del índice siguió siendo `1b1cdf6ee5b5ae180be137351a3d4493bab07ea7` y no se preparó ningún cambio de contenido.

`git merge --no-commit --no-ff --no-overwrite-ignore origin/staging` terminó sin conflictos. Se verificó que el resultado frente a staging conservaba exclusivamente los 49 archivos de la reorganización original en first-app, sin diferencias fuera de esa app. Se cerró únicamente esa integración autorizada con `db267b516daae8d5906945c7a0a8f189b1ea657e`, padres `b62abae3b10b050f0582f7dced6e97b574fe13db` y `64e3edf51574f1b2f421ccabb6b39fdddf890597`. Los 13 archivos operativos de #600 coincidieron con el respaldo al normalizar finales CRLF/LF, y se recuperaron los tres documentos activos de #601 como cambios locales. No se reescribieron manualmente specs históricas; sus cambios proceden de upstream.

La base personal conservó el SHA256 `67AABFF0965C26E122D924C604C48D9FC9C59EF30B89629C0D5A3F08631626FF` antes y después de la integración. Durante esa integración no se hizo ningún nuevo commit de implementación, push, PR ni merge de #601 hacia staging. La publicación posterior se registra al final, separada de la ejecución siguiente.

## Verificación actual después de integrar staging

Se creó `.tmp/601 verification edcf14a31e08402ca6d7e087d4c37073`, en una ruta con espacios, copiando la aplicación sin SQLite ni sus auxiliares personales. La copia usó una base desechable propia y una junction a node_modules existente. Se conservan la copia, los registros y los notebooks ejecutados para inspección.

| Comprobación de esta sesión | Resultado |
| --- | --- |
| Funciones y errores | 41 comprobaciones pasaron: CRUD, búsquedas, normalización, duplicados, ausencias, errores de SQLite y clasificación. |
| Ollama existente | Llamada real a llama3.2: `{women: 1, men: 2, genderUndefined: 0}`; contrato válido y total de tres. No se exige repetir una predicción histórica. |
| Clientes PowerShell | 9/9 pasaron desde la raíz de la copia con imports src y datos desechables. |
| Notebooks | 9/9 ejecutados con nbclient y kernel python3 desde src/clients/jupyter, sin errores de celda ni errores funcionales en las salidas. |
| Formato y lint | Ambos terminaron con código 0 desde first-app. Tras comprobar igualdad normalizando CRLF/LF, se conservaron los bytes originales de los diez JS; cero cambios de contenido. |
| Documentación y diff | 26 enlaces locales en 13 documentos vigentes/activos, ninguno roto. `git diff --check` local y contra origin/staging terminaron con código 0. |
| Historial y alcance | En aquella comprobación, el snapshot de origin/staging `64e3edf5` y b62abae3 eran ancestros de HEAD. No había diferencias fuera de first-app respecto a ese snapshot; solo tres documentos activos de #601 quedaban modificados, con índice vacío. |

Los wrappers `.tmp/verify601-run.ps1` y `.tmp/verify601-format.ps1` se ejecutaron con `powershell.exe -NoProfile -ExecutionPolicy Bypass -File`. Reutilizaron Node, Python/Jupyter, Ollama y pnpm 10.33.0 existentes para format/lint. Los registros de funciones, clientes, notebooks, formato y lint, las nueve salidas `.executed.ipynb` y el respaldo original-js están dentro de la copia conservada. No se instalaron dependencias, descargaron modelos ni repitieron suites de Git.

Al terminar aquella verificación, la base personal conservó el mismo SHA256 anterior y no se abrió desde la aplicación. SQLite y auxiliares permanecen excluidos de Git; no hay bases versionadas de esta app. ChromaDB sigue sin seguimiento, sin cambios de datos ni reglas para ocultarlo. Los avisos de permisos de IPython y de ZMQ/Proactor no causaron fallos; no se cambió configuración para suprimirlos. No se probó la interfaz gráfica de Jupyter. No se ha integrado #601 hacia staging.

## Historial: autorización de publicación

Jimena autorizó el commit selectivo de plan, tareas y verificación de #601, el push de `601-refactor-move-app-folders-under-src` y la creación de una PR draft contra staging, sin revisores ni merge. La dependencia de #600 ya estaba integrada. Se mantienen separados el commit previo de implementación `b62abae3`, el commit de integración `db267b51` y las verificaciones posteriores descritas arriba.

El fetch previo a publicar mostró origin/staging en `d7d0e7a88ca0600fd752c3eb62044c320b2fe359`, posterior al snapshot integrado `64e3edf5`. La comparación entre ambos commits no mostró cambios en first-app y el diff completo de la PR contra esa base pasó `git diff --check` con código 0. Estas aclaraciones documentales no necesitan otra integración ni repetir pruebas de código; no se afirma que el nuevo tip de staging sea ancestro de esta rama.

Antes del primer commit documental, la conciliación solo modificaba estos tres documentos y no repetía pruebas de código. En ese momento no se anticiparon hash, push ni URL de PR. Las operaciones completadas después se registran a continuación.

## Resultados reales de publicación

- El commit selectivo `0b411ac7c76237a4c06e5c4491eccfbdf83e2392` guardó únicamente plan, tareas y verificación de #601. No reemplaza ni confunde la implementación previa `b62abae3`, la integración `db267b51` ni las comprobaciones funcionales posteriores ya registradas.
- El push de `601-refactor-move-app-folders-under-src` terminó con código 0. La consulta remota confirmó que HEAD, upstream y la rama publicada coincidían en `0b411ac7`.
- El MCP local de GitHub creó la PR [#670](https://github.com/venturars/neoland-102026/pull/670). La relectura confirmó OPEN, draft, base staging, head de esta misma rama en `0b411ac7` y asignación a `jiji-mena`. No se solicitaron revisores (`reviewRequests: []`) ni se hizo merge.
- El cuerpo se actualizó mediante el MCP local para incorporar una única referencia `Closes #601`; su relectura confirmó el texto exacto. La lectura con gh verificó Development en ambos sentidos entre #670 y #601 y que la issue #601 sigue abierta. No se confundió el MCP local con GitHub de Apps ni se crearon recursos de prueba.
- Durante la publicación staging avanzó de nuevo; la base observada de la PR era `dafe8ca6`. Esa lectura no cambia el snapshot integrado `64e3edf5` ni afirma que la rama contenga ese tip posterior. No se hizo otra integración por estas aclaraciones documentales.

Esa actualización de los mismos tres documentos registró únicamente resultados ya comprobados. No repitió pruebas de código ni anticipó el siguiente commit documental; después se publicó en `4bc3fa9f5de25cbc2f810e8470a78505ce20b898`, cuyo push y head de #670 quedaron comprobados.

## Revisión posterior de #670

La lectura remota comunicada en esta revisión muestra #670 abierta, fuera de draft, sin merge, con head `4bc3fa9f` y revisores solicitados `mglnglxx` y `Dietor878`. Es un estado posterior a la publicación inicial en draft y sin revisores; esta revisión no modifica la PR ni atribuye quién cambió esos campos.

Los comentarios se atendieron dentro de T08/T11: nota de traslado manual de SQLite por checkout, localización exclusiva de first-app/src en los nueve notebooks y corrección de la documentación activa. La nota no ejecuta movimientos de la base ni añade una migración automática. Se retiraron rutas personales de este informe y se contextualizaron los estados anteriores a commit y PR. Jimena autorizó después el commit selectivo y push de estas correcciones, incluidos los nueve notebooks y la documentación afectada, y actualizar la descripción de #670 sin cambiar revisores ni hacer merge.

La verificación de esta corrección se realizó en `.tmp/601 notebook review 3c1ac280a09043aaa87862741f68992f`, con SQLite desechable propia. Los resultados son nuevos y no se sustituyen por las comprobaciones anteriores:

- Pasaron 63 casos de localización, siete por cada notebook: arranque desde first-app, src, la carpeta del notebook y la raíz del repositorio; elección de la app de Jimena aunque el directorio de trabajo pertenezca a otro alumno; y rechazo del repositorio más cercano sin la app propia o con una app incompleta. No se escapó a una app de un repositorio exterior ni se tomó cualquier carpeta logic.
- Los 9/9 notebooks se ejecutaron sin errores alternando los directorios de trabajo first-app, src y su carpeta Jupyter. Se conservaron el código de negocio, outputs, metadatos y contadores originales; en los nueve archivos versionados solo cambió el bootstrap.
- Formato y lint terminaron con código 0. Los diez JS conservaron sus bytes originales después de comprobar que el formateador solo normalizaba CRLF/LF.
- La base personal mantuvo antes y después el SHA256 `67AABFF0965C26E122D924C604C48D9FC9C59EF30B89629C0D5A3F08631626FF`, sin auxiliares presentes. No se abrió desde los notebooks de prueba ni se trasladó durante esta corrección.

La copia conserva los nueve notebooks ejecutados, `summary.json`, los registros de formato/lint y `original-js`. Se usaron los wrappers `.tmp/verify601-review-notebooks.py` y `.tmp/verify601-review-format.ps1` con las herramientas existentes. Los avisos de IPython/ZMQ no causaron fallos. No se añadieron dependencias. Estos resultados preceden a la publicación autorizada de la corrección; no anticipan su commit ni su push.

## Comprobación previa a publicar las correcciones del review

Se inspeccionaron los nueve JSON versionados: todos tienen `outputs: []` y `execution_count: null`, sin rutas personales ni resultados de ejecución. Sus metadatos contienen solo configuración de kernel/lenguaje. Las celdas conservan únicamente ejemplos sintéticos identificados como demo (`Jimena Demo` y `demo.jimena.jupyter@example.com`); no contienen registros extraídos de SQLite personal. No fue necesario limpiar salidas ni modificar nuevamente los notebooks.

La nota de DATABASE.md cubre respaldo fuera de Git, cierre de conexiones, traslado conjunto de SQLite y sus auxiliares WAL/SHM/journal presentes, verificación por hash y detención si ya existe una base o un auxiliar en destino, sin sobrescribirlos. No se mueve ni abre la base personal durante esta comprobación. Esta auditoría no repite las pruebas funcionales de notebooks ya registradas.
