# Tareas 003 · Instructivo de entorno y arranque en el README de la app

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22 · Aprobado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.

---

## Fase A · README de la app — rutas y títulos

- [x] **T01** · En `asistenciapp/README.md`, usar `staff/sergio-cortes/asistenciapp` en los bloques `cd`.
  - *Cubre:* CA-03.
  - *Hecha cuando:* no queda ninguna ruta a otra carpeta personal.

- [x] **T02** · Renombrar «2. Arrancar la app» a «2. Activar el entorno»; debajo solo la frase de terminal nueva y el bloque `cd` + `source .venv/bin/activate` (sin tabla de arranque).
  - *Cubre:* CA-04.
  - *Hecha cuando:* ese bloque no se titula «Arrancar la app».

- [x] **T03** · Insertar «3. Arrancar la app» con la tabla de comandos y el texto de lo que se ve al arrancar (sin activar el entorno).
  - *Cubre:* CA-05, CA-06.
  - *Hecha cuando:* bajo «Arrancar la app» no hay `source .venv/bin/activate`.

- [x] **T04** · Renumerar secciones 3–7 a 4–8 y cambiar «ciérrala (sección 4)» por «ciérrala (sección 5)» en problemas frecuentes.
  - *Cubre:* CA-07.
  - *Hecha cuando:* los títulos numerados coinciden con el plan §2.3.

## Fase B · Manual y comprobación

- [x] **T05** · Actualizar `AGENTS.md` §7 con la fila de `003-readme-entorno-y-arranque`.
  - *Hecha cuando:* la tabla refleja esta spec.

- [x] **T06** · Comprobar CA-01–CA-07 con la tabla del plan §3 y ejecutar `pytest` desde `staff/sergio-cortes/asistenciapp/`.
  - *Hecha cuando:* la comprobación manual cuadra y `pytest` termina en verde.
