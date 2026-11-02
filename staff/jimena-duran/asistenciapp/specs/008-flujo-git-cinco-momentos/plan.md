Issue: #751

# Plan de corrección: integrar el flujo original

Estado: spec, plan y C01–C20 aprobados conjuntamente; implementación y comprobaciones locales completadas, incluido §4 y enmienda 3.1. Resultados en [verification-original-gitflow.md](verification-original-gitflow.md). C19 autorizado para commits y push exclusivamente en repositorios desechables con remoto local, sin otro permiso. Rutas relativas a AsistenciApp salvo la fuente indicada.

## Referencias fijadas y estado inicial

- Fuente de verdad: `exercises/git-workflow-agent-template` en `origin/staging`, commit `6db669aac7c0811c966ba7ba9bc4fc7e3ae6e953`, consultado tras fetch.
- Último commit que modifica el template: `25208d23157626954906ffe7da32757c58d9a66e`. No hay cambios del template entre la anterior referencia `50094711` y la actual: el desvío está en la adaptación.
- Entrega revisada: `25a2858920c3eda5f46a199c7b9d11cfeee031c6`, rama existente `751-chore-asistenciapp-git-five-stages`. La PR #756 está abierta y lista para revisión; no se cambia su estado remoto en esta preparación.
- La referencia documental de AsistenciApp se contrastó en el mismo commit: cinco momentos en AGENTS y §4 de la constitución 3.1. Se compara también con la constitución local 3.0 anterior a esta entrega, conservando los principios propios.
- Git Bash instalado: Bash 5.3.15. Se comprobó con `bash --version`; no se instaló software ni se ejecutaron las herramientas de la entrega.

La revisión completa comprende los 53 archivos de la PR: 44 en las cinco carpetas de automatización y 9 entre instrucciones, documentación, prueba SDD y documentos de la 008.

| Componente | Diferencia frente a la fuente fijada | Corrección propuesta |
| --- | --- | --- |
| `tools/` | Faltan los siete originales; hay ocho herramientas propias y un ensayo PowerShell | Incorporar los siete originales y retirar los nueve archivos propios |
| `agents/` | Los siete archivos fueron reescritos | Restaurar originales; añadir solo referencias necesarias al SDD local |
| `skills/` | Las quince skills fueron reescritas | Restaurar originales; adaptar únicamente las siete rutas de comandos |
| `templates/` | Las doce plantillas coinciden en sus blobs Git | Conservarlas |
| `MCPS/` | La referencia fue sustituida por texto propio | Restaurar el original; documentar las condiciones locales fuera de él |
| `AGENTS.md`, constitución y arquitectura | Cinco momentos compatibles en intención, con redacción y reglas propias extensas | Mantener el SDD de AsistenciApp y reducir la integración al contenido necesario |
| `docs/GIT-AUTOMATION.md` | Describe una interfaz y garantías PowerShell ajenas al original | Sustituir por uso de los originales mediante Git Bash y sus límites reales |
| `tests/test_sdd_rules.py` | Fija literalmente la redacción extensa de esta entrega | Ajuste mínimo si cambia esa redacción; conservar cobertura e invariantes |
| Documentos de la 008 | Describen como objetivo la implementación equivalente | Estos tres documentos proponen su corrección; evidencia anterior intacta |

## Copia de los originales y diferencias permitidas

Copiar desde el objeto Git fijado, sin convertir extensiones ni editar el código:

- `tools/check-status.sh`
- `tools/pull-changes.sh`
- `tools/create-branch-from-staging.sh`
- `tools/create-branch.sh`
- `tools/create-empty-commit.sh`
- `tools/commit-changes.sh`
- `tools/launch-push.sh`

Cada archivo conservará contenido LF, nombre y estructura originales. La fuente tiene modo Git `100755`; se conservará al preparar una publicación autorizada. En Windows puede invocarse Bash explícitamente sin alterar el índice para esta preparación.

Retirar `tools/{check-status,pull-changes,create-branch-from-staging,create-branch,create-empty-commit,commit-changes,launch-push,git-common}.ps1` y `tools/tests/test-git-automation.ps1`. No conservar un helper o ensayo propio como sustituto del original.

Restaurar los siete agentes, las quince skills y `MCPS/github-mcp-server/mcp.txt` desde la misma fuente. El texto original será la base; no se reescribirá para reproducir el comportamiento anterior. Cambios permitidos:

1. En las siete skills de terminal, sustituir únicamente `./tools/` por `./staff/jimena-duran/asistenciapp/tools/`; los comandos se ejecutan desde la raíz Git.
2. En el orquestador, añadir una referencia breve a `../AGENTS.md`, `../docs/CONSTITUTION.md` y la guía local, que delimitan el momento solicitado y el SDD propio. Las rutas de agents y skills se resuelven dentro de esta aplicación.
3. Documentar Git Bash ya disponible y la alternativa gh cuando MCP no tenga la capacidad o identidad adecuada. La referencia MCP y sus ejemplos no autorizan instalar skills, modificar conexiones, headers, tokens o configuración personal.

