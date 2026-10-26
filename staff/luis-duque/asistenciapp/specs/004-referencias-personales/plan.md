# Plan 004 · Quitar referencias personales

Estado: aprobado el 2026-10-25. Autorizada la preparación de las tareas.
Spec: [spec.md](spec.md), aprobada el 2026-10-25.

Este documento explica cómo se quitan de la spec 001 el nombre de Victor y las pruebas hechas con su móvil. Cubre CA-01, CA-02 y CA-03.

## 1. Qué se toca

Solo tres archivos de `specs/001-checkin-codigo/`. Se cambia la atribución personal. La fecha, la decisión y el resultado de cada prueba se quedan.

- `plan.md`: el apartado «Decisiones tomadas por Victor» pasa a llamarse «Decisiones tomadas». La lista de cinco decisiones no cambia.
- `spec.md`: «Victor aceptó las propuestas» pasa a «las propuestas quedaron aceptadas». «Victor detecta que un alumno…» pasa a «se detecta que un alumno…».
- `tasks.md`: en las notas del 2026-10-20 se quita el nombre. «desde su móvil» pasa a «desde un móvil». La prueba de registrarse dos veces y quitar un registro queda como «Probar con un móvil…», con la misma fecha y el mismo resultado.

No se crean archivos de la aplicación. No se tocan el README, el código de pasar lista ni las specs 002 y 003.

## 2. Comprobación de la constitución

- P1. No cambia el registro de asistencia ni lo ata a una plataforma.
- P2. El cambio es el mínimo que cumple la spec: se quita el nombre y el móvil de una persona. No se reescribe la spec 001.
- P3. No se añade ninguna dependencia.
- P4. No se guardan datos de alumnos. Se deja de nombrar a una persona en las notas.
- P5. No se cambian pantallas.
- P6. El texto que queda sigue en español.
- §5. CA-01 se comprueba buscando «Victor» en asistenciapp: solo puede aparecer en esta spec, donde se dice a quién se quita. CA-02 se comprueba leyendo las cinco decisiones y las notas del 2026-10-20. CA-03 se comprueba viendo que el código, el README y las specs 002 y 003 no entran en el cambio. No hay comportamiento que automatizar.
- §6. No cambia códigos, sesiones ni validación de entradas.

## 3. Fuera de este plan

La redacción en la spec 001 espera la aprobación de las tareas.
