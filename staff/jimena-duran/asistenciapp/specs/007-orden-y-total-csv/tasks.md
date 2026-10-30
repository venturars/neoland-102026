# Tareas: orden y total del CSV

Issue: #350.

- [x] T01 — Actualizar `tests/test_export.py` para comprobar orden por nombre sin
  distinguir mayúsculas, total, vacío y conservación del formato y la protección
  contra fórmulas (CA-01 a CA-03).
- [x] T02 — Actualizar `tests/test_api.py` para comprobar orden, total y sesión
  vacía en la descarga, conservando las cabeceras actuales (CA-04).
- [x] T03 — Ajustar `to_csv` en `asistencia/export.py` para ordenar por
  `name.casefold()` y añadir el total, conservando firma, formato y protección
  actuales (CA-01 a CA-03).
- [x] T04 — Actualizar `README.md` para explicar el orden por nombre y la fila
  final de total de registros (CA-01 a CA-03).
- [x] T05 — Ejecutar las pruebas de exportación y API, y después `pytest`, usando
  las bases temporales de las pruebas (CA-01 a CA-04).
- [x] T06 — Revisar el diff para confirmar que solo cambian los archivos del
  plan y la documentación SDD; conservar dependencias, almacenamiento y demás
  funcionalidades (CA-01 a CA-04 y límites de la spec).
