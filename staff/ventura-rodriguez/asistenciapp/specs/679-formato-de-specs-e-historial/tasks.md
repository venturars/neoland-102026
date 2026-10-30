# Tareas 679 · Formato de specs e historial

> Estado: **Terminado** (2026-10-30) · Plan: [plan.md](plan.md) · Creado: 2026-10-30

Issue: #679.

Cómo leer esta lista:

- Se hacen **en orden**. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- No se tocan las carpetas `specs/001-…` a `specs/008-…`.

---

## Fase A · Historial

- [x] **T01** · Crear `specs/000-historial/enmienda.md` con la tabla de enmiendas de `docs/CONSTITUTION.md` (1.0 a 4.0), con el mismo texto, y la fila 4.1.
  - *Cubre:* CA-09, CA-16.
  - *Hecha cuando:* tiene todas las filas, de la 1.0 a la 4.1.

- [x] **T02** · Crear `specs/000-historial/specs.md` con las columnas del plan §2.3 y las filas `001` a `008` y `679`.
  - La nota de la `006` pasa aquí.
  - No copia el título de la spec 004.
  - *Cubre:* CA-03, CA-08.
  - *Hecha cuando:* cada spec tiene su fila, en orden, y `001` a `004` apuntan al resumen.

- [x] **T03** · Escribir `specs/000-historial/resumenes/001-004.md` leyendo las cuatro specs.
  - Por spec: enlace, qué resolvió, decisiones vigentes y qué cambió después.
  - No copia el título de la spec 004.
  - *Cubre:* CA-05, CA-07.
  - *Hecha cuando:* tiene los cuatro apartados y `tests/test_personal_references.py` pasa.

## Fase B · Constitución

- [x] **T04** · `docs/CONSTITUTION.md` a 4.1: cabecera, §4, §5 y §6 con los textos del plan §2.5, y §8 apuntando a `enmienda.md`, sin tabla.
  - *Cubre:* CA-14, CA-15, CA-16.
  - *Hecha cuando:* no hay tabla de historial ni «spec 008», y la cabecera dice 4.1.

- [x] **T05** · `tests/test_architecture.py`: `Versión 4.0` pasa a `Versión 4.1`.
  - *Cubre:* CA-16, CA-19.
  - *Hecha cuando:* `pytest` pasa.

## Fase C · Manual y arquitectura

- [x] **T06** · `AGENTS.md` §1, §2.1 y §3: formato `<issue>-nombre`, regla de resúmenes, tipo y «Para qué sirve».
  - *Cubre:* CA-01, CA-04, CA-11, CA-12, CA-13, CA-20.
  - *Hecha cuando:* no queda `NNN-nombre` y la regla de resúmenes está en §3.

- [x] **T07** · `AGENTS.md` §2, §2.4, §4, §6 y §7: sin la frase del orquestador en §2 ni la de dependencias en §4; §2.4 apunta a la constitución §4; §6 pide la fila de `specs.md`; §7 en una línea.
  - La línea 5 y el momento 2 no cambian.
  - *Cubre:* CA-10, CA-17, CA-18.
  - *Hecha cuando:* `AGENTS.md` ya no tiene la tabla de estado.

- [x] **T08** · `docs/ARCHITECTURE.md`: árbol con `000-historial/` y `<issue>-nombre/`.
  - *Cubre:* CA-01.
  - *Hecha cuando:* no queda `NNN-nombre`.

## Fase D · Cierre

- [x] **T09** · Pasar `pytest`, comprobar que `specs/001-…` a `specs/008-…` no cambian y marcar la `679` en `specs.md`.
  - *Cubre:* CA-02, CA-06, CA-19.
  - *Hecha cuando:* `pytest` pasa y el diff de esas carpetas está vacío.
