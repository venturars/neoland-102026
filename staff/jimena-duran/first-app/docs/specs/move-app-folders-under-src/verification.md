Issue: #601

# Resultado de la reorganización

## Historial: comprobaciones iniciales anteriores al commit local

T01–T18 implementadas y verificadas en `601-refactor-move-app-folders-under-src`. HEAD permanece en `e7e51b11fe90b748a2cc18ae7669783905e48a34`: no hubo commit, push, PR ni merge y el índice sigue vacío.

Al comenzar se comprobó que #600 seguía abierta en draft, sin integrar. Esta rama conserva su implementación y depende de ella; no se añadieron estos cambios a su rama ni a su PR.

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
C:/windows/TEMP/jimena-src-backup-4f113527b40b4142bca2ddb716482386/users.sqlite
C:/windows/TEMP/jimena-src-backup-4f113527b40b4142bca2ddb716482386/inventory.json
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

Desde first-app se ejecutaron:

```powershell
node 'E:/Users/987866/AppData/Local/Temp/jimena-corepack/v1/pnpm/10.33.0/bin/pnpm.cjs' format
node 'E:/Users/987866/AppData/Local/Temp/jimena-corepack/v1/pnpm/10.33.0/bin/pnpm.cjs' lint
```

Las funciones y los ejemplos se ejecutaron con Node v24.22.0 y Windows PowerShell 5.1. Para los scripts se usó `-NoProfile -ExecutionPolicy Bypass` solo en el proceso de prueba, sin cambiar la política global. Los notebooks usaron nbclient desde el Python existente en `E:/Users/987866/AppData/Local/Programs/Python/Python313/python.exe`. No hubo instalaciones ni descargas.

Se revisaron hashes, `git check-ignore`, `git diff --check`, índice y estado local. Antes de preparar un commit, Git muestra las rutas antiguas eliminadas y src sin seguimiento porque todavía no se han preparado los traslados; no significa que se hayan perdido los archivos.

## Historial: límites y pendientes de la fase inicial

- Jupyter emitió avisos de permisos de IPython/ZMQ sin errores de celda. No se probó su interfaz gráfica ni se inició un servidor para navegación; sí se ejecutaron los nueve notebooks reales desde su nueva ubicación.
- No se repitieron las suites de Git: su código no cambió y se verificó su conservación mediante hashes. Los resultados de aplicación de esta entrega son nuevos; no se atribuyeron pruebas históricas a la reorganización.
- La copia de seguridad local se conserva para revisión. No se ejecutaron operaciones de escritura ni consultas de la aplicación sobre la base personal.
- En esa fase, la publicación estaba pendiente de autorización y faltaba revisar la integración de #600 y su base. Esta pendiente es histórica y está resuelta: #600 fue mergeada en staging, se integró origin/staging mediante `db267b51` y la autorización de publicación actual se registra al final.

## Reanudación del 30 de octubre de 2026

Se localizó la rama existente `601-refactor-move-app-folders-under-src`, con HEAD `b62abae3b10b050f0582f7dced6e97b574fe13db` y la reorganización ya guardada en ese commit local. El bloque anterior corresponde a las comprobaciones previas a ese commit, no al estado de esta reanudación. Se conservó el trabajo; no se creó otra rama ni se rehicieron los traslados. Spec, plan y T01–T18 ya registraban aprobación de implementación y verificación.

En la primera lectura, #600 seguía abierta en draft en `ce91ee69`. Se incorporaron localmente sus 13 archivos operativos tras `git apply --check`, excluyendo los cinco documentos históricos de su spec. Antes de continuar, Jimena confirmó su integración y autorizó incorporar origin/staging a esta rama; la lectura posterior y el fetch ya mostraron staging en `64e3edf5`. Este cambio de estado se atendió antes de verificar la aplicación.

