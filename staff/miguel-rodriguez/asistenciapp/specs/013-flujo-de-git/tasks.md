# Tareas de adaptación

Issue: #761. Referencias: [spec](spec.md), [plan](plan.md).
Preparación e implementación completas delegadas por Miguel el 2026-11-02.

- [x] T01 · CA-07: inventario y hashes iniciales de la copia staging sin datos.
- [x] T02 · CA-01–08: preparar y revisar spec, plan y tareas en ese orden.
- [x] T03 · CA-03/08: enmendar solamente §4 de la constitución y registrar 4.2.
- [x] T04 · CA-01–05: adaptar los cinco momentos en AGENTS.
- [x] T05 · CA-06: incorporación inicial de seis scripts propios; corregida por
  C01 para conservar los siete originales del template.
- [x] T06 · CA-06: incorporación inicial de catorce skills y referencia MCP; C02
  completa quince skills y alinea las siete herramientas locales.
- [x] T07 · CA-01–06: incorporar seis roles y principal, manteniendo controles.
- [x] T08 · CA-06: incorporar doce plantillas de la referencia fijada.
- [x] T09 · CA-06: actualizar árbol y responsabilidades de arquitectura.
- [x] T10 · CA-05/06: añadir al README el enlace del flujo de desarrollo.
- [x] T11 · CA-01–06: revisar roles, enlaces, cinco momentos, tipos y casillas.
- [x] T12 · CA-02/05/06: bash -n y pruebas Git locales desechables.
- [x] T13 · CA-07: actualizar únicamente las dos expectativas documentales de
  versión 4.1→4.2 en test_architecture.py y test_registration_security.py; ejecutar
  pytest y pruebas Node con dependencias existentes sin datos.
- [x] T14 · CA-07: comparación final de protegidos y revisión del alcance.
- [x] T15 · CA-01–08: registrar evidencia y retirar temporales propios.
- [x] T16 · CA-05: entrega inicial publicada en #763 hacia staging, enlazada a
  #761; la corrección actual se publica en esa misma PR, sin cambiar su base.

## Evidencia histórica del 2026-11-02

Las comprobaciones de los seis scripts propios describen la entrega anterior,
retirada por no conservar la implementación del template. No acreditan los
scripts originales incorporados en la corrección del 3 de noviembre.

Completado localmente el 2026-11-02, antes de publicación por el principal.

- Inventario inicial: 166 archivos de staging sin datos ni instalaciones.
  Se mantienen idénticos 160 originales; cambian únicamente AGENTS, README,
  arquitectura, constitución y dos expectativas documentales de versión.
- Fuente de plantillas: git show de
  25208d23157626954906ffe7da32757c58d9a66e. Doce comparaciones byte a byte correctas.
  Catorce skills, seis scripts y siete documentos de agentes; todas las rutas de
  herramientas pertenecen a staff/miguel-rodriguez/asistenciapp. Enlaces relativos
  de README, AGENTS y arquitectura comprobados. Sin credenciales en la referencia.
- Constitución 4.2: aparte de cabecera y fila de enmienda, solo cambia §4.
  P1–P6, stack, calidad y seguridad se recuperan exactamente al retirar ese cambio.
  No se copió la constitución menos restrictiva de Ventura. Las specs 001–012
  permanecen intactas. La autorización es el encargo global expreso de Miguel;
  no se inventan aprobaciones separadas ni revisión de compañeros.
- Recorrido documental: los cinco momentos y sus límites coinciden en manual,
  constitución y principal. Issue/PR usan el mismo tipo; las casillas permanecen
  vacías en draft, el principal enlaza Closes/Development y el cierre automático
  sigue la rama predeterminada real. Ninguna revisión documental demuestra por sí
  sola que una sesión nueva ejecute esos pasos correctamente.
- bash -n de los seis scripts: correcto. python3 test_git.py en repositorio
  temporal con origin bare local: 17 comprobaciones correctas. Incluyen lectura
  de estado, pull fast-forward real, rama y reutilización sin reescribir, commit
  vacío sin incluir lo preparado, commit explícito conservando índice ajeno,
  rechazo de carpeta/ruta externa/traversal/tipo no admitido/issue incorrecta,
  rechazo en staging, rechazo de force y push normal verificado. Repositorio
  temporal retirado; ninguna llamada a GitHub para probar esos casos.
