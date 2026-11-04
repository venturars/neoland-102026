# Tareas — comprobaciones del workflow

Issue: #893 · PR: #897.
Referencias: [spec aprobada](spec.md) y [plan aprobado](plan.md).
Estado: aprobadas por Miguel el 2026-11-04.

- [x] **T01 · Confirmar el punto de partida.** Leer estado de rama y PR #897,
  issue #893 y documentos aprobados. Comparar el orquestador con el template
  fijado en la spec. Resultado: identificar los cambios documentales necesarios
  y conservar cualquier trabajo local ajeno.
- [x] **T02 · Ajustar la validación.** Actualizar «Entrada y estado» del
  orquestador con los cuatro datos de una tarea definida, la comprobación contra
  el proyecto y la elección por estado real. Resultado: tarea definida pasa a
  create-issue con explicación breve; dudas o contradicciones pasan a
  help-me-to-think y esperan respuesta antes de publicar.
- [x] **T03 · Precisar continuidad y apertura.** Conservar respuestas resueltas,
  consultar decisiones pendientes o nuevas y pedir datos necesarios para otros
  momentos. Explicitar que la secuencia completa de «Empezar» precede a editar
  el proyecto. Resultado: reanudación sin duplicados, con las responsabilidades
  actuales del principal, subagentes y skills intactas.
- [x] **T04 · Actualizar las guías.** Ajustar el resumen de responsabilidades en
  docs/ARCHITECTURE.md y añadir esta carpeta con spec, plan y tareas a
  docs/TREE.md. Resultado: referencias válidas y resumen coherente con el
  orquestador, sin repetir su procedimiento completo.
- [x] **T05 · Recorrer los escenarios.** Sobre las instrucciones resultantes,
  registrar entrada, decisión esperada y observada para: tarea definida; tarea
  ambigua; tarea contradictoria; entrevista reanudada sin decisiones nuevas;
  entrevista con una decisión nueva; inicio de tarea; apertura parcialmente
  completada. Añadir «pedir revisión» sin indicar revisores: debe preguntar quiénes
  son antes de solicitar revisiones o sacar la PR de draft. Resultado: se
  satisfacen CA-01 a CA-03 y la petición de datos necesarios en otros momentos.
  Estos recorridos son de lectura y no crean issues, ramas ni PRs de prueba
  en GitHub.
- [x] **T06 · Revisar la entrega.** Cotejar el diff completo con issue, spec y
  plan. Comprobar conservación de SDD, delegación nativa, acceso MCP, rutas y
  protecciones de revisión. Ejecutar pnpm format y después pnpm lint desde la
  app; revisar lo que haya modificado el formateador. Resultado: CA-04 cumplido,
  comandos y resultados registrados, diferencias limitadas al alcance aprobado.
- [ ] **T07 · Publicar.** Crear commits pequeños mediante el flujo delegado y
  hacer push a la rama de #893. Actualizar la descripción de #897 con el cambio
  y las comprobaciones reales; verificar base staging y enlace con #893 en cuerpo
  y Development. Resultado: entrega publicada. Solicitar revisión cuando Miguel
  nombre revisores, tras terminar los cambios y comprobaciones.

## Evidencia

Revisión documental del 2026-11-04 sobre las instrucciones resultantes:

| Entrada | Decisión esperada | Observación al recorrer las instrucciones |
| --- | --- | --- |
| Crear issue con problema, resultado, alcance y comprobación definidos | Explicar y delegar a create-issue | Entrada y estado exige los cuatro datos y ese destino. |
| Crear issue con alcance pendiente | Preguntar antes de publicar | Deriva a help-me-to-think y espera respuesta. |
| Petición contradictoria con documentos del proyecto | Aclarar antes de publicar | Exige contraste documental y deriva la contradicción. |
| Reanudar entrevista resuelta | Conservar respuestas | Entrada y estado conserva respuestas ya resueltas. |
| Reanudar con una decisión nueva | Preguntar por esa decisión | La regla identifica decisiones pendientes o nuevas. |
| Empezar tarea nueva | Completar preparación antes de editar | Empezar contiene staging, rama, commit, push, draft y ambos enlaces, en orden. |
| Reanudar tras publicar rama | Consultar lo completado, evitar duplicados | Remite a Reanudación y límites, que exige lectura antes de repetir. |
| Pedir revisión sin revisores | Preguntar antes de solicitar o salir de draft | Entrada exige datos necesarios; Pedir revisión exige nombres de Miguel. |

Son recorridos de lectura, no ejecuciones de agentes ni escrituras de prueba en
GitHub. No se crearon recursos para estos escenarios.

pnpm format y después pnpm lint: ambos terminaron con código 0. El formateador
no cambió JavaScript. git diff --check: código 0. Diff revisado: orquestador,
resumen de arquitectura, inventario y tres documentos SDD. AGENTS.md, scripts,
skills, plantillas, código, datos y dependencias permanecen intactos.

T07 pendiente de publicación y verificación remota.
