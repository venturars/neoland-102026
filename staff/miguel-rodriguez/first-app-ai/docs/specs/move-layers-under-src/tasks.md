# Tareas — capas de first-app-ai dentro de src

Issue: #646 · PR: #647.
Estado: aprobadas por Miguel el 2026-10-30.
Referencias: [spec aprobada](spec.md) y [plan aprobado](plan.md).

No iniciar la implementación antes de aprobar estas tareas. Ejecutar cada paso
solo cuando su comprobación previa haya pasado; registrar el resultado real en
la evidencia final. No publicar commits ni pedir revisión sin la petición
correspondiente de Miguel.

## Preparación y corrección del bloqueo

- [x] **T01 · Inventario inicial — CA-01, CA-03, CA-06.** Confirmar rama646,
  estado Git y alcance de archivos. Guardar inventario/hashes de fuentes y archivos
  protegidos, incluidos celdas y metadata de notebooks. Inspeccionar por metadatos
  destinos, datos locales e ignorados. Identificar servidores/kernels de esta app
  y detenerlos normalmente antes de mover; si no se puede, parar la tarea afectada.
  Resultado: base de comparación y ausencia de conexiones usando los datos.
- [x] **T02 · Preparar pruebas aisladas — CA-02, CA-03, CA-04.** Crear copias
  temporales anterior y candidata sin datos reales, secretos ni cachés. Disponer
  de Node compatible con node:sqlite y dependencias exactas existentes sin escribir
  sobre su instalación original. Preparar el entorno Python desechable con los
  requirements ya aprobados; no cambiar versiones. Resultado: pruebas ejecutables
  y aisladas; informar cualquier impedimento, sin presentarlo como prueba pasada.
- [x] **T03 · Capturar comportamiento anterior — CA-02, CA-03.** En la copia
  anterior comprobar tabla sin inicializar y preparación explícita/repetible.
  Crear contactos ficticios, incluidos dos nombres iguales con emails diferentes;
  cerrar conexiones y guardar filas completas e inventario de la base. Copiar
  esa base ficticia cerrada a db/users.sqlite de la copia candidata, todavía con
  la estructura anterior, y comprobar que sus filas coinciden. Conservar otra
  copia cerrada como punto de partida para las comparaciones de operaciones.
  Resultado: ambas copias parten de los mismos datos ficticios, sin abrir ni
  copiar datos reales.
- [x] **T04 · Corregir validación del helper — CA-01, CA-06.** En
  tools/commit-changes.sh aplicar únicamente la búsqueda del ancestro existente
  descrita en el plan. Mantener validación física dentro de la app, rechazo de
  enlaces externos/rotos, rutas ausentes que no sean archivos blob en HEAD, rutas amplias y
  ramas no permitidas. Conservar índice temporal y sincronización selectiva.
  Resultado: acepta ambas rutas de un traslado cuyo padre antiguo desapareció.
- [x] **T05 · Verificar helper — CA-06.** Repetir en repositorios desechables los
  casos del candidato temporal, incluida eliminación de toda la carpeta de origen,
  renombre preparado, índice ajeno ocupado, rutas externas y anidadas por symlink,
  ruta inexistente sin antecedente y ramas rechazadas. Añadir un caso con un enlace
  simbólico roto en un directorio padre: debe rechazarse antes de crear un commit,
  sin cambiar HEAD ni el índice. Probar también una carpeta eliminada y una
  subcarpeta eliminada como argumentos: ambas se rechazan; las rutas de sus
  archivos individuales sí permiten guardar el traslado completo. Comparar
  commits e índice; ejecutar bash -n.
  Resultado: solo archivos explícitos incorporados, índice ajeno intacto; no se
  recrean carpetas antiguas ni se publica la prueba en GitHub.

## Traslado y rutas

- [x] **T06 · Comprobar destinos — CA-01, CA-03.** Revalidar que ningún destino
  contiene archivos antes de mover. Si existen carpetas o bases en conflicto,
  detenerse sin mezclar ni sobrescribir y solicitar una decisión. Resultado:
  destinos libres y estado local preservado.
