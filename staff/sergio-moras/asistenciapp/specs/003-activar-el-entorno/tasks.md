# Tasks 003 · Separar «activar el entorno» de «arrancar la app»

> Estado: **Terminado** (2026-11-01) · Plan: [plan.md](plan.md)

Una tarea cada vez, en orden. Al acabarla se marca `[x]`.

---

- [x] **T01 · Título de la sección 2.** Cambiarlo a «2. Activar el entorno» sin tocar el bloque de debajo.
  - Cubre: CA-01.
  - Terminada cuando: el bloque `cd` + `source .venv/bin/activate` queda bajo ese título.

- [x] **T02 · Sección 3 nueva.** Añadir `---` y «## 3. Arrancar la app» antes de la tabla de comandos.
  - Cubre: CA-02, CA-03.
  - Terminada cuando: bajo ese título están los dos comandos y no está la activación del entorno.

- [x] **T03 · Renumerar.** Secciones 3–7 pasan a 4–8 y la remisión «sección 4» pasa a «sección 5».
  - Cubre: CA-04.
  - Terminada cuando: la numeración es correlativa y la remisión apunta a «Cerrar la app».

- [x] **T04 · Verificar.** Revisar la tabla del plan §3, lanzar `pytest` y añadir la spec a la tabla de `AGENT.md` §7.
  - Cubre: CA-01 a CA-04.
  - Terminada cuando: todo cuadra y `pytest` pasa.
