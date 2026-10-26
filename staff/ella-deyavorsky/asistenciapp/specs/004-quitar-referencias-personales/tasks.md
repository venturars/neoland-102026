# Tareas 004 · Quitar las referencias personales a otro usuario

> Estado: **Terminado (2026-10-26)** · Plan: [plan.md](plan.md) · Creado: 2026-10-26

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test y luego los cambios. Los `.md` se editan solo en `staff/ella-deyavorsky/asistenciapp/`; el único fichero `.py` nuevo es el test.
- Cada frase reescrita conserva la fecha, el resultado y la decisión de la frase original.

---

## Fase A · El test primero

- [x] **T01** · Crear `tests/test_personal_references.py` con dos tests, en el estilo de los que ya hay.
  - Uno lee `README.md` y comprueba que todas las líneas que empiezan por `cd ` valen `cd staff/ella-deyavorsky/asistenciapp`, y que hay al menos una.
  - El otro recorre los `.md` de la carpeta de la app, sin `.venv` ni `__pycache__`, y comprueba que ninguno contiene el nombre, sin distinguir mayúsculas. El mensaje de fallo lista los ficheros.
  - *Cubre:* CA-01, CA-02, CA-05.
  - *Hecha cuando:* `pytest tests/test_personal_references.py` falla en los dos tests, por la ruta del README y por los ficheros con el nombre.

## Fase B · La ruta del README

- [x] **T02** · En `README.md`, las dos líneas `cd` de «Preparar el entorno» y «Activar el entorno» pasan a `cd staff/ella-deyavorsky/asistenciapp`.
  - El resto de cada bloque no cambia.
  - *Cubre:* CA-01, CA-04.
  - *Hecha cuando:* el test de las rutas del README pasa.

## Fase C · Spec 001

- [x] **T03** · En `specs/001-checkin-codigo/tasks.md`, las notas de prueba de CA-19, CA-20 y del CSV pasan a «*(Prueba del 2026-10-20: …)*».
  - La de CA-19 dice «registro correcto desde un móvil con datos móviles».
  - La frase de la prueba con el móvil pasa a «Se prueba con un móvil (…) y se quita un registro desde el panel», con la nota «*(Prueba del 2026-10-20: pasos 1–5 correctos.)*».
  - *Cubre:* CA-02, CA-03, CA-04.
  - *Hecha cuando:* las cuatro líneas no nombran a nadie y conservan fecha y resultado.

- [x] **T04** · En `specs/001-checkin-codigo/plan.md` y `spec.md`, las tres frases con nombre se reescriben.
  - El título del §8 del plan es «Decisiones tomadas».
  - En la spec: «Se aceptaron las propuestas» y, en el historial v1.2, «Se detecta que un alumno puede registrar…».
  - *Cubre:* CA-02, CA-03, CA-04.
  - *Hecha cuando:* esas tres frases no nombran a nadie y el resto de la fila y de la sección sigue igual.

## Fase D · Spec 002

- [x] **T05** · En `specs/002-spec-antes-del-cambio/tasks.md` y `spec.md`, las tres referencias se reescriben.
  - En las tareas: «no nombra a ninguna persona» y «Buscar el nombre de una persona en `CONSTITUTION.md` y `AGENT.md`: no debe encontrarse ninguno».
  - En el historial v1.1 de la spec: «búsqueda de nombres de personas vacía».
  - *Cubre:* CA-02, CA-03, CA-04.
  - *Hecha cuando:* esas tres frases no nombran a nadie y conservan su sentido; el test de los `.md` pasa.

## Fase E · Listar la spec

- [x] **T06** · En `AGENT.md` §7 se añade la fila `004-quitar-referencias-personales` con su fase.
  - Las demás filas no cambian.
  - *Cubre:* CA-04.
  - *Hecha cuando:* la tabla lista la 004 y solo esa fila es nueva.

## Fase F · Comprobar

- [x] **T07** · Leer `git diff` con la tabla del plan §3 y lanzar `pytest` una vez desde `staff/ella-deyavorsky/asistenciapp/`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05.
  - *Hecha cuando:* el diff solo cambia lo del plan §2, `git diff --stat` solo añade el test nuevo como `.py`, y `pytest` termina en verde con los dos tests nuevos.

## Fase G · Cerrar

- [x] **T08** · Marcar la spec 004 como implementada.
  - En `spec.md`, el estado pasa a «Implementada» y el historial gana una línea.
  - En `plan.md`, el estado pasa a «Implementado». En `tasks.md`, a «Terminado».
  - En `AGENT.md` §7, la fila de la 004 pasa a «✅ Implementada (2026-10-26)».
  - *Cubre:* CA-04.
  - *Hecha cuando:* los tres estados y la fila están actualizados.
