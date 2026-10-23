# Tasks 005

Responsable: Jimena Durán. Issue #244. Preparación e implementación autorizadas por Jimena Durán el 2026-10-22.

- [x] T01 Registrar inventario y hashes de static/ y specs 001–004 (CA-07).
- [x] T02 Crear comprobaciones de arquitectura, documentos y enlaces (CA-01–CA-06, CA-08, CA-09).
- [x] T03 Ejecutarlas y confirmar fallos por la organización pendiente (CA-01–CA-06).
- [x] T04 Mover y enmendar la constitución a versión 2.3 (CA-01, CA-09).
- [x] T05 Renombrar la guía, actualizar enlaces, árbol y escritura de código (CA-03, CA-08).
- [x] T06 Crear docs/ARCHITECTURE.md con límites y exclusiones del plan (CA-02).
- [x] T07 Crear paquetes y mover códigos y nombres a domain; actualizar imports de tests (CA-04).
- [x] T08 Crear reglas de sesión con errores independientes de HTTP (CA-04, CA-07).
- [x] T09 Mover persistencia a storage/sqlite.py y encapsular conexiones (CA-05).
- [x] T10 Implementar preparación y consultas de sesiones en usecases/attendance.py (CA-06, CA-07).
- [x] T11 Implementar registro, cierre, eliminación y exportación en las acciones (CA-06, CA-07).
- [x] T12 Delegar desde app.py conservando estados, mensajes y firma de creación (CA-06, CA-07).
- [x] T13 Adaptar pruebas documentales 002–004 solo a cambios autorizados por la 005 (CA-08, CA-09).
- [x] T14 Ejecutar suite completa y corregir regresiones sin relajar contratos (CA-01–CA-09).
- [x] T15 Comparar hashes, revisar alcance del diff y registrar resultados reales (CA-07).
- [x] T16 Actualizar seguimiento SDD y presentar resultados antes de commit o push (CA-01–CA-09).
## Evidencias locales

- Antes de reorganizar: pruebas nuevas de arquitectura, 6 fallos esperados y 2 aciertos.
- Después: suite completa, 108 passed en 6.54 s, con Python 3.14.7.
- 8 comprobaciones nuevas: dependencias mediante AST, documentos, guía e integridad.
- integrity.json registra hashes anteriores de static/ y specs 001–004;
  todos coinciden tras la implementación.
- pytest de API conserva autenticación, validación, estados HTTP, duplicados,
  cierre, eliminación y exportación. No se modificaron sus aserciones.
- diff --check sin errores. Solo cambios de la 005 respecto de la rama 004.
- Sin servidores ni túneles. Sin commit ni push de implementación.

## Corrección de revisión de PR #246 (2026-10-23)

- Miguel detectó una discrepancia en el hash de tasks.md de la 004.
- Causa: hashes de bytes locales con CRLF (mezclados con LF en ese archivo)
  y rutas con separadores de Windows. La suite local original pasaba 108 tests.
- integrity.json usa ahora rutas POSIX y SHA256 con saltos LF, contrastados
  con la base publicada 180cd52044b38d96ab5d2de748dc757ed4774d9a.
- La prueba normaliza exclusivamente CRLF a LF en memoria y comprueba también
  el inventario completo. Siete casos cubren LF, CRLF, mezcla de ambos y cambios
  reales de contenido, espacios, salto final y retorno aislado.
- Suite completa: 115 passed en 6.45 s. Comprobaciones de arquitectura e
  integridad sobre copia temporal con LF: 15 passed en 0.11 s.
- Sin diferencias de static/ ni specs 001–004 contra la base; diff --check pasa.
- Sin commit ni push.
