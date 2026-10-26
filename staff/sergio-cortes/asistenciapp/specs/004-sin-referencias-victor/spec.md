# Spec 004 · Sin referencias personales ajenas en la documentación

> Estado: **Implementada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22 · Issue: #245

---

## 1. Problema

La copia del ejercicio en `staff/sergio-cortes/asistenciapp` sigue nombrando a quien trabajó en otra carpeta bajo `staff/` y rutas de esa otra copia. Eso aparece en specs ya terminadas, en notas de verificación y en textos que describen quién aprueba o quién probó.

Quien trabaja en esta carpeta no es la misma persona; un compañero que lee la documentación puede creer que los pasos, las aprobaciones o las pruebas son responsabilidad de otra persona. La issue #245 pide dejar la copia libre de esas referencias personales sin cambiar el comportamiento de la app.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Documentación y specs que hablen de «quien trabaja aquí» o de forma neutra, no de otra persona concreta. |
| **Compañero que revisa la issue #245** | Poder comprobar con la búsqueda descrita en esa issue que no quedan referencias personales ni rutas de la otra copia. |
| **Agente** | Saber qué ficheros puede tocar en la implementación sin saltarse esta spec. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero que la documentación de la app no nombre a quien mantiene otra copia del ejercicio, para que refleje quién trabaja aquí.
- **HU-02**: Como compañero que prueba la issue #245, quiero que ningún texto bajo `staff/sergio-cortes/asistenciapp` apunte a otra carpeta personal bajo `staff/`, para seguir los comandos y enlaces sin confusión.
- **HU-03**: Como persona que lee el historial de specs y tareas, quiero que las fechas y el sentido de las decisiones y verificaciones sigan claros, pero sin nombres personales de quien no trabaja aquí.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que este cambio siga el flujo spec → plan → tasks, para no mezclarlo con issues o ramas del bootcamp sin spec propia.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Alcance de la búsqueda (HU-02)

- **CA-01**: **Dado** el árbol `staff/sergio-cortes/asistenciapp`, **cuando** alguien aplica la comprobación de referencias personales de la issue #245, **entonces** no aparecen coincidencias en ningún fichero de ese árbol.
- **CA-02**: **Dado** el mismo árbol, **cuando** alguien aplica la comprobación de rutas de la otra copia descrita en la issue #245, **entonces** no aparecen coincidencias en ningún fichero de ese árbol.

### Documentación viva (HU-01)

- **CA-03**: **Dado** la constitución, el manual del agente y el README de la app en esta carpeta, **cuando** se leen, **entonces** no nombran a otra persona concreta ni rutas de otra copia bajo `staff/`.

### Specs y tareas (HU-03)

- **CA-04**: **Dado** cualquier `spec.md`, `plan.md` o `tasks.md` bajo `specs/` en esta app, **cuando** se leen los apartados de decisiones, historial o verificación manual, **entonces** no nombran a otra persona concreta ni rutas de otra copia; las fechas y el significado de lo verificado o decidido se mantienen en lenguaje neutro.
- **CA-05**: **Dado** la spec `001-checkin-codigo`, **cuando** se aplican estos cambios, **entonces** el comportamiento descrito de la app y los identificadores de criterios (`CA-xx`, `HU-xx`) no cambian; solo se neutralizan referencias personales y rutas ajenas a esta carpeta.

### Lo que no cambia (HU-03)

- **CA-06**: **Dado** el código, los tests y la base de datos de la app, **cuando** se cierra esta spec, **entonces** no se modifican en esta tarea.
- **CA-07**: **Dado** `pytest`, **cuando** se ejecuta tras la implementación, **entonces** sigue pasando igual que antes de estos cambios de documentación.

### Manual del agente (HU-04)

- **CA-08**: **Dado** que esta spec pasa a implementada, **cuando** se mira la tabla de estado en `AGENTS.md` §7, **entonces** incluye una fila para `004-sin-referencias-victor` con la fase correspondiente.

---

## 5. Fuera de alcance

- Cambiar el comportamiento de la app, pantallas, API o reglas de negocio.
- Editar código fuente o tests (salvo que una task futura descubra referencias en comentarios; entonces se decide en el plan).
- Modificar otras carpetas del repositorio fuera de `staff/sergio-cortes/asistenciapp`.
- Borrar o reescribir el historial funcional de la spec `001-checkin-codigo` (qué se decidió y qué se probó); solo quitar o neutralizar referencias personales y rutas ajenas.
- El bot de Discord.

---

## 6. Preguntas abiertas

Ninguna por ahora. Si al planificar aparecen referencias en comentarios de código, se añade una task concreta en el plan sin ampliar el alcance funcional.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-22 | Borrador inicial | Issue #245; rama base `233-docs-env-setup-staff-readme` |
| 1.0 | 2026-10-22 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-22 | Implementada | T01–T12; búsquedas issue #245 sin coincidencias; pytest en verde |
