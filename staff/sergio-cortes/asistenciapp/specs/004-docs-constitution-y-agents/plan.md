# Plan técnico 004 · Constitución en `docs` y manual `AGENTS.md`

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-22 · Aprobado: 2026-10-22

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. No hay cambios de código ni de pantallas; la verificación es manual más `pytest` de regresión.

---

## 1. Visión general

Se reorganizan dos ficheros de gobierno y se actualizan las referencias vivas dentro de `staff/sergio-cortes/asistenciapp/`.

| Acción | Origen | Destino |
| --- | --- | --- |
| Mover y renombrar constitución | `CONSTITUTION.md` | `docs/CONSTITUTIONS.md` |
| Renombrar manual | `AGENT.md` | `AGENTS.md` |

| Fichero a editar | Cambio |
| --- | --- |
| [README.md](../../README.md) | Enlaces a `docs/CONSTITUTIONS.md` y `AGENTS.md` (CA-03) |
| [AGENTS.md](../../AGENTS.md) (tras renombrar) | Título, lectura obligatoria §1, árbol §3, enlace a constitución (CA-04) |
| [specs/002-spec-antes-del-cambio/plan.md](../002-spec-antes-del-cambio/plan.md) | Enlaces relativos rotos → `../../docs/CONSTITUTIONS.md`, `../../AGENTS.md` (PA-01, CA-05) |
| [specs/003-readme-entorno-y-arranque/plan.md](../003-readme-entorno-y-arranque/plan.md) | Enlace `../../AGENT.md` → `../../AGENTS.md` (PA-01, CA-05) |
| [AGENTS.md](../../AGENTS.md) §7 | Fila `004-docs-constitution-y-agents` (CA-06) |

No se crea carpeta `docs/` nueva si ya existe al mover. El contenido de la constitución (P1–P6, §3–§8) se copia tal cual; no sube versión ni fila en historial de enmiendas (CA-07).

No se tocan `app.py`, `asistencia/`, `static/`, `tests/` ni `requirements.txt`.

---

## 2. Decisiones

### 2.1 Movimiento con historial de git (CA-01, CA-07)

Usar `git mv` para que GitHub registre renombre y no duplicado:

```bash
mkdir -p docs
git mv CONSTITUTION.md docs/CONSTITUTIONS.md
git mv AGENT.md AGENTS.md
```

Revisar el diff: solo cambios de ruta en el encabezado si hubiera autopistas internas (hoy la constitución no enlaza `AGENT.md`).

### 2.2 Manual tras el renombrado (CA-04)

En `AGENTS.md`:

- Línea 1: `# AGENTS.md — Manual de trabajo para agentes de IA`
- §1: rutas `docs/CONSTITUTIONS.md` y «este archivo (`AGENTS.md`)»
- §3 árbol: `docs/CONSTITUTIONS.md` y `AGENTS.md` en lugar de raíz `CONSTITUTION.md` / `AGENT.md`
- Párrafo introductorio: enlace `[docs/CONSTITUTIONS.md](docs/CONSTITUTIONS.md)`

### 2.3 Specs antiguas — solo enlaces (PA-01, CA-05)

En **002** y **003** `plan.md`, actualizar markdown links que suben a `../../CONSTITUTION.md` o `../../AGENT.md`. El texto que nombra ficheros en prosa dentro de `tasks.md` de specs cerradas puede quedar como registro (no son enlaces clicables).

No reescribir specs 001–003 ni cambiar su estado en la tabla §7 salvo que una task futura lo pida.

### 2.4 Tabla de estado (CA-06)

Añadir fila:

`| \`004-docs-constitution-y-agents\` | ✅ Implementada (fecha) | Constitución en docs/CONSTITUTIONS.md; manual AGENTS.md |`

La fecha y el emoji se ponen al cerrar `tasks.md`.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | Existe `docs/CONSTITUTIONS.md`; no hay `CONSTITUTION.md` en raíz |
| CA-02 | Existe `AGENTS.md`; no hay `AGENT.md` |
| CA-03 | README: dos enlaces correctos |
| CA-04 | AGENTS.md §1 y §3 coherentes |
| CA-05 | `rg 'CONSTITUTION\.md\|AGENT\.md'` en la carpeta: sin links rotos a raíz (ignorar menciones en backticks históricos en tasks 001–002 si no son URLs) |
| CA-06 | AGENTS.md §7 con fila 004 |
| CA-07 | Diff de constitución: mismo cuerpo de reglas |

Desde `staff/sergio-cortes/asistenciapp/`: `pytest` debe seguir en verde (77 tests).

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se toca el modelo de asistencia |
| P2 Simplicidad | Sí | Solo renombres y enlaces |
| P3 Dependencias mínimas | Sí | Sin dependencias nuevas |
| P4 Privacidad | Sí | Sin datos |
| P5 Accesible y móvil | Sí | Sin UI |
| P6 Español | Sí | Documentación en español |
| §4 SDD | Sí | Spec aprobada; plan y tasks antes del movimiento |
| §5 Calidad | Sí | Tabla §3; `pytest` de regresión |
| §6 Seguridad | Sí | Sin cambios de sesión ni códigos |
| §7 Alcance | Sí | Solo dentro de `staff/sergio-cortes/asistenciapp/` |
| §8 Enmiendas | Sí | Traslado de fichero, no enmienda de principios |

---

## 5. Decisiones tomadas

1. **PA-01** (2026-10-22): specs 001–003 conservan texto; solo se arreglan enlaces relativos en planes 002 y 003.
2. **Sin bump de versión de constitución** (2026-10-22): el movimiento no cambia reglas (CA-07).
3. **`git mv`** (2026-10-22): preservar historial en la PR.
