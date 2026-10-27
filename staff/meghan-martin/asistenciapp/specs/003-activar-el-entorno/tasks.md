# Tareas 003 · Separar activar y arrancar

> Estado: **Terminado** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22

El único fichero de la app es `README.md`.

---

- [x] **T01** · Cambiar el título «2. Arrancar la app» por «2. Activar el entorno».
  - Debajo se quedan la frase de cada terminal nueva y el bloque con `cd` y `source .venv/bin/activate`.
  - La ruta no se modifica.
  - *Cubre:* CA-01.
  - *Hecha cuando:* ese bloque se titula «Activar el entorno».

- [x] **T02** · Abrir «3. Arrancar la app» antes de la tabla de comandos.
  - Bajo ese título quedan la tabla y el texto de lo que se ve al arrancar.
  - Activar el entorno no queda bajo ese título.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* bajo «Arrancar la app» no aparece `source .venv/bin/activate`, y sí aparecen los dos comandos.

- [x] **T03** · Subir un número los títulos de después y corregir la remisión.
  - Pasar lista pasa a 4, cerrar a 5, problemas a 6, tests a 7 y privacidad a 8.
  - «ciérrala (sección 4)» pasa a «ciérrala (sección 5)».
  - El cuerpo de esas secciones no cambia.
  - *Cubre:* CA-04.
  - *Hecha cuando:* los cinco títulos tienen el número nuevo y esa es la única frase cambiada fuera de los títulos.

- [x] **T04** · Leer el README con la tabla del plan y lanzar `pytest` una vez desde esta carpeta.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* las cuatro filas cuadran y `pytest` termina en verde.