- Primera ejecución pytest: 300 pasan, cuatro fallan. Dos fallos eran permiso
  del sandbox para abrir sockets loopback y dos eran expectativas documentales
  exactas de la versión anterior4.1. Se actualizaron únicamente a4.2; las demás
  aserciones de privacidad, capas y comportamiento siguen intactas.
- Verificación final: Python del .venv existente con python -m pytest -q en la
  copia desechable, con permiso para los servidores locales propios de tests:
  **304 passed in10.78s**. Sin instalaciones ni cambios en la base real.
- node --test tests/browser/test-race-finale.mjs
  tests/browser/test-catalog-errors.mjs: **29 pasan**, cero fallos.
- La comparación final conserva app.py, asistencia/, static/, requirements,
  pytest.ini, datos y evidencias históricas. No se alteran intentos, permisos,
  tiempos ni resultados del producto. La comprobación de puerto8000 no muestra
  servidores propios; las pruebas HTTP detienen sus servidores.
- Publicación y revisores pendientes de verificación por el principal (T16).
  No hay commits, push ni solicitudes hechas por este agente de implementación.


## Recorrido adicional en navegador

El principal probó el código en una copia con base temporal: panel privado,
crear carrera, parrilla de quince nombres y QR, entrada de un alumno de prueba,
salida del profesor, registro con código y primer puesto; el profesor mostró el
podio de oro de ese participante. Se observó la fase final «Ya» y el podio; los
29 tests JavaScript verifican las fases sin atribuir a este recorrido la medida
de todos sus tiempos. El servidor de prueba en 8871 se detuvo y el puerto quedó
libre. No se usó la base real ni se publicó un túnel.

## Corrección de la copia · 2026-11-03

Miguel autorizó terminar y publicar esta corrección en #763, sin merge ni cierre.

- [x] C01 · CA-06: sustituir los seis scripts propios por los originales y añadir
  create-branch.sh; conservar siete scripts idénticos a la fuente fijada.
- [x] C02 · CA-06: copiar las siete skills correspondientes, cambiando únicamente
  las rutas de invocación; conservar los cinco momentos y Codex.
- [x] C03 · CA-06/08: corregir alcance, fuente, arquitectura y evidencia.
- [x] C04 · CA-06/07: bash -n, comparación fuente, smoke Git desechable, pytest y Node.
- [ ] C05 · CA-05/07: revisar protegidos, commits pequeños y push, actualizar PR763
  hacia staging y solicitar revisión a Jimena y Meghan.

### Evidencia de la corrección

- Fuente fijada: staging 9e45fcafa3f513df57335d45b4cf260f0b5374bb,
  exercises/git-workflow-agent-template. Sus scripts coinciden con la revisión
  fuente original 25208d23157626954906ffe7da32757c58d9a66e.
- Siete scripts idénticos byte a byte y siete skills idénticas tras sustituir
  únicamente ./tools/ por staff/miguel-rodriguez/asistenciapp/tools/. Bash -n de
  todos los scripts: correcto. No se amplían sus validaciones o interfaces.
- python3 /private/tmp/test_763_original_tools.py: 14 comprobaciones pasan en Git
  desechable con origin bare local. Ejercita los siete helpers: estado, pull, ambas
  ramas, commit vacío, commit de archivo explícito, índice ajeno conservado,
  rechazo de directorio, rechazo de force y push normal. Temporal Git eliminado.
- Python existente de .venv, python -m pytest -q en esta copia sin datos reales:
  304 passed in 5.89s. Node --test de test-race-finale.mjs y
  test-catalog-errors.mjs: 29 pasan, cero fallos. Sin instalaciones.
- Un primer intento de comprobación usó rutas relativas a la raíz desde la
  carpeta de la app y falló antes de probar nada. Se repitió desde la raíz Git;
  las pruebas Python/Node se ejecutaron desde la app, con los resultados anteriores.
- Contra el HEAD previo de #763 permanecen idénticos app.py, asistencia/, static/,
  tests/, requirements.txt, pytest.ini, constitución, manual AGENTS.md, README,
  los agentes ajenos a issue/PR/rama, las skills no afectadas, doce plantillas y
  specs 001–012.
- git diff --check correcto; ningún cambio en datos o código del producto.
- Revisión documental adicional: reglas editoriales de issue/PR centralizadas
  en plantillas; eliminada la conversión automática de tipos en sus referencias
  y en create-branch. Se conservan las siete skills originales de herramientas.
