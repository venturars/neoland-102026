# Plan: orden y total del CSV

Issue: #350.

## Cambios

- `asistencia/export.py`: conservar la firma `to_csv(rows, tz=None) -> str`.
  Ordenar una copia de las filas por `name.casefold()` antes de aplicar la
  protección contra fórmulas y añadir `Total de registros;N` mediante el mismo
  escritor CSV. Contar solo asistentes; la lista vacía produce 0.
- Mantener BOM, separador `;`, saltos CRLF, entrecomillado, nombres originales,
  conversión horaria, formato de fechas y protección de `_safe`.
- `tests/test_export.py`: sustituir la expectativa de orden por hora y cubrir
  nombres mezclados en mayúsculas/minúsculas, total, vacío y conservación del
  formato y la seguridad (CA-01 a CA-03).
- `tests/test_api.py`: actualizar la exportación existente y cubrir la sesión
  vacía; comprobar orden, total y descarga con sus cabeceras actuales (CA-04).
- `README.md`: indicar que la descarga ordena por nombre y termina con el total.

## Integración existente

`export_session` en `asistencia/usecases/attendance.py` ya llama a `to_csv`, y
`GET /api/sessions/<session_id>/export` devuelve ese contenido. Se conserva esta
ruta, su autenticación, nombre de descarga y errores. No requieren cambios
`app.py`, las acciones ni el almacenamiento; tampoco cambia el orden del panel.
La ordenación no elimina tildes ni incorpora reglas de ordenación regional.

## Comprobación de la constitución

- **P1:** la descarga sigue siendo independiente de la plataforma de clase.
- **P2:** el cambio se concentra en el exportador existente, sin nuevas capas.
- **P3:** se usa la biblioteca estándar; no cambian dependencias.
- **P4:** se exportan los mismos datos; no se añaden datos ni se cambia SQLite.
- **P5:** se mantiene la descarga desde la interfaz actual.
- **P6:** encabezados, total y documentación permanecen en español.
- **§5:** cada criterio queda cubierto por las pruebas de exportación y API;
  ejecutar `pytest` antes de cerrar la implementación.
- **§6:** conservar autenticación y protección contra fórmulas; no modificar
  códigos, registros, sesiones ni sus controles de seguridad.

## Verificación

Ejecutar primero las pruebas de exportación y API y después la suite completa.
Usar las bases temporales de las pruebas, sin abrir ni modificar la base local.
Revisar que el diff se limite a los archivos previstos y a esta documentación
SDD.

## Ajuste y resultados

Se adaptó `tests/test_readme_environment.py` al nuevo texto del README,
conservando la comprobación de integridad del contenido histórico.

- Pruebas de exportación y API: 51 aprobadas.
- Suite completa: 191 pruebas aprobadas.
- Prueba manual: descarga del CSV y acceso desde otro dispositivo mediante
  Cloudflare Tunnel.