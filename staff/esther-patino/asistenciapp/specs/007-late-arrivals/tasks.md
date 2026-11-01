# Tareas 007 · Llegadas tardías

> Estado: **Hechas** · Plan: [plan.md](plan.md) aprobado el 2026-10-27 · Creado: 2026-10-27 · Aplicadas: 2026-10-27

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test, luego el código, siempre que se pueda.

El estado no se guarda. Sale de la hora de apertura y de la hora del registro. Hasta los 5 minutos justos es «A tiempo». Un segundo después es «Llegada tardía».

---

## Fase A · La regla

- [x] **T01** · Crear `tests/test_arrival.py`.
  - Sin base y sin navegador.
  - Un registro anterior a la apertura, y otro a los 5 minutos justos, son «A tiempo».
  - Un registro un segundo después de los 5 minutos es «Llegada tardía».
  - *Cubre:* CA-01, CA-02.
  - *Hecha cuando:* el archivo existe y, al lanzarlo solo, falla porque `asistencia.domain.arrival` todavía no está.

- [x] **T02** · Crear `asistencia/domain/arrival.py`.
  - Una función pública: hora de apertura y hora del registro, en ISO. Devuelve «A tiempo» o «Llegada tardía».
  - No importa Flask ni `sqlite3`.
  - *Cubre:* CA-01, CA-02.
  - *Hecha cuando:* `pytest tests/test_arrival.py` pasa.

## Fase B · El archivo

- [x] **T03** · Actualizar `tests/test_export.py` antes de cambiar el CSV.
  - La cabecera esperada pasa a `Nombre;Hora;Estado`.
  - Cada fila de prueba trae el texto del estado y el archivo lo escribe en la tercera columna.
  - El orden sigue siendo la hora de registro. No aparece un color de celda.
  - *Cubre:* CA-06, CA-07.
  - *Hecha cuando:* esos casos fallan porque `to_csv` todavía escribe solo `Nombre;Hora`.

- [x] **T04** · En `asistencia/infra/export.py`, escribir la columna `Estado` con el texto que ya trae cada fila.
  - El separador sigue siendo `;`. No se pintan celdas.
  - *Cubre:* CA-06, CA-07.
  - *Hecha cuando:* `pytest tests/test_export.py` pasa.

## Fase C · Pasar lista

- [x] **T05** · Añadir en `tests/test_api.py` los casos del estado, antes de cambiar la acción.
  - A los 5 minutos justos, el alta y la lista del profesor traen «A tiempo».
  - Un segundo después, traen «Llegada tardía».
  - Con la clase cerrada, la vista sigue trayendo el texto que corresponde a las horas guardadas.
  - La lista y el archivo tienen nombre, hora y estado. No tienen IP ni motivo.
  - La descarga sin el token del profesor sigue en `401`.
  - El mismo nombre otra vez responde `already: true` con la hora y el texto del primer registro.
  - Un código no válido, un nombre no válido o una clase cerrada no traen estado de llegada.
  - Tras quitar un registro, un alta aceptada usa la hora nueva.
  - El alta `201` trae el texto de esa persona y no la lista de los demás.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09, CA-11, CA-12, CA-13.
  - *Hecha cuando:* esos casos fallan y los de pasar lista que ya existían siguen escritos igual, salvo el JSON de «ya estaba registrado», que ahora también espera el texto.

- [x] **T06** · En `asistencia/actions/attendance.py` y en `app.py`, añadir el texto sin guardarlo.
  - `register`, `teacher_view` y `export_csv` calculan el texto con la regla de T02.
  - El JSON del profesor añade `arrival` a cada registro. El alta `201` y la respuesta `already` también lo traen.
  - Una respuesta de error no lo trae.
  - La base no gana ninguna columna. La descarga sigue exigiendo el token del profesor.
  - *Cubre:* CA-01 a CA-09, CA-11, CA-12, CA-13.
  - *Hecha cuando:* los casos de T05 pasan.

## Fase D · Las pantallas

- [x] **T07** · En `static/styles.css`, la clase del nombre a tiempo usa `--ok-text` y la de llegada tardía usa `--danger`.
  - El texto del estado conserva el color normal y puede bajar de línea.
  - *Cubre:* CA-14, CA-15.
  - *Hecha cuando:* las dos clases existen y no fijan un ancho que obligue a desplazarse en horizontal.

- [x] **T08** · En `static/profesor.js`, cada fila pinta el nombre con `textContent` y la clase de color, y el texto «A tiempo» o «Llegada tardía» en otro elemento.
  - Vale para la lista en vivo y para una sesión anterior, porque las dos usan la misma vista.
  - *Cubre:* CA-03, CA-04, CA-05, CA-14.
  - *Hecha cuando:* el nombre no se pinta solo con color: el texto está en la fila.

- [x] **T09** · En `static/alumno.js`, la confirmación muestra el nombre en color y el texto al lado.
  - Guarda en el navegador, para esa clase, el nombre, la hora y el texto del alta `201`.
  - Al volver a abrir el enlace, muestra esos datos y no vuelve a registrar.
  - Si la respuesta es `already`, muestra la hora y el texto del primer registro.
  - Si la respuesta es un error, no muestra estado de llegada.
  - *Cubre:* CA-09, CA-10, CA-11, CA-12, CA-14.
  - *Hecha cuando:* las tres confirmaciones usan el texto que vino del servidor y un error no lo inventa.

## Fase E · Documentos y cierre

- [x] **T10** · En `docs/ARCHITECTURE.md`, el árbol nombra `domain/arrival.py`.
  - En `README.md`, el margen de 5 minutos, los textos «A tiempo» y «Llegada tardía», el color del nombre en la web y la columna `Estado` del archivo.
  - El alumno ve el suyo en la página de registro. El archivo lo descarga el profesor.
  - *Cubre:* CA-01, CA-03, CA-06, CA-09.
  - *Hecha cuando:* los dos textos dicen eso y no cambian cómo se arranca la app.

- [x] **T11** · Cierre.
  - `codes.py`, `access.py`, el esquema de la base y `requirements.txt` no se han modificado.
  - `pytest` pasa, incluidos `tests/test_arrival.py`, `tests/test_export.py` y los casos de CA-01 a CA-14.
  - CA-15 se comprueba a mano: con la ventana a unos 400 px, en la lista del profesor y en la confirmación del alumno se lee el texto sin zoom y sin desplazamiento horizontal.
  - *Cubre:* CA-15 y el resto.
  - *Hecha cuando:* `pytest` está en verde y la comprobación de los 400 px está hecha.