- [x] **T07 · Mover capas completas — CA-01, CA-03.** Trasladar db, queries,
  logic y clients bajo src, incluidos ignorados locales que existan. No crear base
  ni inicializar datos en la copia real. Verificar hashes de conexión, consultas,
  SQL, ocho módulos de negocio y runner en sus nuevas rutas. Resultado: cuatro
  carpetas hermanas bajo src, sin las originales ni cambios en esos módulos.
- [x] **T08 · Adaptar terminales — CA-04.** Cambiar únicamente los imports de los
  nueve .txt trasladados a ./src/db, ./src/queries o ./src/logic. Resultado:
  directorio de ejecución, comentarios, entradas y salidas conservados.
- [x] **T09 · Adaptar Python — CA-04.** En src/clients/jupyter/client.py usar
  parents[3] como raíz de la app y las tres rutas src del plan. Mantener comprobación
  de package name, JSON, cwd, entorno y errores. Resultado: llama al runner de esta
  copia desde la raíz real, sin búsqueda genérica ni compatibilidad duplicada.
- [x] **T10 · Actualizar textos de notebooks — CA-04, CA-05.** Cambiar solo la
  ruta de datos en Markdown de 01, 07 y 08. Comparar las celdas ejecutables y la
  metadata de los nueve notebooks con T01. Resultado: textos actuales, mismo kernel
  y presentación, sin outputs guardados ni cambios en los otros seis documentos.
- [x] **T11 · Adaptar lanzador — CA-04.** Cambiar únicamente el directorio de
  notebooks en scripts/jupyter.js a src/clients/jupyter. Resultado: preparación,
  versiones, kernel, autenticación, loopback y parada permanecen iguales.
- [x] **T12 · Adaptar formato e ignorados — CA-06.** Cambiar solo los cuatro
  patrones de capas en el comando format de package.json, conservando opciones y
  cobertura de scripts/eslint.config.js. Añadir patrones src para SQLite, auxiliares
  y checkpoints; mantener los anteriores y el resto del ignore. Resultado: no
  cambia lint, dependencias, lockfile, requirements ni registros de agentes.
- [x] **T13 · Actualizar guías — CA-05.** Ajustar rutas en README, ARCHITECTURE y
  DATABASE; reflejar src y los tres documentos de esta tarea en TREE. Resultado:
  instrucciones actuales coherentes, sin alterar responsabilidades, reglas,
  constitución, AGENTS, ERRORS, STYLE ni specs históricas.

## Verificación de la aplicación trasladada

- [x] **T14 · Llevar candidato a la copia de prueba — CA-01, CA-03.** Partir
  de la copia candidata preparada en T03 con su base ficticia cerrada en db/.
  Comprobar destinos libres y mover primero las cuatro carpetas completas bajo
  src/, incluida esa base. Después incorporar únicamente los ajustes de fuentes
  de T08–T13; no copiar datos desde la app real ni reemplazar la base al incorporar
  fuentes. Antes de ejecutar escrituras, comparar todas las filas, IDs y fechas
  con T03 y comprobar que no queda una base en la ubicación antigua. Resultado:
  conservación de datos acreditada mediante un traslado real de la misma base.
- [x] **T15 · Inicialización y operaciones — CA-02.** En copias con el mismo
  punto de partida comprobar inicialización y repetición, CRUD y búsquedas por
  ID/email/nombre. Contrastar retornos y errores representativos con las guías:
  nombre vacío, email inválido/duplicado, contacto ausente, nombre sin coincidencias
  y fallos con tabla sin inicializar. Verificar que consultas y errores no cambian
  filas/fechas; update conserva createdAt y delete solo elimina el elegido.
  Comparar reglas de timestamps sin exigir updatedAt idéntico entre ejecuciones.
  Resultado: contratos y efectos anteriores conservados.
