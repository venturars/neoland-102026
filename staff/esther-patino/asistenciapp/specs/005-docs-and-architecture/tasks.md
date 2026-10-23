# Tareas 005 · Documentos y arquitectura del código

> Estado: **Hechas** · Plan: [plan.md](plan.md) aprobado · Creado: 2026-10-23 · Aplicadas: 2026-10-23

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test de arquitectura. El código y los documentos llegan después, para que ese test pase.

---

## Fase A · El test que marca el sitio

- [x] **T01** · Crear `tests/test_architecture.py` con lo que pide el plan, apartado 3.
  - Busca `docs/CONSTITUTION.md` y comprueba que no hay `CONSTITUTION.md` en la raíz. La cabecera sigue diciendo versión 2.3.
  - Lee `docs/ARCHITECTURE.md` y exige las palabras `domain`, `actions` e `infra`, y una frase de lo que no se trae.
  - Busca `AGENTS.md`, comprueba que no hay `AGENT.md`, y exige `:param` y `:return`.
  - Lee los `.py` de `asistencia/domain/` y exige que no importen Flask ni `sqlite3`. Lee `asistencia/actions/` y exige que no importe Flask.
  - Lee el enlace del `README.md` y el de `AGENTS.md`: abren `docs/CONSTITUTION.md` y `AGENTS.md`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05.
  - *Hecha cuando:* el archivo existe y, al lanzarlo solo, falla porque los documentos y las carpetas todavía no están.

## Fase B · Documentos

- [x] **T02** · Mover `CONSTITUTION.md` a `docs/CONSTITUTION.md`.
  - El texto de los principios no se toca. La versión sigue en 2.3.
  - *Cubre:* CA-01.
  - *Hecha cuando:* el archivo está en `docs` y ya no está en la raíz.
- [x] **T03** · Crear `docs/ARCHITECTURE.md` con el árbol del plan, apartado 2.1.
  - Dice que se separan reglas, acciones y la forma de llegar a ellas.
  - Dice que no se trae otra base de datos, ni línea de comandos, ni generador de documentación, ni ganchos de commit, ni una clase con su interfaz para cada detalle.
  - *Cubre:* CA-02, CA-04.
  - *Hecha cuando:* nombra `domain`, `actions` e `infra`, y deja escrito lo que no se trae.
- [x] **T04** · Renombrar `AGENT.md` a `AGENTS.md`.
  - La lectura inicial, los enlaces y el árbol apuntan a `docs/CONSTITUTION.md` y a `AGENTS.md`.
  - Una sección nueva pide texto breve al principio del módulo, una función por acción, y en cada función pública qué hace, qué recibe (`:param`) y qué devuelve (`:return`).
  - La tabla de estado deja esta spec en la fase que tenga.
  - *Cubre:* CA-03, CA-05.
  - *Hecha cuando:* `AGENT.md` ya no está, el manual tiene `:param` y `:return`, y su enlace abre la constitución en `docs`.
- [x] **T05** · En `README.md`, la frase de las reglas enlaza `docs/CONSTITUTION.md` y `AGENTS.md`.
  - El resto del documento no se reescribe.
  - *Cubre:* CA-05.
  - *Hecha cuando:* esos dos enlaces abren los documentos en su sitio nuevo.

## Fase C · Código

- [x] **T06** · Mover `asistencia/codes.py` a `asistencia/domain/codes.py` y `asistencia/names.py` a `asistencia/domain/names.py`.
  - Las funciones siguen siendo las mismas.
  - Cada función pública lleva qué hace, `:param` y `:return`. El módulo abre con un texto breve.
  - *Cubre:* CA-04.
  - *Hecha cuando:* esos dos módulos están en `domain` y no importan Flask ni `sqlite3`.
- [x] **T07** · Mover `asistencia/db.py`, `asistencia/export.py` y `asistencia/tunnel.py` a `asistencia/infra/`.
  - Cada función pública lleva qué hace, `:param` y `:return`. El módulo abre con un texto breve.
  - `db.py` no importa Flask ni las reglas del dominio.
  - *Cubre:* CA-04.
  - *Hecha cuando:* los tres módulos están en `infra`.
- [x] **T08** · Crear `asistencia/actions/attendance.py` con una función por acción del plan, apartado 2.2.
  - Datos públicos de una clase, registrar a un alumno, listar clases, abrir una clase, vista del profesor, cerrar una clase, quitar un registro y preparar el CSV.
  - Usan `domain` y `infra.db`. Devuelven diccionarios o un error con el mensaje que ya ve el usuario. No importan Flask.
  - Cada función pública lleva qué hace, `:param` y `:return`.
  - *Cubre:* CA-04.
  - *Hecha cuando:* el módulo existe, no importa Flask, y cubre esas ocho acciones.
- [x] **T09** · En `app.py`, las rutas llaman a las acciones de T08.
  - `app.py` elige el estado HTTP y construye el JSON, la página y la dirección del alumno.
  - El token del profesor, las rutas y los textos de error HTTP se quedan aquí. `create_app`, `port_in_use` y `main` llevan qué hace, `:param` y `:return`.
  - *Cubre:* CA-04, CA-06.
  - *Hecha cuando:* la decisión de registrar, abrir, cerrar y quitar ya no está escrita dentro de la ruta.
- [x] **T10** · En `tests/test_codes.py`, `test_names.py`, `test_export.py` y `test_tunnel.py`, actualizar el import al sitio nuevo.
  - Los casos no se reescriben.
  - *Cubre:* CA-06.
  - *Hecha cuando:* esos cuatro archivos importan `domain` o `infra`, y los casos siguen.

## Fase D · Comprobación

- [x] **T11** · Lanzar `pytest`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06.
  - *Hecha cuando:* `tests/test_architecture.py` y la suite que ya existía terminan en verde.
- [x] **T12** · Leer el diff y comprobar que no aparecen `specs/001-checkin-codigo`, `002-require-approved-spec`, `003-startup-headings` ni `004-impersonal-references`.
  - `static/` y `requirements.txt` tampoco cambian.
  - Actualizar la tabla de `AGENTS.md` §7: esta spec pasa a implementada.
  - *Cubre:* CA-07.
  - *Hecha cuando:* esas cuatro specs no están en el diff y la tabla nombra esta spec como implementada.
