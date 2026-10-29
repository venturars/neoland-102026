# Tareas 009 · Un AGENTS.md más simple

> Estado: **Terminado (2026-10-29)** · Plan: [plan.md](plan.md) · Creado: 2026-10-29 · Aprobado: 2026-10-29

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Se tocan `AGENTS.md`, `docs/ARCHITECTURE.md`, `README.md` y la tarea T32 de la spec 007. No hay test nuevo: la comprobación es leer esos ficheros, como dice el plan §3.
- Lo que se mueve se **añade primero** en su sitio nuevo y **después** se quita de `AGENTS.md`, para no perderlo por el camino.

---

## Fase A · Añadir en su sitio nuevo

- [x] **T01** · En `docs/ARCHITECTURE.md`, añadir al final la sección «6. Estructura de carpetas» con el árbol y la frase de numeración de specs de `AGENTS.md` §3 (plan §2.3).
  - Los comentarios de `AGENTS.md` y `ARCHITECTURE.md` en el árbol cambian como dice la tabla del plan §2.3.
  - Las secciones 1–5 no cambian.
  - *Cubre:* CA-04.
  - *Hecha cuando:* la sección 6 tiene el árbol completo y la frase «Las specs se numeran con tres dígitos…».

- [x] **T02** · En `README.md`, añadir solo lo que falta de la tabla de comandos (plan §2.4).
  - La fila «Probar solo en tu ordenador» dice `python app.py` (abre en `http://localhost:8000`).
  - Debajo del bloque de «1. Preparar el entorno»: «Las únicas dependencias son Flask y pytest (constitución P3).»
  - *Cubre:* CA-06.
  - *Hecha cuando:* cada fila de la tabla del plan §2.4 está en el README, y esos dos datos aparecen una sola vez.

## Fase B · Simplificar AGENTS.md

- [x] **T03** · Borrar las líneas 3 y 4 de `AGENTS.md` (plan §2.1).
  - *Cubre:* CA-01.
  - *Hecha cuando:* debajo del título no está el párrafo «Este archivo explica…».

- [x] **T04** · Cambiar la frase de la constitución por la del plan §2.2.
  - *Cubre:* CA-02.
  - *Hecha cuando:* la frase dice «no cambies ningún fichero», nombra a la persona que trabaja en esta carpeta y pide esperar su respuesta.

- [x] **T05** · Quitar las secciones «3. Estructura de carpetas», «4. Comandos» y «5. Reglas de comportamiento», con su separador `---` (plan §2.3, §2.4 y §2.5).
  - *Cubre:* CA-03, CA-05, CA-07.
  - *Hecha cuando:* `grep` de «Estructura de carpetas», «## .*Comandos» y «Reglas de comportamiento» en `AGENTS.md` no devuelve nada.

- [x] **T06** · Renumerar (plan §2.6).
  - «Normas de escritura del código» es 3, «Definición de "terminado"» 4 y «Estado actual» 5.
  - En «1. Antes de hacer nada», «(ver §8 "Estado actual")» es «(ver §5 "Estado actual")».
  - En `specs/007-lista-de-alumnos/tasks.md`, T32 dice «`AGENTS.md` §5».
  - *Cubre:* CA-10.
  - *Hecha cuando:* los títulos van del 1 al 5 y `grep -n "§8" AGENTS.md` solo encuentra «constitución §8».

## Fase C · Comprobar y cerrar

- [x] **T07** · Revisar con la tabla del plan §3 y lanzar `pytest` una vez desde `staff/ella-deyavorsky/asistenciapp/`.
  - *Cubre:* CA-01 a CA-10.
  - *Hecha cuando:* las diez filas de esa tabla cuadran, el diff de `AGENTS.md` solo tiene los cambios de T03–T06 y `pytest` termina en verde.

- [x] **T08** · En `AGENTS.md` §5, añadir la fila de la spec 009. Spec, plan y tasks pasan a «Implementada / Terminado».
  - *Cubre:* CA-08 (el estado actual sigue al día).
  - *Hecha cuando:* la tabla tiene la fila 009 y los tres documentos dicen su estado nuevo.

- [x] **T09** · Lo pruebas tú y lo das por bueno (`AGENTS.md` §4).
  - *Hecha cuando:* la persona que trabaja en esta carpeta lee `AGENTS.md`, `docs/ARCHITECTURE.md` y el README y da el ok.
