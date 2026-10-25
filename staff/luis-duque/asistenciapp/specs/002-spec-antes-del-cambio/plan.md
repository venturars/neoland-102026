# Plan 002 · Spec antes del cambio

Estado: propuesta, pendiente de aprobación.
Spec: [spec.md](spec.md), aprobada el 2026-10-25.

Este documento explica cómo se deja por escrito la regla de no cambiar asistenciapp sin una spec aprobada. Cubre CA-01 a CA-07.

## 1. Qué se toca

Se crea un solo archivo: `asistencia/AGENTS.md`.

Ese manual dice:

- Sin una spec aprobada que cubra el cambio en asistenciapp, lo primero que se escribe es la spec y se espera el ok. No se modifica el cambio. La regla incluye los archivos que están fuera de `asistencia/`.
- Después van el plan, las tareas y la implementación, cada uno con su ok.
- Si la spec activa no cubre el pedido, se abre otra. La spec 001 no se reutiliza ni se reescribe.
- Una issue, una rama o una pull request no autorizan el cambio si falta esa spec.
- El ámbito es esta aplicación. Quien aprueba cada fase es quien es responsable de ella. El manual no nombra a una persona ni a otra carpeta.

No se tocan el README, la spec 001 ni el comportamiento de pasar lista.

## 2. Comprobación de la constitución

- P1. No cambia el registro de asistencia ni lo ata a una plataforma.
- P2. El cambio es un solo manual, con la regla mínima que pide la spec.
- P3. No se añade ninguna dependencia.
- P4. No se guardan datos de alumnos.
- P5. No se cambian pantallas.
- P6. El manual queda en español.
- §5. CA-01 a CA-07 se comprueban leyendo `asistencia/AGENTS.md` y comprobando que la spec 001 no ha cambiado. No hay comportamiento de la aplicación que automatizar.
- §6. No cambia códigos, sesiones ni validación de entradas.

## 3. Fuera de este plan

La redacción de `asistencia/AGENTS.md` espera la aprobación de las tareas.
