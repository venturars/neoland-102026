# Tasks 006 · Límite de intentos por IP

Responsable: Jimena Durán.
Estado: preparación documental autorizada; ejecución pendiente de aprobación.
Spec: [spec.md](spec.md). Plan: [plan.md](plan.md).
Todas las casillas pendientes: todavía no se ha implementado ni ejecutado esta lista.

- [x] T01 Registrar la base de rama y hashes normalizados LF de specs 001–005,
  static/ y codes.py. Ejecutar suite base y conservar resultados reales (CA-08, CA-09).
- [x] T02 Crear tests/test_attempts.py para máximos 5/20, exceso 6/21 y aviso;
  comprobar que fallan por ausencia de la regla (CA-01, CA-04).
- [x] T03 Implementar domain/attempts.py con regla y error independientes de
  Flask y SQLite; tipos y documentación según AGENTS.md (CA-01, CA-04).
- [x] T04 Preparar pruebas documentales de la excepción de privacidad y versión
  vigente. Tras aprobar la enmienda descrita en el plan, actualizar únicamente
  P4, encabezado e historial de docs/CONSTITUTION.md a 3.0 (CA-09).
- [x] T05 Crear tests/test_blocklist.py: contar ventanas, podar intentos antiguos,
  conservar bloqueos al reabrir, separar IP de asistencia y preparar una base
  previa sin pérdida. Confirmar fallos esperados (CA-01, CA-06, CA-09).
- [x] T06 Añadir tablas y operaciones al almacén existente; sin cambiar tablas
  anteriores, sin reglas de máximo ni operación de desbloqueo (CA-01, CA-06, CA-09).
- [x] T07 Crear tests/test_rate_limit.py: quinto/sexto, veinte/veintiuno,
  ventanas móviles y bordes, respuesta de ban y blacklist; intento rechazado
  no registra asistencia (CA-01, CA-04).
- [x] T08 Añadir pruebas de intentos fallidos, lecturas excluidas, bloqueo entre
  clases, reinicio, permanencia, aislamiento entre IPs y ausencia de nuevos
  intentos tras bloqueo (CA-02, CA-03, CA-05, CA-06).
- [x] T09 Añadir pruebas de JSON y cabeceras con IP falsa; contar REMOTE_ADDR y
  mantener la IP falsa sin bloquear. Documentar el caso del proxy compartido
  sin atribuirle la IP pública individual (CA-07).
- [x] T10 Ampliar attendance.check_in con IP explícita e instante numérico;
  coordinar bloqueo, recuento y regla antes del registro existente (CA-01–CA-06).
- [x] T11 Pasar request.remote_addr desde app.py, mantener x_for=0 y traducir
  Banned a 429 con el aviso exacto. Verificar las pruebas de API (CA-04, CA-05, CA-07).
- [x] T12 Actualizar tests documentales de versión y arquitectura; incluir attempts
  en el control de dependencias sin relajar puertas SDD ni hashes (CA-09).
- [x] T13 Actualizar README: límites, privacidad, bloqueo permanente y efecto
  compartido del túnel. Extender su comprobación histórica exclusivamente a
  textos autorizados por la 006, manteniendo detección de cambios reales y LF/CRLF
  (CA-01, CA-04, CA-06–CA-09).
- [x] T14 Actualizar docs/ARCHITECTURE.md y seguimiento de la 006 en AGENTS.md,
  conservando las decisiones e historial de las specs anteriores (CA-09).
- [x] T15 Ejecutar suite completa con LF y CRLF, incluida toda regresión de
  códigos, asistencia y documentación; registrar resultados reales, comprobar
  hashes previos y git diff --check (CA-01–CA-09).
- [x] T16 Presentar evidencias y diff a Jimena; esperar autorización independiente
  para commit, push o PR. La futura PR apuntará a staging (CA-01–CA-09).

## Evidencias de preparación

- origin/staging actualizado y specs 001–005 presentes antes de crear la rama.
- Rama creada directamente en 8b5e696696df640a80b90b0d6fc09625ba7b1fd6.
- Decisiones funcionales aprobadas por Jimena en la conversación del 2026-10-23.
- Preparados solo estos tres documentos; sin código, tests nuevos ni enmienda aplicada.
- Resultados de pruebas de implementación: pendientes; no se afirma que la 006 pase.

## Evidencias de implementaci?n

- Suite base antes de cambiar c?digo: 147 passed en 8.35 s.
- Regla antes de implementar: fallo de colecci?n por ausencia de attempts.py;
  despu?s, sus seis casos pasan.
- Pruebas documentales iniciales: dos fallos esperados por los textos pendientes.
- Almac?n y API antes de implementar: 17 fallos esperados y 3 casos que ya pasaban.
- Regla, almac?n y privacidad tras el cambio: 11 passed en 1.63 s.
- API de l?mites y regresiones de API: 57 passed en 16.20 s.
- Suite completa local: 183 passed en 20.54 s.
- Copia temporal completa con LF: 183 passed en 18.56 s.
- Copia temporal completa con CRLF: 183 passed en 17.16 s.
- Los 23 hashes normalizados de integrity.json coinciden con la base de la rama:
  specs 001?005, static/ y asistencia/domain/codes.py permanecen intactos.
- El README conserva el hash hist?rico tras revertir solo cambios autorizados;
  los casos de mutaci?n detectan texto, espacios, salto final, l?mite, t?nel y privacidad.
- git diff --check pasa; solo hay cambios de proyecto dentro de la carpeta de Jimena.
- Sin servidores, t?neles ni scripts de ataques. Las pruebas usan bases temporales.
- La base sin seguimiento de first-app queda intacta y fuera del trabajo.
- Resultados presentados para revisi?n humana; sin commit, push ni PR.
