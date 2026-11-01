# Plan 004 · Documentación sin referencias personales

> Estado: **Aprobado** (2026-11-01) · Spec: [spec.md](spec.md) v1.0

---

## 1. Resumen

Se editan documentos que ya existen y se añade un test que impide que el nombre vuelva a aparecer. La app no cambia.

| Fichero | Cambio |
| --- | --- |
| `README.md` | Los dos `cd` usan `staff/<usuario>/asistenciapp` |
| `specs/001-checkin-codigo/spec.md` | 2 notas sin nombre |
| `specs/001-checkin-codigo/plan.md` | Título de la sección 8 sin nombre |
| `specs/001-checkin-codigo/tasks.md` | 4 notas de prueba manual sin nombre |
| `tests/test_no_personal_references.py` | Nuevo |

La spec 002 pidió no tocar la spec 001 en aquel cambio. Esta spec, aprobada después, es la que autoriza a editar esas notas.

---

## 2. Notas de la spec 001

Cada nota pierde el nombre y conserva fecha y resultado. (CA-02, CA-03)

| Fichero | Antes | Después |
| --- | --- | --- |
| `spec.md` | `Todas resueltas el 2026-10-19: Victor aceptó las propuestas.` | `Todas resueltas el 2026-10-19 aceptando las propuestas.` |
| `spec.md` | `Victor detecta que un alumno puede registrar…` | `se descubre que un alumno puede registrar…` |
| `plan.md` | `## 8. Decisiones tomadas por Victor` | `## 8. Decisiones aprobadas` |
| `tasks.md` | `*(Victor, 2026-10-20: registro correcto desde su móvil con datos móviles.)*` | `*(Probado el 2026-10-20: registro correcto desde un móvil con datos móviles.)*` |
| `tasks.md` | `*(Victor, 2026-10-20: el panel se abre directamente.)*` | `*(Probado el 2026-10-20: el panel se abre directamente.)*` |
| `tasks.md` | `*(Victor, 2026-10-20: dos columnas y tildes correctas.)*` | `*(Probado el 2026-10-20: dos columnas y tildes correctas.)*` |
| `tasks.md` | `Victor lo prueba con su móvil (…) y quita un registro desde el panel. *(Victor, 2026-10-20: pasos 1–5 correctos.)*` | `Prueba manual en el móvil (…) y quitar un registro desde el panel. *(Probado el 2026-10-20: pasos 1–5 correctos.)*` |

El contenido de las decisiones y de las pruebas no cambia.

---

## 3. README

Las dos líneas `cd staff/victor-chang/asistenciapp` pasan a `cd staff/<usuario>/asistenciapp`. Nada más cambia. (CA-01, CA-04)

---

## 4. Test

`tests/test_no_personal_references.py`:

- **`test_readme_uses_generic_user_folder`**: todas las líneas del README que empiezan por `cd staff/` usan `<usuario>`, y hay al menos una. (CA-01)
- **`test_docs_have_no_personal_name`**: ningún `.md` de la app contiene `victor` (sin distinguir mayúsculas). Se excluyen `.venv/` y esta carpeta de spec, que necesita nombrar lo que se quita. (CA-02)
- **`test_spec_001_notes_keep_date_and_result`**: las notas reescritas del §2 están en su fichero. (CA-03)

Se escribe primero y debe fallar antes de editar los documentos.

---

## 5. Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-01 | Test |
| CA-02 | Test |
| CA-03 | Test |
| CA-04 | Diff del README limitado a las dos líneas `cd` y `pytest` completo en verde |

---

## 6. Comprobación de la constitución

| Regla | Cumple | Motivo |
| --- | --- | --- |
| P1–P6 | Sí | Sin cambios en la app ni en datos; el test usa pytest, que ya está permitido |
| §4 SDD | Sí | Documentos y test se cambian con esta spec aprobada |
| §5 Calidad | Sí | CA-01 a CA-03 con test; CA-04 con diff y suite completa |
| §7 Alcance | Sí | Solo `staff/sergio-moras/asistenciapp/` |