Los 16 archivos propios modificados se respaldaron en `.tmp/601-pre-staging-20261030T105407Z`, con sus bytes, SHA256, versiones de HEAD, diff binario, índice y manifiesto. Se apartaron temporalmente escribiendo únicamente sus bytes de HEAD, después de comprobar el respaldo. ARCHITECTURE mostraba una diferencia stat aunque HEAD, índice y hash-object compartían el blob `374ceebf68064b8f7aeeb8f737617e90a043cee3`; se refrescó únicamente esa entrada con el mismo blob. El árbol del índice siguió siendo `1b1cdf6ee5b5ae180be137351a3d4493bab07ea7` y no se preparó ningún cambio de contenido.

`git merge --no-commit --no-ff --no-overwrite-ignore origin/staging` terminó sin conflictos. Se verificó que el resultado frente a staging conservaba exclusivamente los 49 archivos de la reorganización original en first-app, sin diferencias fuera de esa app. Se cerró únicamente esa integración autorizada con `db267b516daae8d5906945c7a0a8f189b1ea657e`, padres `b62abae3b10b050f0582f7dced6e97b574fe13db` y `64e3edf51574f1b2f421ccabb6b39fdddf890597`. Los 13 archivos operativos de #600 coincidieron con el respaldo al normalizar finales CRLF/LF, y se recuperaron los tres documentos activos de #601 como cambios locales. No se reescribieron manualmente specs históricas; sus cambios proceden de upstream.

La base personal conservó el SHA256 `67AABFF0965C26E122D924C604C48D9FC9C59EF30B89629C0D5A3F08631626FF` antes y después de la integración. No se hizo ningún nuevo commit de implementación, push, PR ni merge de #601 hacia staging. Los resultados iniciales anteriores se distinguen de la ejecución actual siguiente.

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

Los wrappers `.tmp/verify601-run.ps1` y `.tmp/verify601-format.ps1` se ejecutaron con `powershell.exe -NoProfile -ExecutionPolicy Bypass -File`. Reutilizaron Node, Python/Jupyter, Ollama y `E:/Users/987866/AppData/Local/Temp/jimena-corepack/v1/pnpm/10.33.0/bin/pnpm.cjs` para format/lint. Los registros de funciones, clientes, notebooks, formato y lint, las nueve salidas `.executed.ipynb` y el respaldo original-js están dentro de la copia conservada. No se instalaron dependencias, descargaron modelos ni repitieron suites de Git.

La base personal conserva al terminar el mismo SHA256 anterior y no se abrió desde la aplicación. SQLite y auxiliares permanecen excluidos de Git; no hay bases versionadas de esta app. ChromaDB sigue sin seguimiento, sin cambios de datos ni reglas para ocultarlo. Los avisos de permisos de IPython y de ZMQ/Proactor no causaron fallos; no se cambió configuración para suprimirlos. No se probó la interfaz gráfica de Jupyter. No se ha integrado #601 hacia staging.

## Autorización actual de publicación

Jimena autoriza el commit selectivo de plan, tareas y verificación de #601, el push de `601-refactor-move-app-folders-under-src` y la creación de una PR draft contra staging, sin revisores ni merge. La dependencia de #600 ya está integrada y no constituye una pendiente actual. Se mantienen separados el commit previo de implementación `b62abae3`, el commit de integración `db267b51` y las verificaciones posteriores descritas arriba.

El fetch previo a publicar mostró origin/staging en `d7d0e7a88ca0600fd752c3eb62044c320b2fe359`, posterior al snapshot integrado `64e3edf5`. La comparación entre ambos commits no mostró cambios en first-app y el diff completo de la PR contra esa base pasó `git diff --check` con código 0. Estas aclaraciones documentales no necesitan otra integración ni repetir pruebas de código; no se afirma que el nuevo tip de staging sea ancestro de esta rama.

La conciliación actual solo modifica estos tres documentos; no repite pruebas de código. En este punto aún no se han registrado un nuevo hash documental, push ni URL de PR: los resultados se añadirán únicamente después de completarlos y comprobarlos.