- [x] **T16 · Rutas independientes de cwd — CA-02.** Desde un directorio
  temporal ajeno importar por ruta absoluta consultas/conexión de la copia.
  Resultado: SQL y datos se resuelven junto a sus módulos; no aparece una base
  ni archivos de aplicación en el directorio actual.
- [x] **T17 · Clasificador controlado — CA-02, CA-04.** En el proceso de prueba
  comprobar tabla vacía sin petición al modelo. Para datos no vacíos, precargar
  un módulo temporal mediante NODE_OPTIONS=--import=RUTA que sustituya fetch;
  comprobar petición, conteos y error de transporte con idénticas respuestas antes
  y después. Usar ese control en los hijos Node de terminal y notebook09.
  Resultado: regresión comprobada sin modificar el clasificador ni depender de
  Ollama real; documentar que no acredita la clasificación del modelo.
- [x] **T18 · Ejecutar terminales — CA-04.** Ejecutar los nueve heredocs desde
  la raíz candidata con los datos ficticios previos y los IDs apropiados. Mantener
  sustituciones de valores solo en la ejecución de prueba. Resultado: nueve
  ejemplos ejecutados y resultados registrados, sin cambiar los entregados.
- [x] **T19 · Ejecutar notebooks independientes — CA-04.** Ejecutar cada uno
  de los nueve documentos en un kernel nuevo desde src/clients/jupyter; preparar
  explícitamente sus datos previos. Sustituir IDs solo en memoria. Comprobar tablas,
  mensajes de inicialización/borrado, errores y cwd del adaptador. Resultado: las
  nueve celdas funcionan sin variables de otro notebook y sin guardar outputs.
- [x] **T20 · Arrancar y parar Jupyter — CA-04.** Ejecutar pnpm jupyter desde
  la raíz temporal y comprobar raíz nueva, lista de nueve notebooks y kernel
  First app AI. Confirmar loopback y autenticación sin registrar token. Detener
  servidor y kernels normalmente. Resultado: arranque real comprobado, sin procesos
  temporales residuales; no confundir ejecutar client.py con probar el servidor.
- [x] **T21 · Herramientas e ignore — CA-06.** Ejecutar pnpm format y después
  pnpm lint en la copia candidata. Comparar cobertura y fuentes protegidas tras
  formatear. Comprobar con git check-ignore que datos SQLite/auxiliares/checkpoints
  en src siguen excluidos. Resultado: ambos comandos pasan y el diff no incorpora
  datos, instalaciones ni cachés.

## Revisión final y entrega

- [x] **T22 · Contrastar todo el alcance — CA-01 a CA-06.** Comparar inventario,
  hashes, diferencias y enlaces con T01. Confirmar ausencia de las cuatro carpetas
  antiguas, celdas/metadata conservadas y guías actuales; todo cambio ejecutable
  corresponde al plan. Resultado: negocio, SQL, dependencias, Socket, otros scripts
  Git y specs históricas intactos; excepción del helper limitada a lo aprobado.
- [x] **T23 · Registrar evidencia y limpiar — CA-01 a CA-06.** Anotar comandos,
  entornos, resultados y límites de las pruebas en este documento. Retirar módulo
  temporal, NODE_OPTIONS de prueba, copias y entornos propios tras parar procesos;
  preservar la instalación y datos reales. Resultado: se distinguen los pasos
  realizados, pendientes y bloqueados, sin secretos ni afirmaciones de éxito falso.
- [ ] **T24 · Commits y push autorizados — CA-01, CA-06.** Solo cuando Miguel
  lo solicite, delegar los commits pequeños y push mediante el flujo de la app y
  el helper corregido. Enumerar archivos versionados, ambas rutas de cada traslado
  y ningún dato generado. Actualizar la descripción de #647 con resultados reales;
  conservar base staging y Closes #646/Development. Resultado: entrega publicada y
  verificada; no pedir revisores hasta que Miguel los indique, ni fusionar/cerrar.

## Evidencia

Implementación local y verificación completadas el 2026-10-30; publicación pendiente. La prueba previa del candidato temporal del helper
pasó 49 invocaciones; se conserva como evidencia previa, separada de las 50
invocaciones realizadas ahora sobre el helper implementado.

