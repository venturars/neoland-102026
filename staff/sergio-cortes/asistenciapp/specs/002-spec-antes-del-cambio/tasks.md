# Tareas 002 · Spec antes de tocar la app

> Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md)

---

- [x] **T01** · Enmendar `CONSTITUTION.md` §4 (CA-01, CA-02, CA-03, CA-05).
  - Sustituir la obligación de «no hay código sin spec» por «ningún fichero de la app sin spec aprobado».
  - Añadir que issue, rama y pull request no sustituyen al spec.
  - Subir versión a 2.2 y fila en historial de enmiendas.

- [x] **T02** · Enmendar `CONSTITUTION.md` §7 y §8 (CA-06).
  - §7: `staff/sergio-cortes/asistenciapp/`.
  - §8: aprueba quien trabaja en `staff/ventura-rodriguez/asistenciapp/`.

- [x] **T03** · Actualizar `AGENT.md` §2, §2.4, §4, §5 y §6 (CA-01, CA-02, CA-03, CA-06).
  - Cada cambio en la app; al empezar solo `spec.md`; ok de Ventura en cada fase.
  - Rutas y «solo se edita dentro de…» → carpeta Sergio.
  - Quitar Victor de reglas vivas; enmiendas y terminado → Ventura.

- [x] **T04** · Actualizar `AGENT.md` §7 (CA-04).
  - Fila `002-spec-antes-del-cambio` implementada.
  - Bot de Discord sin número 002.

- [x] **T05** · Comprobación manual según plan §3 y `pytest` (CA-07, regresión).
  - `git diff specs/001-checkin-codigo/` vacío; README de la app sin cambios en T01–T04.
  - `pytest` en verde.
