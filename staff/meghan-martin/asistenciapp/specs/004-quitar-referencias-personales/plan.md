# Plan 004 · Un usuario genérico, y las notas sin el nombre

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) · Creado: 2026-10-22

No hay pantallas nuevas ni dependencias nuevas. El fichero nuevo es `tests/test_personal_references.py`. Los demás ya existen.

Esta spec es la que cubre quitar el nombre. La spec 002 lo había dejado en las notas de la spec 001. La fecha y el resultado se quedan.

---

## 1. Las dos líneas del README (CA-01, CA-04)

Pasan de `cd staff/victor-chang/asistenciapp` a `cd staff/<usuario>/asistenciapp`.

`<usuario>` se escribe así, con los ángulos. No pongo el nombre de otra persona. El resto del README no cambia.

---

## 2. Las notas conservan la fecha y el hecho (CA-02, CA-03)

| Fichero | Después |
| --- | --- |
| `specs/001-checkin-codigo/spec.md` | `Todas resueltas el 2026-10-19: las propuestas se aceptaron.` |
| `specs/001-checkin-codigo/spec.md` | `se comprueba que un alumno puede anotar a compañeros que no están, con otros nombres` |
| `specs/001-checkin-codigo/plan.md` | `## 8. Decisiones tomadas` |
| `specs/001-checkin-codigo/tasks.md` | `2026-10-20: desde un móvil con datos móviles, el registro fue correcto.` |
| `specs/001-checkin-codigo/tasks.md` | `2026-10-20: el panel se abre con el enlace tal cual.` |
| `specs/001-checkin-codigo/tasks.md` | `2026-10-20: el CSV tiene dos columnas y las tildes se ven bien.` |
| `specs/001-checkin-codigo/tasks.md` | `En un móvil, registrarse dos veces con nombres distintos queda bloqueado, y un registro se quita desde el panel. *(2026-10-20: los pasos 1 a 5 salieron bien.)*` |

Las cinco decisiones numeradas de ese plan no se reescriben.

En la constitución, en la spec 002 y en la spec 003, las frases que contaban que un cambio anterior no tocaba la carpeta personal siguen diciendo eso, sin el nombre.

---

## 3. El test (CA-01, CA-02, CA-03)

`tests/test_personal_references.py` comprueba tres cosas:

1. Las dos líneas del README que empiezan por `cd staff/` son `cd staff/<usuario>/asistenciapp`.
2. En los Markdown de esta carpeta no aparece `victor`, en ninguna mayúscula. Se saltan `.venv/` y esta spec, porque aquí el nombre hace falta para decir qué se quita.
3. Las frases de la tabla de arriba están en sus ficheros, con su fecha y su resultado.

---

## 4. Comprobación de la constitución

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 | Sí | No cambio cómo se pasa lista |
| P2 | Sí | Cambio frases que ya existen. Un test nuevo |
| P3 | Sí | No añado dependencias. El test usa pytest, que ya está |
| P4 | Sí | Quito un nombre de la documentación. No guardo datos nuevos |
| P5 | Sí | No toco pantallas |
| P6 | Sí | Las frases nuevas están en español |
| §5 | Sí | CA-01, CA-02 y CA-03 tienen test. CA-04 es el diff del README y el `pytest` que ya había |
| §6 | Sí | No toco códigos ni sesiones |