Para cada paso anotar resultado observado, comando o acción y entorno. Conservar
los hashes por ruta relativa de los módulos que solo cambian de ubicación. La
solicitud de revisión no requiere un commit posterior para actualizar casillas:
su resultado quedará en el registro de ejecución y en GitHub.

### Revisión de tareas — 2026-10-30

T03/T14 precisan el punto de partida y el orden: base ficticia idéntica en ambas
copias, traslado completo antes de incorporar ajustes de fuentes y comparación
antes de escribir. T05 exige ahora el rechazo explícito de un enlace simbólico
roto en un directorio padre, sin cambios de HEAD/índice. Este caso sigue pendiente
de ejecución; no se atribuye a las 49 invocaciones previas. No cambia el plan ni
se ha iniciado la implementación.

### Implementación y resultados — 2026-10-30

- T01–T03: rama646, HEAD972b376d, únicamente los documentos de esta tarea sin
  seguimiento antes de implementar. Inventario de112 fuentes versionadas. No
  existían src ni db/users.sqlite en esta app; inspección de procesos y lsof sin
  servidor/kernel ni conexión usando su db. Dos copias temporales sin datos reales;
  instalación Node copiada y entorno Python aislado con notebook7.6.3 e
  ipykernel7.1.0. Node24.12.0. Inicialización explícita/repetida comprobada y tres
  contactos ficticios guardados, dos llamados Ada. Bases cerradas idénticas en
  ambas copias y reserva ficticia para repetir casos.
- T04–T05: implementada únicamente la validación del ancestro existente en
  tools/commit-changes.sh. `python3 /tmp/neoland-646/test_tools.py`:50 invocaciones
  satisfactorias en repositorios temporales y origen bare local. Incluye traslado
  con carpeta anterior ausente, renombre preparado, índice ajeno, rutas inválidas,
  symlink externo/anidado y padre symlink roto; este último rechazado sin cambios
  de HEAD/índice. bash -n correcto. Ningún push de estas pruebas fue a GitHub.
- T06–T14: destinos libres; cuatro carpetas completas trasladadas a src. Imports
  de terminal, cuatro rutas/raíz del adaptador Python, directorio del lanzador,
  patrones de formato e ignore y guías cambiados conforme al plan. Solo Markdown
  de notebooks01/07/08 actualizado. En la candidata se movió primero su base
  ficticia con las carpetas y después se incorporaron ajustes de fuentes. Filas,
  IDs y fechas comparados antes de escribir: idénticos, sin base antigua. No se
  creó ni abrió una base en la copia real.
- T15–T18: `python3 /tmp/neoland-646/test_application.py` terminó con salida0.
  Comparación antes/después: inicialización repetible, CRUD, búsquedas exactas
  por nombre/case/espacios, email normalizado e ID; nombre vacío, email
  inválido/duplicado, ID/email ausentes, update inválido y ocho errores de tabla
  no inicializada. Lecturas y fallos conservaron filas/fechas; update conservó
  createdAt y delete solo eliminó su contacto. Retornos equivalentes y acceso a
  SQL/base desde cwd ajeno sin archivos allí. Clasificador: respuesta controlada,
  ceros vacíos sin nueva petición y error de transporte; mismo modelo/petición
  comprobado antes/después, sin usar Ollama real. Los nueve heredocs ejecutados
  con salida0 y datos/IDs de prueba, incluido el clasificador con preload temporal.
- T19–T20: `/tmp/neoland-646/python/bin/python
  /tmp/neoland-646/test_jupyter.py` terminó con salida0. Lanzó realmente
  `pnpm --config.verifyDepsBeforeRun=false jupyter` desde la raíz temporal.
  Directorio src/clients/jupyter confirmado por API; nueve documentos, kernel
  First app AI y acceso en127.0.0.1. La API sin token fue rechazada; con token
  respondió. Token usado solo en memoria, sin incluirlo en evidencia. Se ejecutaron
  los nueve notebooks mediante nbclient, cada uno con kernel nuevo y datos
  explícitos; mensajes/tablas comprobados. Kernel adicional verificó Name is
  empty sin tabla de éxito. No se guardaron outputs ni metadata. Parada por API
  autenticada; puerto cerrado y procesos temporales ausentes.