Las doce plantillas y el fichero MCP quedarán iguales a la fuente. No se fijan OWNER/REPO ni se amplían reglas de tipos. No se trasladan a los originales los controles extra de las herramientas retiradas.

## SDD propio y enmienda

La enmienda 3.0 → 3.1 de esta entrega ya fue autorizada y aplicada en su rama. Se ha autorizado corregir su redacción dentro de esa misma entrega, sin cambiar P1–P6, stack, calidad, seguridad, ámbito o aprobación de enmiendas.

El contraste con la referencia de AsistenciApp muestra que bastan las reglas de §4 siguientes, junto con los cinco momentos en AGENTS:

1. Ningún fichero de la app se modifica sin spec, plan y tareas que cubran el cambio. La issue, rama o PR no autorizan por sí solas implementar; un cambio no cubierto requiere su spec.
2. Orden spec → plan → tareas → implementación. La persona interviene en issue, draft, los tres documentos juntos, implementación y lo solicitado sobre la PR. No se encadenan momentos ni se pide otro ok entre spec y plan o entre plan y tareas.
3. La spec describe qué y por qué, sin tecnologías.
4. El plan explica cómo y comprueba la constitución.
5. Las dudas se resuelven antes de implementar; no se inventan requisitos.

AGENTS conservará esos cinco momentos: issue sin rama; apertura del draft sin specs; documentos juntos para revisión; implementación sin commit ni push; actuación expresamente solicitada sobre la PR sin merge. El flujo original se lee desde una referencia breve en las instrucciones, sin trasplantar otro SDD ni crear pausas adicionales. Se conservan las reglas de código y del producto ajenas a esta corrección.

Se mantienen versión 3.1 y fecha real local de su aplicación; no se copia la fecha ni la historia de otro proyecto. Solo se ajustaría §4 y el texto necesario de su entrada de enmienda. No se añade una nueva entrada constitucional por iniciativa del agente.

En `tests/test_sdd_rules.py` solo cambiarán las expectativas de texto afectadas por esta redacción. Se mantendrán comprobaciones de cinco momentos y orden, documentos antes de código, cambio no cubierto, ausencia de autorización implícita, dudas e integridad del proceso. Ámbito, integridad histórica, casos de saltos de línea y todas las pruebas funcionales se conservarán.

## Clasificación de todos los comentarios

Se leyeron dos comentarios generales, tres revisiones y ocho hilos inline, sin páginas pendientes. Las categorías siguientes describen el resultado esperado de la corrección, no conversaciones resueltas en GitHub.

