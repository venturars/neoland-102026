# Tareas 004 · Sin referencias personales ajenas

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22 · Aprobado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · Spec `001-checkin-codigo`

- [x] **T01** · En `specs/001-checkin-codigo/spec.md`, neutralizar §7 (preguntas abiertas) e historial v1.2.
  - *Cubre:* CA-04, CA-05.
  - *Hecha cuando:* el fichero no contiene el nombre personal ni rutas ajenas; fechas y decisiones siguen claras.

- [x] **T02** · En `specs/001-checkin-codigo/plan.md`, renombrar §8 a «Decisiones tomadas» (sin atribución personal).
  - *Cubre:* CA-04, CA-05.
  - *Hecha cuando:* el título y el cuerpo de §8 no nombran a nadie ajeno a esta carpeta.

- [x] **T03** · En `specs/001-checkin-codigo/tasks.md`, neutralizar las notas de T20 y T25 (verificación manual móvil y v1.2).
  - *Cubre:* CA-04, CA-05.
  - *Hecha cuando:* las notas entre paréntesis y el enunciado de la prueba móvil son neutros y conservan fechas y resultados.

## Fase B · Spec `002-spec-antes-del-cambio`

- [x] **T04** · En `specs/002-spec-antes-del-cambio/plan.md`, neutralizar §2.2 (reglas vivas) y la decisión «Quién aprueba» en §5.
  - *Cubre:* CA-04.
  - *Hecha cuando:* no quedan nombres personales ni slug/ruta de otra copia.

- [x] **T05** · En `specs/002-spec-antes-del-cambio/tasks.md`, neutralizar el criterio «hecha cuando» de la tarea del manual.
  - *Cubre:* CA-04.
  - *Hecha cuando:* el criterio habla de personas concretas o rutas ajenas de forma genérica.

## Fase C · Spec `003-readme-entorno-y-arranque`

- [x] **T06** · En `specs/003-readme-entorno-y-arranque/plan.md`, reescribir §2.1 sin ruta ajena bajo `staff/`.
  - *Cubre:* CA-04.
  - *Hecha cuando:* solo nombra `staff/sergio-cortes/asistenciapp`.

- [x] **T07** · En `specs/003-readme-entorno-y-arranque/tasks.md`, alinear la descripción de T01 con el plan.
  - *Cubre:* CA-04.
  - *Hecha cuando:* T01 no menciona rutas de otra copia.

## Fase D · Documentación viva y cierre de esta spec

- [x] **T08** · Comprobar `README.md`, `docs/CONSTITUTIONS.md` y `AGENTS.md` (plan §1); si hubiera coincidencias, neutralizarlas.
  - *Cubre:* CA-03.
  - *Hecha cuando:* los tres ficheros pasan la búsqueda de CA-01 y CA-02.

- [x] **T09** · En `specs/004-sin-referencias-victor/spec.md`, neutralizar textos que aún contengan el nombre o el slug buscables (mantener issue #245).
  - *Cubre:* CA-01, CA-02, CA-04.
  - *Hecha cuando:* la propia spec 004 no dispara las búsquedas de CA-01/CA-02.

- [x] **T10** · Actualizar `AGENTS.md` §7 con la fila `004-sin-referencias-victor` y marcar fase al cerrar.
  - *Cubre:* CA-08.
  - *Hecha cuando:* la tabla incluye esta spec con estado coherente.

## Fase E · Verificación final

- [x] **T11** · Ejecutar las búsquedas de la issue #245 en todo el árbol de la app y comprobar CA-04–CA-06 según plan §4.
  - *Cubre:* CA-01, CA-02, CA-04, CA-05, CA-06.
  - *Hecha cuando:* las tres búsquedas no devuelven coincidencias y `git diff` no toca código ni tests.

- [x] **T12** · Ejecutar `pytest` desde `staff/sergio-cortes/asistenciapp/`; actualizar estados en `spec.md`, `plan.md` y este `tasks.md` a **Implementada** / **Terminado**.
  - *Cubre:* CA-07, CA-08.
  - *Hecha cuando:* `pytest` en verde y los tres documentos de la spec 004 reflejan cierre.
