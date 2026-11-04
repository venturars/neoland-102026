# Tareas de consultas y legibilidad

Issue: #1033 · PR: #1035. Referencias: [spec](spec.md), [plan](plan.md).
Preparación e implementación bajo la autorización conjunta de Miguel.

- [x] T01 · CA-01–06: preparar spec, plan y tareas en orden antes de editar el código.
- [x] T02 · CA-01/03: fijar los textos SQL anteriores como referencia de comparación.
- [x] T03 · CA-01–04: extraer SQL y aclarar storage/sqlite.py.
- [x] T04 · CA-01–04: extraer SQL y aclarar storage/races.py.
- [x] T05 · CA-02/03: separar los pasos densos de storage/roster.py.
- [x] T06 · CA-02/05: aclarar tiempos y pasos de domain/codes.py.
- [x] T07 · CA-02/05: aclarar caracteres de domain/names.py.
- [x] T08 · CA-02/05: aclarar contadores de domain/registration.py.
- [x] T09 · CA-02/05: aclarar validación y búsqueda de domain/roster.py.
- [x] T10 · CA-06: actualizar árbol y responsabilidades en arquitectura.
- [x] T11 · CA-06: registrar el estado de 015 en el manual, conservando el historial.
- [x] T12 · CA-01–06: verificar pruebas enfocadas y suites completas en copia desechable.
- [x] T13 · CA-03/04/06: revisar consultas, parámetros, transacciones, protegidos y evidencia.
- [ ] T14 · CA-06: commits pequeños, push y revisión solicitada hacia staging.

## Evidencia

## Verificación · 2026-11-04

Python3.14.8 del .venv ya existente y Node24.22.1. Sin instalaciones, en una
copia desechable sin datos de trabajo; se conservaron el catálogo y los fixtures.

- `python -m pytest -q`: **313 pasan en 6.56s**; las304 pruebas existentes y
  nueve comprobaciones nuevas en `tests/test_storage_resources.py`.
- `node --test tests/browser/test-race-finale.mjs
  tests/browser/test-catalog-errors.mjs`: **29 pasan, cero fallos/omitidas**,
  43.893ms. Son pruebas de presentación existentes, no un recorrido manual nuevo.
- Los50 archivos nuevos conservan exactamente los textos anteriores, incluido
  el esquema de once sentencias. Las51 llamadas originales siguen sus recursos;
  cierre y limpieza comparten la misma consulta de revocación.
- Comparación ejecutada contra staging16e940fa en dos bases temporales, con las
  mismas entradas y aleatoriedad fijada: **65 registros de ejecución y parámetros,
  25 resultados y14 eventos reales de transacción idénticos**. El callback de
  SQLite incluyó los BEGIN/COMMIT implícitos, además de los explícitos.
- Revisión independiente: textos y parámetros de las51 llamadas y sus ámbitos de
  conexión conservados. Las472 comparaciones de dominio cubrieron límites de
  códigos, rechazos, ventanas, normalización, frecuencia y resolución de alumnos.
- Smoke independiente desde otra carpeta: primer registro creado=True,
  repetido=False, mismos datos y fecha; reinicialización conserva el volcado y
  token del profesor; una carrera pendiente desaparece al hacer rollback.

| Criterio | Comprobación |
| --- | --- |
| CA-01 | Test de ausencia de SQL embebido, carga desde otra carpeta y50 textos exactos. |
| CA-02 | Lectura independiente del diff: nombres descriptivos, cursor y resultado separados; sin nuevos helpers o capas. |
| CA-03 | Comparación ejecutada y suites de asistencia, almacenamiento y compatibilidad con fixtures anteriores. |
| CA-04 | Suites de reservas, recuperación, límites, concurrencia y catálogo; transacciones idénticas y prueba de fallo de lectura sin commit. |
| CA-05 | Tests de códigos y nombres, resolución por primera coincidencia y comparación independiente de dominio. |
| CA-06 | Tres documentos preparados antes del código, arquitectura y estado actualizados; alcance final cotejado. |

## Correcciones durante la revisión

Separar la consulta del registro expuso un cursor de INSERT que podía quedar
sustituido por el cursor de SELECT. Se conserva el cursor de inserción y se
captura su resultado antes de consultar. La prueba nueva exige creado=True para
el primero, False para el duplicado y los datos originales en ambos casos.

La revisión final separó también conversión de ventana, firma, digest y formato
del código, y los pasos de normalización del nombre. Se repitieron las suites
completas después de ese ajuste.

## Conservación y limpieza

Los202 archivos anteriores fuera de los siete módulos y dos documentos previstos
siguen idénticos a la base: casos de uso, app.py, pantallas, seguridad, constitución,
requisitos, scripts, seis consultas del catálogo, pruebas y fixtures anteriores,
y specs001–013. La spec014 pertenece a otra PR y no se incorpora aquí.

Las bases y copias de prueba se retiraron. Puerto8000 libre al terminar.
`git diff --check`: correcto. No se modifican bases reales ni se crean recursos
remotos de prueba. La rama parte de staging y la PR1035 mantiene ese destino.
El parche documental pendiente de la PR1031 se comprobó con git apply --check
sobre este resultado: aplica sin conflictos en AGENTS y arquitectura, sin escribir
archivos ni incorporar el cambio de aquella PR.
La publicación final y las solicitudes de revisión siguen pendientes.