- T21–T22: en copia desechable `pnpm --config.verifyDepsBeforeRun=false format`
  y después `pnpm --config.verifyDepsBeforeRun=false lint`, salida0. La opción
  evita reinstalación automática durante la prueba; no altera configuración ni
  versiones. Los13 JS permanecieron idénticos tras formatear. De112 originales,
  91 conservaron SHA-256 ajustando únicamente su ubicación cuando corresponde;
  los21 cambios de contenido restantes son exactamente los previstos por el plan.
  Conexión, SQL, consultas, ocho módulos de negocio y runner idénticos. Código,
  metadata y outputs de los nueve notebooks intactos. git check-ignore confirmó
  SQLite, wal/shm y checkpoints bajo src. git diff --check correcto. Dependencias,
  lockfile, requirements, Socket, instrucciones, specs históricas y los otros
  scripts Git intactos.
- Incidencias de las comprobaciones: el primer ensayo de terminal sustituyó un
  email de creación por uno ya sembrado y produjo Email is already used; se
  corrigió únicamente ese valor en el ejecutor temporal y se repitió el conjunto.
  El primer arranque Jupyter de prueba pasó open_browser=False además del True
  existente, lo que traitlets rechazó. Se retiró el argumento de prueba duplicado
  y se usó BROWSER=/usr/bin/true solo en el entorno temporal para evitar abrir
  una ventana; el lanzador entregado mantuvo su comportamiento. Ambos conjuntos
  se repitieron satisfactoriamente; no requirieron cambios adicionales en la app.
- T23: evidencias anteriores registradas, servidor/kernels parados, retirados
  copias, entorno Python, bases ficticias, preload y scripts temporales de esta
  ejecución. NODE_OPTIONS de prueba solo existió en esos procesos. Instalación
  original preservada. T24 pendiente: no se hicieron commits ni push y no se
  solicitaron revisores ni se cambió la base de #647.

### Corrección tras la revisión final — 2026-10-30

La revisión reprodujo que una ruta de directorio ya desaparecido superaba la
comprobación genérica de existencia en HEAD y permitía guardar borrados sin
enumerar archivos. El helper ahora consulta git cat-file -t y exige blob para
una ruta ausente; rechaza tree antes de tocar el índice o crear commit. Esto
corrige la distinción archivo/directorio requerida por el alcance aprobado,
sin ampliar rutas ni permisos ni recrear las carpetas antiguas.

Se repitieron52 invocaciones del conjunto aislado sobre el script real: todas
pasaron. Se rechazaron tanto carpeta como subcarpeta eliminadas, con HEAD e índice
intactos. Enumerar explícitamente los cuatro extremos de dos archivos trasladados
sí creó el commit esperado y conservó el índice ajeno. Se repitieron también padre
simbólico roto, ancestro externo, ruta inexistente, renombre y restantes protecciones
del conjunto. bash -n y git diff --check correctos. Repositorios y ejecutor temporal
retirados; no se hicieron commits ni push en la rama real. Las pruebas previas de
la aplicación no requieren repetición: solo cambió esta validación Bash. T24 sigue
pendiente de autorización de publicación.

### Publicación autorizada — 2026-10-30

Miguel pidió «Commit y push en staging». Se publica la rama646 mediante #647
con base staging, conservada desde su apertura; no se publica directamente sobre
la rama protegida. Lectura previa: PR abierta, draft y sin reviews. Commits
separados para helper, SDD/evidencia, traslado ejecutable y guías. Los hashes y
resultado remoto se verifican en los registros de los subagentes; no se añade un
commit posterior solo para marcar T24 ni se solicitan revisores por esta petición.
