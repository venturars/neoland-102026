# Tareas de adaptación

Issue: #761. Referencias: [spec](spec.md), [plan](plan.md).
Preparación e implementación completas delegadas por Miguel el 2026-11-02.

- [x] T01 · CA-07: inventario y hashes iniciales de la copia staging sin datos.
- [x] T02 · CA-01–08: preparar y revisar spec, plan y tareas en ese orden.
- [x] T03 · CA-03/08: enmendar solamente §4 de la constitución y registrar 4.2.
- [x] T04 · CA-01–05: adaptar los cinco momentos en AGENTS.
- [x] T05 · CA-06: incorporar seis scripts seguros con rutas de esta app.
- [x] T06 · CA-06: incorporar catorce skills y referencia MCP pública de Codex.
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
- [ ] T16 · CA-05: publicación por el principal cuando termine la revisión; PR
  independiente hacia staging, enlazada a #761, con Jimena y Meghan como revisoras.

## Evidencia

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
