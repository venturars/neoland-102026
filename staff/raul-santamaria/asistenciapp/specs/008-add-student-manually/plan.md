# Plan técnico 008 · Añadir alumno a mano

> Estado: **Aprobado** · Spec: [spec.md](spec.md) · Creado: 2026-10-27 · Aprobado: 2026-10-27 · Issue: #529

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios (`CA-xx`) cubre.

---

## 1. Visión general

El profesor, en la vista de una sesión (abierta **o** cerrada), escribe un nombre y lo añade. Ese registro usa la misma tabla `checkins` que el web y Discord: mismas reglas de nombre, mismo anti-duplicado por `name_key`, misma lista, total, quitar y CSV.

No hace falta código ni límite por IP: quien añade es el profesor con el enlace secreto. No se cambia el check-in del alumno ni Discord.

---

## 2. Dependencias (P3)

Ninguna nueva. Flask, SQLite y el dominio de nombres ya cubren el caso.

---

## 3. Decisiones

### 3.1 Acción `add_checkin_manual` (CA-01 a CA-05, CA-09)

Nueva función en `asistencia/usecases/attendance.py`:

1. `require_session` (existe; **no** llama a `ensure_open`).
2. `clean_name` (vacío / > 60 → `ValueError` en español, mismos textos que el alumno).
3. `storage.add_checkin` con `name_key` y hora UTC (mismo esquema).
4. Devuelve `(row, created)` como `check_in`: si `created` es falso, ya estaba (CA-03).

Sin código, sin IP, sin `ensure_open`. Cubre CA-05 (sesión cerrada) por omisión.

### 3.2 Ruta del profesor (CA-01, CA-06, CA-07)

`POST /api/sessions/<session_id>/checkins` con cuerpo `{ "name": "…" }`.

- Ya protegida por `X-Teacher-Token` (`before_request` de `/api/sessions…`) → CA-07.
- Éxito nuevo → `201` con `name` y `checkedAt`.
- Ya registrado → `200` con `already: true` (mismo patrón que el check-in alumno).
- Nombre inválido → `400` vía `ValueError` existente en `run`.
- Sesión inexistente → `404`.

Quitar sigue siendo `DELETE …/checkins/<id>` (CA-06 sin cambios).

### 3.3 Panel (CA-01, CA-05, CA-08, CA-09)

En `profesor.html` / `profesor.js`, vista de sesión:

- Formulario corto: campo de nombre + botón **Añadir** (visible con sesión abierta y cerrada).
- Al enviar: `POST` anterior; si ok, refresca lista/total (o confía en el polling); si error o `already`, mensaje en `#status` en español.
- Móvil ~400 px: mismo layout de formularios del panel (CA-08).

Lista en vivo, quitar y descarga: sin columnas nuevas (CA-04, CA-06).

### 3.4 Archivos

| Archivo | Cambio |
| --- | --- |
| `asistencia/usecases/attendance.py` | `add_checkin_manual`. |
| `app.py` | Ruta `POST …/checkins`. |
| `static/profesor.html`, `profesor.js` | Formulario añadir. |
| `README.md` | Cómo añadir a mano (también con asistencia cerrada). |
| `AGENTS.md` | Tabla de estado: spec 008. |
| `tests/` | Acción + API (abierta/cerrada, vacío, largo, duplicado, sin token). |

Sin migración de esquema. Sin enmienda de constitución (sigue siendo nombre + hora).

---

## 4. Comprobación

| Criterio | Qué lo cubre |
| --- | --- |
| CA-01 | Test acción/API con sesión abierta → fila + total. |
| CA-02 | Test nombre vacío / > 60 → 400, sin fila. |
| CA-03 | Test segundo alta mismo `name_key` → `already`, sin duplicar. |
| CA-04 | Export CSV existente con un alta manual en test. |
| CA-05 | Test acción/API con sesión cerrada → mismo éxito. |
| CA-06 | Reutiliza `remove_checkin`; test breve si hace falta. |
| CA-07 | Test sin `X-Teacher-Token` → 401. |
| CA-08 | Verificación manual ~400 px. |
| CA-09 | Mensajes de `clean_name` / `already` en español en tests. |

---

## 5. Comprobación de la constitución

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | Solo panel profesor; no acopla a Discord/Meet. |
| P2 Simplicidad | Sí | Una acción, una ruta, un formulario; reutiliza `checkins`. |
| P3 Dependencias mínimas | Sí | Cero dependencias nuevas. |
| P4 Privacidad | Sí | Solo nombre + hora; sin origen “a mano” en disco. |
| P5 Accesible y móvil | Sí | Control en el panel responsive. |
| P6 Español | Sí | Errores y README en español. |
| §5 Calidad | Sí | Cada CA con test o verificación manual. |
| §6 Seguridad | Sí | Solo con token de profesor; mismas reglas de nombre. |

---

## 6. Decisiones tomadas

1. **También con sesión cerrada** (2026-10-27): P1 de la spec; la acción no llama a `ensure_open`.
2. **Misma tabla `checkins`** (2026-10-27): sin marcar origen; fuera de alcance de la spec.
3. **Reutilizar `clean_name`** (2026-10-27): mismas reglas y mensajes que el alumno.
4. **Sin código ni IP** (2026-10-27): el freno es el enlace secreto del panel.
