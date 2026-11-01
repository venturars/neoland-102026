# Plan técnico 007 · Plantillas por tipo y reglas sin duplicar

> Estado: **Aprobado** (2026-11-01) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-11-01

Issue: #714.

---

## 1. Visión general

La spec 006 ya copió plantillas y agentes alineados con el ejercicio. Esta spec añade **comprobación automatizada** y **documentación explícita**, sin reescribir plantillas si siguen en paridad con `exercises/git-workflow-agent-template/templates/`.

No se toca el código de la app.

---

## 2. Decisiones

### 2.1 Paridad con el ejercicio (CA-05)

Si un test de bytes falla, se vuelve a copiar solo `templates/` desde el ejercicio. No se edita el ejercicio.

### 2.2 Tests en `tests/test_git_workflow_templates.py` (CA-01 a CA-06)

Un módulo de test con:

- Constante `GIT_TYPES` con los seis tipos.
- Comprobación de rutas esperadas y ausencia de `basic_*`.
- Escaneo de `agents/`, `skills/` y `tools/` (ficheros `.md` y `.sh`) buscando cadenas prohibidas.
- Comparación byte a byte con la carpeta del ejercicio (ruta desde la raíz del repo `neoland-102026`).
- Lectura de textos clave en `create-issue`, `create-pr-base-staging` y `link-pr-to-issue` para CA-06.

### 2.3 Documentación (CA-07)

- `docs/ARCHITECTURE.md`: bajo `templates/`, una frase sobre seis tipos y reglas en comentarios HTML.
- `AGENTS.md`: añadir `007-plantillas-por-tipo` en la lista de numeración y fila en §7.

### 2.4 Dedupe manual (CA-04)

Tras el test, si algo fallara, igualar agents/skills/tools al ejercicio (salvo rutas `staff/<usuario>/asistenciapp/tools/` en skills de terminal). Hoy la auditoría previa no encontró duplicados.

---

## 3. Comprobación

| Criterio | Qué mirar |
| --- | --- |
| CA-01 a CA-06 | `pytest tests/test_git_workflow_templates.py` |
| CA-07 | `pytest` completo y fila en `AGENTS.md` §7 |
| Issue / PR | #714, rama `714-chore-plantillas-por-tipo`, draft #715 |

---

## 4. Constitución (v3.2)

| Regla | ¿Cumple? |
| --- | --- |
| P1–P6 | Sí: no cambia plataforma, pantallas ni datos |
| §4 SDD | Sí: spec, plan, tasks e implementación en orden |
| §7 Alcance | Sí: solo esta carpeta |
