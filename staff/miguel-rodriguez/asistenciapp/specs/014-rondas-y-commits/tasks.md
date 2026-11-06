# Tareas del flujo

Issue: #1028 · PR: #1031. Referencias: [spec](spec.md), [plan](plan.md).
Preparación e implementación autorizadas conjuntamente por Miguel el 2026-11-04;
no se atribuyen aprobaciones individuales de estos documentos.

- [x] T01 · CA-01–06: contrastar la fuente fijada y preparar la spec con criterios observables.
- [x] T02 · CA-01–06: preparar el plan y comprobar la constitución.
- [x] T03 · CA-01–06: preparar estas tareas antes de editar las instrucciones activas.
- [x] T04 · CA-01–04/06: actualizar el principal; observar rondas, historial y apertura previa.
- [x] T05 · CA-01–03: actualizar help-me-to-think; observar preguntas, recomendaciones y espera.
- [x] T06 · CA-01/02: actualizar grill-me; conservar su independencia del repositorio.
- [x] T07 · CA-01–03: actualizar grill-with-docs; consultar antes de preguntar.
- [x] T08 · CA-05: concretar mensajes en commit-changes sin cambiar el script.
- [x] T09 · CA-06: añadir el estado de 014 en AGENTS sin reescribir estados anteriores.
- [x] T10 · CA-04/06: describir el recorrido y los tres documentos nuevos en arquitectura.
- [x] T11 · CA-01–06: registrar nueve recorridos documentales y revisar el alcance.
- [x] T12 · CA-06: cotejar protegidos y regresión, comprobar diff y registrar límites.
- [ ] T13 · CA-05/06: commits pequeños, push y revisión solicitada hacia staging.

## Revisión documental · 2026-11-04

Lectura del resultado contra issue, spec, plan y template fijado en staging
2c727db4. En cada fila se aplicó la entrada a las instrucciones finales y se
contrastó la decisión indicada; no se ejecutó una sesión nueva de IA.

| Entrada | Decisión esperada | Observado por lectura |
| --- | --- | --- |
| Problema, resultado, alcance y comprobación resueltos | Usar contexto, explicar por qué y escribir la issue | El principal exige esos cuatro datos y evita repetir una entrevista resuelta. CA-03. |
| Tres decisiones pendientes | Devolver tres preguntas recomendadas y terminar | Principal, help-me-to-think y ambas skills admiten las preguntas necesarias con recomendación y espera. CA-01. |
| Solo una respuesta recibida | Conservarla y esperar las pendientes | El principal espera las respuestas; help-me-to-think conserva decisiones resueltas y requiere que no queden dudas. CA-01/02. |
| El subagente anterior no se puede reanudar | Pasar todo el historial al sustituto | El principal exige todas las preguntas y respuestas y el historial completo. CA-02. |
| Cambia el alcance con una decisión nueva | Consultar esa decisión, conservar lo resuelto | Principal y help-me-to-think distinguen decisiones nuevas de entrevistas resueltas. CA-02/03. |
| Issue escrita sin rama ni draft | Preparar draft antes de editar | Momento 2 exige preparación previa desde staging y conserva la secuencia de seis pasos. CA-04. |
| La rama y el draft ya existen | Reutilizar; preparar los tres documentos en orden | Reanudación conserva resultados y evita duplicados; momento 3 prepara spec, plan y tasks juntos. CA-04/06. |
| docs: clarify rounds in help-me-to-think.md frente a docs: update files | Aceptar el concreto, corregir el genérico; conservar apertura vacía | commit-changes nombra archivo o función, cambio y línea única; chore: open #N sigue exacto. CA-05. |
| Confirmación MCP inaccesible o PR con aprobaciones | Detener el paso; mantener controles y comparación | Las skills conservan bloqueo, sin sustitución silenciosa; el principal conserva base/head/commits y prohíbe merge automático. CA-06. |

No quedan contradicciones entre los cinco documentos activos, el manual, la
constitución 4.2 y la arquitectura. La regla de una sola pregunta desaparece solo
del flujo activo; la evidencia histórica de 001–013 permanece intacta.

## Conservación y regresión

El principal delegó la regresión en una copia desechable de esta misma base,
antes de los cambios exclusivamente documentales. Evidencia de esa ejecución
consultada en el informe temporal del 2026-11-04:

- Python 3.14.8 del .venv existente, sin instalaciones: `python -m pytest -q`:
  **304 passed in 5.81s**.
- Node v24.22.1: `node --test tests/browser/test-race-finale.mjs
  tests/browser/test-catalog-errors.mjs`: **29 pasan, 0 fallan, 0 omitidas**, 53.621 ms.
- La copia excluyó datos de ejecución, entornos y cachés, conservando catálogo y
  fixtures. Se retiró al terminar; puerto 8000 libre antes y después.

Después de editar las instrucciones se compararon hashes SHA-256 con staging
2c727db4549bbf93458f1aaf3b1fcb1f26942346: los **99 archivos protegidos** de app.py,
asistencia/, static/, tests/, requirements.txt y pytest.ini siguen idénticos.
Los **204 archivos versionados ajenos a los siete documentos activos previstos**
permanecen iguales, incluidos constitución, herramientas, plantillas y specs
001–013. Los únicos archivos nuevos son spec, plan y tasks de 014.

`git diff --check`: correcto. Sin cambios de producto ni dependencias, sin base
real ni credenciales de prueba. La regresión comprueba el mismo código conservado;
las instrucciones nuevas quedan acreditadas por los nueve recorridos de lectura.
La publicación y las solicitudes de revisión siguen pendientes de verificación.
