# Tareas 007 · Quién falta

> Estado: **Terminado** (2026-10-25) · Plan: [plan.md](plan.md) aprobado el 2026-10-25 · Creada: 2026-10-25

Se hacen en orden. Primero el test de esa tarea, después el código. `asistencia/domain/codes.py` no se toca.

---

- [x] **T01** · Crear `tests/test_roster.py`.
  - `matches("sergio")` devuelve a Sergio Cortes y a Sergio Moras.
  - `matches("meghan")` devuelve solo a Meghan Martin. `matches("TORRES")` solo a Diego Torres.
  - `matches("")` devuelve los quince, en el orden de la spec.
  - `official_name("Meghan Martin")` devuelve ese nombre. `official_name("meghan martin")` también. `official_name("Otra Persona")` no devuelve a nadie.
  - *Cubre:* CA-01, CA-02, CA-03, CA-06.
  - *Hecha cuando:* `pytest tests/test_roster.py` falla porque `asistencia.domain.roster` todavía no existe.

- [x] **T02** · Crear `asistencia/domain/roster.py`.
  - La lista son los quince nombres, en el orden de la spec.
  - `matches` ignora mayúsculas. Vacío devuelve los quince.
  - `official_name` devuelve la grafía de la lista, o nada si no es exactamente uno de ellos.
  - No importa Flask ni abre el fichero. Cada función dice qué recibe, qué devuelve y un ejemplo.
  - *Cubre:* CA-01, CA-02, CA-03, CA-06, CA-07.
  - *Hecha cuando:* `pytest tests/test_roster.py` pasa.

- [x] **T03** · Crear `tests/test_missing.py` con el cliente de la API.
  - Sin presentes, la vista del profesor devuelve los quince como faltantes, en ese orden.
  - Elegir Meghan Martin con el código vigente la apunta con ese nombre, y ya no está entre los que faltan. El resto sigue.
  - «Otra Persona» responde «Elige tu nombre de la lista.» y no apunta a nadie.
  - La página pública de la clase trae los quince nombres y ningún campo de foto.
  - *Cubre:* CA-01, CA-04, CA-05, CA-06, CA-07.
  - *Hecha cuando:* `pytest tests/test_missing.py` falla porque pasar lista todavía acepta cualquier nombre y la vista no dice quién falta.

- [x] **T04** · En `asistencia/usecases/attendance.py`, usar la lista.
  - `public_session` incluye `names`.
  - `check_in` guarda el nombre oficial. Si no está en la clase, no apunta a nadie y el aviso es «Elige tu nombre de la lista.»
  - `teacher_view` incluye `missing`: los de la lista que no están entre los presentes, en el mismo orden.
  - `checkins` no gana columnas. La descarga no incluye a quien falta.
  - *Cubre:* CA-01, CA-04, CA-05, CA-06.
  - *Hecha cuando:* `pytest tests/test_missing.py` pasa.

- [x] **T05** · En los tests que ya existen, cambiar los nombres inventados por nombres de la clase.
  - «Ana» pasa a Meghan Martin. «Luis» pasa a Luis Duque. Un segundo nombre inventado pasa a otro de la lista.
  - «Ana García» y «ana garcia» pasan a Meghan Martin y «meghan martin», y siguen contando como la misma persona.
  - Un nombre con HTML, como `<b>Ana</b>`, ya no se guarda: no está en la clase.
  - Lo que prueban no cambia: el código, la clase cerrada, quitar a alguien, la descarga y el límite de intentos.
  - *Cubre:* CA-06, CA-08.
  - *Hecha cuando:* `pytest` de `tests/test_api.py` y `tests/test_rate_limit.py` pasa.

- [x] **T06** · En `static/alumno.html` y `static/alumno.js`, cambiar el nombre escrito a mano por la búsqueda.
  - El cuadro tiene etiqueta y empieza vacío. Al escribir, salen las sugerencias. Al elegir una, el cuadro se completa con el nombre entero.
  - Al elegir, se envía ese nombre completo. No hay imágenes.
  - *Cubre:* CA-02, CA-03, CA-07.
  - *Hecha cuando:* la página del alumno muestra la búsqueda y manda el nombre elegido. El filtro se mira a mano, porque el navegador no entra en pytest.

- [x] **T07** · En `static/profesor.html` y `static/profesor.js`, mostrar quién falta.
  - Debajo de los presentes, los nombres de `missing`, como texto, en el orden recibido.
  - Si se quita a alguien, al refrescar la lista vuelve a faltar.
  - *Cubre:* CA-01, CA-05.
  - *Hecha cuando:* la vista de la clase muestra los que faltan además de los presentes.

- [x] **T08** · Enmendar `docs/CONSTITUTION.md` a 4.0.
  - P4 permite la lista de estos nombres para ver quién falta. El registro sigue siendo el nombre elegido y la hora, en el fichero local. Sin fotos ni emails.
  - El historial gana la fila del 2026-10-25.
  - *Cubre:* CA-09.
  - *Hecha cuando:* el encabezado de la constitución dice 4.0.

- [x] **T09** · En `docs/ARCHITECTURE.md`, añadir la fila de `asistencia/domain/roster.py`.
  - Dice que guarda la lista de la clase y qué nombres coinciden, y que no abre el fichero ni dibuja la página.
  - *Cubre:* CA-09.
  - *Hecha cuando:* esa fila está en la tabla de archivos.

- [x] **T10** · En `README.md`, explicar la lista de la clase.
  - El alumno busca su nombre y lo elige. El profesor ve quién falta. No hay fotos. El código y el límite no cambian.
  - *Cubre:* CA-07, CA-08.
  - *Hecha cuando:* el README dice eso.

- [x] **T11** · En `AGENTS.md`, marcar `007-quien-falta` en la tabla de specs.
  - *Cubre:* CA-09.
  - *Hecha cuando:* la fila existe y dice en qué fase está.

- [x] **T12** · Lanzar `pytest` desde `staff/meghan-martin/asistenciapp/`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09.
  - *Hecha cuando:* la suite termina en verde, incluidos `tests/test_codes.py` y los tests nuevos.
