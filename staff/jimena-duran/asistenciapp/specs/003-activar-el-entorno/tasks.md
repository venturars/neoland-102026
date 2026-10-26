# Tasks 003 · Separar activación y arranque

Responsable: Jimena Durán. Issue #240. PR #241.
Spec, plan y tareas aprobados por Jimena Durán el 2026-10-22.

- [x] T01 Revisar la rama y registrar el SHA256 del README antes de editarlo.
  Resultado: referencia de integridad para demostrar cambios mínimos (CA-04).
- [x] T02 Crear tests/test_readme_environment.py con comprobaciones de títulos,
  tabla, separación de bloques y reversión en memoria comparada con el hash base.
  Resultado: cobertura automatizada de CA-01–CA-04.
- [x] T03 Ejecutar las nuevas pruebas sobre el README actual.
  Resultado: fallos esperados por el título y la separación pendientes (CA-01–CA-03).
- [x] T04 Renombrar el título de la sección 2 e insertar el subtítulo de arranque.
  Resultado: activación y arranque separados, sin modificar otro contenido (CA-01–CA-04).
- [x] T05 Añadir la fila de seguimiento de la 003 en AGENT.md.
  Resultado: spec activa y estado real registrados, conservando las filas anteriores.
- [x] T06 Ejecutar las pruebas nuevas y pytest completo desde la aplicación.
  Resultado: CA-01–CA-04 verificados y suite sin regresiones.
- [x] T07 Revisar el diff contra jimena-duran-221020263 y el contenido del README.
  Resultado: solo cambios de la 003; comandos, rutas y demás secciones intactos (CA-04).
- [x] T08 Registrar resultados y estados finales en el SDD y AGENT.md.
  Resultado: evidencias reales de verificación, sin dar por hecha aprobación humana final.

No modificar runtime, constitución, arquitectura ni specs anteriores.
No arrancar servidores o túneles. No hacer commit ni push sin autorización.
## Evidencias

- SHA256 del README previo: af7400a1c0349b55266b1292ae6ce64e7589229eacf94244cd66e2e6733f981b.
- Antes del cambio: las cuatro pruebas documentales fallan por las condiciones pendientes.
- Después: suite completa, 97 passed en 5.59 s (93 anteriores y 4 nuevas).
- La reversión de los dos cambios en memoria reproduce el hash previo.
- Sin servidores ni túneles, sin commit ni push.
