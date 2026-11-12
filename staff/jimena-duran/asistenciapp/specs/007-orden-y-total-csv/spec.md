# Orden y total de registros en el CSV

Issue: #350.

## Problema

El profesor necesita consultar y descargar el CSV de asistencia con los nombres ordenados alfabéticamente y el total de registros, incluso cuando no hay asistentes.

## Criterios de aceptación

- **CA-01** — Dado un registro con varios asistentes, cuando se exporta, entonces
  las filas aparecen ordenadas alfabéticamente por nombre, sin distinguir
  mayúsculas de minúsculas.
- **CA-02** — Dado cualquier registro, cuando se exporta, entonces el CSV conserva
  las columnas `Nombre;Hora`, el separador, las fechas, tildes, comillas y la
  protección actual contra fórmulas, y termina con `Total de registros;N`, donde
  N coincide con la cantidad de asistentes.
- **CA-03** — Dado un registro vacío, cuando se exporta, entonces el CSV conserva
  sus encabezados y termina con `Total de registros;0`.
- **CA-04** — Dado que se solicita la exportación mediante la API, cuando se
  genera el CSV, entonces cumple CA-01, CA-02 y CA-03 igual que las demás
  exportaciones.

## Fuera de alcance

No se cambian dependencias, almacenamiento ni otras funcionalidades de la app.
