# Tareas — rondas y commits

Issue: #1022 · PR: #1023.
Referencias: [spec.md](spec.md) y [plan.md](plan.md).
Autorización conjunta de Miguel el 2026-11-04, descrita en la spec.

- [x] Contrastar la issue, las instrucciones de la app y la referencia del template.
- [x] Ajustar el orquestador: rondas, historial y reconocimiento de Empezar.
- [x] Alinear help-me-to-think y ambas skills de entrevista.
- [x] Añadir la regla de mensajes concretos conservando la apertura vacía.
- [x] Actualizar arquitectura e inventario de los documentos SDD.
- [x] Recorrer los escenarios y registrar resultados de lectura.
- [x] Ejecutar formato y lint y revisar el diff completo.
- [ ] Publicar y verificar PR #1023 hacia staging, enlace #1022 y revisores.

## Evidencia · 2026-11-04

Recorridos por lectura de las instrucciones resultantes:

| Entrada | Decisión esperada | Observación |
| --- | --- | --- |
| Dos decisiones pendientes en una tarea | Devolver ambas preguntas con recomendaciones y terminar | help-me-to-think permite las preguntas necesarias; exige recomendación para cada una y termina la invocación. |
| El principal recibe preguntas | Esperar antes de seguir | Pensar pide mostrar preguntas y recomendaciones y esperar las respuestas antes de invocar otra vez. |
| Continuar con otro subagente | Entregar todo el historial | Pensar exige historial completo de preguntas y respuestas en cada llamada si no se reanuda el mismo subagente. |
| Una decisión ya está resuelta y aparece otra nueva | Conservar la primera y consultar la nueva | Entrada y estado conserva respuestas; help-me-to-think conserva decisiones resueltas. |
| La respuesta existe en el repo | Consultarla antes de preguntar | grill-with-docs conserva su punto 2; help-me-to-think la utiliza primero cuando el repositorio responde. |
| Issue escrita y trabajo siguiente que edita archivos | Preparar o reanudar Empezar antes de editar | Entrada y estado y Escribir remiten a Empezar; se conservan staging, rama, commit, push, draft y ambos enlaces. |
| Commit docs: clarify interview rounds in help-me-to-think.md | Aceptar descripción concreta | commit-changes exige archivo o función y cambio concreto; el ejemplo contiene ambos. |
| Commit docs: update files | Rechazar descripción genérica | commit-changes identifica update files como ejemplo que evitar. |
| Apertura vacía chore: open #1022 | Conservar el formato de apertura | La regla mantiene explícitamente chore: open #N. |

Estas observaciones verifican documentación, no una ejecución nueva de entrevistas
ni publicaciones de prueba. Se comprobaron también ausencia de la restricción
«Haz una pregunta cada vez» en los cinco textos afectados, presencia del historial
completo y conservación de la delegación y las rutas literales de commit.

pnpm format y después pnpm lint: ambos terminaron con código 0. El formateador
no cambió JavaScript. git diff --check: código 0. Revisión completa del diff:
cinco instrucciones activas, resumen de arquitectura, árbol y tres documentos SDD.
Scripts, plantillas, código, datos, dependencias y AGENTS.md permanecen intactos.
Publicación y solicitudes de revisión pendientes del principal.