| Comentario | Clasificación | Contraste y tratamiento propuesto |
| --- | --- | --- |
| General [6583764639](https://github.com/venturars/neoland-102026/pull/756#issuecomment-6583764639): herramientas originales | Aplicable todavía | Recuperar los siete archivos originales, sin traducción |
| General [6584384168](https://github.com/venturars/neoland-102026/pull/756#issuecomment-6584384168): copia fiel, rutas y SDD del proyecto | Aplicable todavía | Corrección de las cinco carpetas y enmienda mínima descritas arriba |
| Revisión [5739893617](https://github.com/venturars/neoland-102026/pull/756#pullrequestreview-5739893617): extensión de herramientas | Aplicable todavía | Incorporar originales `.sh`, no renombrar los `.ps1` |
| Revisión [5739152733](https://github.com/venturars/neoland-102026/pull/756#pullrequestreview-5739152733): resumen de ocho observaciones | Aplicable todavía | Sus ocho puntos quedan desglosados a continuación; no añade un noveno problema |
| Revisión [5739302593](https://github.com/venturars/neoland-102026/pull/756#pullrequestreview-5739302593): aprobación de la versión revisada | Aplicable todavía como estado de revisión | No pide cambio de código ni acredita aprobación de esta propuesta |
| Inline [4444399101](https://github.com/venturars/neoland-102026/pull/756#discussion_r4444399101): URL con credenciales | Resuelto al retirar código propio | `check-status.sh` muestra upstream y contadores, no la URL de origin |
| Inline [4444399187](https://github.com/venturars/neoland-102026/pull/756#discussion_r4444399187): directorio versionado eliminado | Presente también en la fuente | `commit-changes.sh` solo comprueba `-d` sobre el árbol de trabajo; un directorio ya borrado puede pasar y seleccionar descendientes |
| Inline [4444399296](https://github.com/venturars/neoland-102026/pull/756#discussion_r4444399296): carrera en avance de staging | Presente también en la fuente | Comprueba ascendencia con referencias y después usa `git branch -f staging origin/staging`; no fija y compara los mismos SHA |
| Inline [4444399373](https://github.com/venturars/neoland-102026/pull/756#discussion_r4444399373): variables Git heredadas en el ensayo | Resuelto al retirar código propio | Se retira ese ensayo; no se afirma que los originales aíslen todas esas variables |
| Inline [4444399445](https://github.com/venturars/neoland-102026/pull/756#discussion_r4444399445): revisores antes de salir de draft | Presente también en la fuente | La skill original dice asignar logins y sacar de draft, sin imponer la transición previa solicitada en el comentario |
| Inline [4444399524](https://github.com/venturars/neoland-102026/pull/756#discussion_r4444399524): fallo después del commit al sincronizar borrado preparado | Presente también en la fuente | El original termina con `git add -- "$@"`; una ruta eliminada de HEAD y del índice puede fallar igualmente, aunque no use `git restore` |
| Inline [4444399596](https://github.com/venturars/neoland-102026/pull/756#discussion_r4444399596): etiquetas implícitas en push | Presente también en la fuente | `git push -u origin HEAD` no desactiva `push.followTags` |
| Inline [4444399653](https://github.com/venturars/neoland-102026/pull/756#discussion_r4444399653): colisiones mezcladas en ensayo | Resuelto al retirar código propio | Se retira el ensayo propio; no se conserva esa afirmación como prueba de los originales |

Los cinco puntos presentes en la fuente se señalan antes de cualquier divergencia. Se propone incorporar los originales sin arreglarlos localmente. La retirada de código propio tampoco equivale a haber validado las garantías de su sustituto. No se responderá a comentarios ni se resolverán hilos durante esta preparación.

## Archivos de la corrección y comprobaciones previstas

Al implementar se tocarían las cinco carpetas indicadas, `AGENTS.md`, `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md`, `docs/GIT-AUTOMATION.md` y solo las expectativas SDD necesarias de `tests/test_sdd_rules.py`. Sin cambios en app.py, asistencia, static, README funcional, dependencias, datos, specs anteriores ni otros proyectos.

1. Comparar los siete scripts con los blobs fijados, comprobar LF y nombres; modo ejecutable y blobs de los siete scripts comprobados antes del commit de publicación. Pasar `bash -n` sobre los siete.
2. Contrastar agentes, quince skills, doce plantillas y MCP; cada diferencia debe corresponder exclusivamente a las rutas y referencias enumeradas. Recorrer selección y alternativa de plantilla en lectura.
3. Ejecutar `check-status.sh` mediante Git Bash desde la raíz y desde una copia temporal con ruta con espacios. No ejecutar scripts de mutación sobre el repositorio de trabajo.
4. Proponer ensayos de los contratos originales en repositorios desechables con remoto local: actualización por avance rápido y divergencia; recuperación de ramas local/remota y otra base; apertura vacía; commit selectivo con índice ajeno; push y upstream. Sin exigir controles extra ausentes de la fuente. C19 ya está autorizado, incluidos commits y push exclusivamente en esos repositorios desechables con remoto local; no necesita otra aprobación.
5. Ejecutar únicamente las comprobaciones SDD afectadas con el intérprete existente: `python -m pytest tests/test_sdd_rules.py -k "sdd_gates or constitution_amendment"`. Conservar y no repetir pruebas funcionales ajenas al cambio.
6. Comprobar diff, espacios, hashes protegidos y referencias de la rama pausada. Registrar evidencia nueva en `verification-original-gitflow.md` dentro de esta spec, separada de `verification.md`, que permanece intacto.

Los resultados de las verificaciones de los originales se registran en [verification-original-gitflow.md](verification-original-gitflow.md). Los resultados PowerShell anteriores no se trasladan a Bash ni demuestran corrección de los puntos señalados en la fuente.

## Comprobación de la constitución

- P1, P4 y P5: producto, privacidad, datos e interfaz sin cambios.
- P2: copia de la fuente, sin nueva implementación ni abstracciones.
- P3: Git Bash ya existe; ninguna instalación, dependencia o cambio de versión.
- P6: documentación del proyecto en español y convenciones originales de Git conservadas.
- §4 y §8: ajuste mínimo de la enmienda expresamente aprobado para su aplicación; se mantienen los cinco momentos propios.
- §5: comprobaciones específicas de lo afectado, sin presentar revisión estática ni pruebas anteriores como ejecución de los originales.
- §6: seguridad funcional intacta; las limitaciones del flujo original se declaran sin inventar garantías.
- §7: corrección limitada a los archivos enumerados de AsistenciApp.

## Pausa

Presentar comparación, pruebas y pendientes al terminar la implementación aprobada. No corregir localmente los cinco puntos presentes en la fuente. Publicación selectiva de la corrección autorizada en la misma rama y PR #756, con siete scripts en modo Git 100755 y blobs idénticos a la fuente. Conservar Closes #751 y Development; sin respuestas a comentarios, resolución de conversaciones, cambios de revisores ni merge.
