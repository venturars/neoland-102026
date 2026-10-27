# Tareas 002 · Spec antes del cambio

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Van marcadas hechas porque el texto ya está en los ficheros. La comprobación es leerlo.

---

## Fase A · Reglas

- [x] **T01** · `CONSTITUTION.md` §4, versión 3.0: sin spec aprobada no se escriben las instrucciones de uso, las comprobaciones, el resto de documentación de uso ni el código de una funcionalidad nueva. La issue, la rama y la pull request no sustituyen a la spec.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05.
  - *Hecha cuando:* el §4 dice esas cuatro clases de cambio y que la tarea del bootcamp no autoriza a escribir.
- [x] **T02** · `CONSTITUTION.md` §7, §8 y la fila 3.0 del historial. La carpeta es `staff/<usuario>/asistenciapp/` y quien aprueba es el usuario.
  - *Cubre:* CA-06.
  - *Hecha cuando:* §7 y §8 nombran esta carpeta y el usuario, y el historial tiene la enmienda 3.0 del 2026-10-22.

## Fase B · Manual e instrucciones de uso

- [x] **T03** · `AGENT.md`: la parada al inicio del flujo, el ok de cada fase, la carpeta de los comandos y la de edición.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06.
  - *Hecha cuando:* el flujo dice que, si falta la spec aprobada por el usuario, el agente no escribe, y la carpeta es `staff/<usuario>/asistenciapp/`.
- [x] **T04** · `README.md`: los `cd` de preparar el entorno y de arrancar la app.
  - *Cubre:* CA-01.
  - *Hecha cuando:* esos dos comandos usan `staff/<usuario>/asistenciapp/`.

## Fase C · Estado de la spec

- [x] **T05** · Estado de esta spec en `spec.md` y en la tabla de `AGENT.md`.
  - *Cubre:* CA-06.
  - *Hecha cuando:* la spec figura como implementada el 2026-10-22 y la tabla del `AGENT.md` dice lo mismo.
