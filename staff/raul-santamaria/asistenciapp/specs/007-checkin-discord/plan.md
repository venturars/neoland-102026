# Plan técnico 007 · Check-in con Discord

> Estado: **Aprobado** · Spec: [spec.md](spec.md) · Creado: 2026-10-27 · Aprobado: 2026-10-27 · Issue: #498

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios (`CA-xx`) cubre.

---

## 1. Visión general

El check-in web con código no cambia. Discord es un **borde nuevo**: un bot en un proceso aparte que llama a la misma acción de registrarse, con el **nombre visible** de la cuenta y el código que escribe el alumno.

El profesor, en el panel de una sesión abierta, pulsa **Activar Discord**. Eso marca la sesión en el almacén. El bot solo acepta registros si hay una sesión abierta con esa marca.

No se guarda id ni email de Discord. El anti-duplicado reutiliza `name_key` del nombre visible (igual que el web). La misma cuenta que reintenta con el mismo nick ve el aviso de ya registrado.

---

## 2. Dependencia (P3)

Se añade **`discord.py`** (versión fija en `requirements.txt`).

| Pregunta | Respuesta |
| --- | --- |
| ¿Qué problema resuelve? | Hablar con Discord (entrar al servidor, leer el comando del alumno, responder). |
| ¿Por qué no basta lo que hay? | La biblioteca estándar de Python no habla el protocolo de Discord. Reimplementarlo a mano contradice P2. |

Flask y pytest siguen. El bot **no** se mezcla en el hilo de Flask: proceso aparte, mismo archivo `data/asistencia.db`.

---

## 3. Decisiones

### 3.1 Proceso del bot (CA-01 a CA-05, CA-11)

Nuevo arranque: `python bot_discord.py` (desde `asistenciapp/`, con el venv activo).

- Lee el token del bot desde `data/discord_token.txt` (una línea; en `.gitignore` junto a `data/`). No se usa `.env` (ARCHITECTURE §4).
- Comando slash `/asistencia codigo:<4 cifras>` en el servidor donde esté el bot.
- Si no hay sesión abierta con Discord activado → aviso CA-02.
- Si el código no vale → aviso CA-04 (mismo criterio que el web: vigente o inmediatamente anterior).
- Si vale → acción de registro con el nombre visible de Discord; respuesta en español (éxito o ya registrado).

`python app.py` no arranca el bot. El README dice: panel + (opcional) bot en otra terminal.

### 3.2 Marca en la sesión (CA-01, CA-02)

Columna nueva en `sessions`: `discord_enabled` entero 0/1, por defecto 0.

- `POST /api/sessions/<id>/discord` (solo profesor) pone `discord_enabled = 1` si la sesión está abierta.
- Cerrar la sesión deja de aceptar registros (ya existe); la marca puede quedarse, pero `ensure_open` falla.
- Solo tiene sentido activar con sesión abierta; si está cerrada → 409.

El bot pregunta al almacén/acción: “sesión abierta con Discord activado” (como máximo una relevante: la abierta marcada; si hay varias abiertas marcadas, la más reciente).

### 3.3 Acción de registro (CA-03 a CA-06, CA-10)

Nueva acción `check_in_discord(path, display_name, code, now)` en `asistencia/usecases/attendance.py`:

1. Resuelve la sesión abierta con Discord activado; si no hay → error claro (CA-02).
2. `ensure_open` + `ensure_code` (mismas reglas que el web).
3. `clean_name` sobre el nombre visible (límite 60, etc.).
4. Inserta como `check_in` (mismo `checkins`: nombre, `name_key`, hora).
5. **No** anota IP ni mira `blocked_ips`: el intento no viene de un navegador alumno.

El registro web `check_in` no se modifica en su contrato. CA-06 queda cubierto sin tocar el formulario alumno.

### 3.4 Panel del profesor (CA-01, CA-07, CA-08, CA-09, CA-11)

En `static/profesor.js` / `profesor.html`, vista de sesión abierta:

- Botón **Activar Discord** visible si la sesión está abierta y Discord aún no está activado.
- Tras activar, el panel muestra que Discord está activo (texto corto).
- Lista en vivo, quitar y CSV: sin cambios de columnas (CA-07 a CA-09); el polling ya trae check-ins nuevos.

### 3.5 Archivos

| Archivo | Cambio |
| --- | --- |
| `docs/CONSTITUTION.md` | Enmienda P4: el nombre de asistencia puede ser el nombre visible de Discord; no id ni email. Versión **3.1**. Historial. |
| `docs/ARCHITECTURE.md` | Fila `bot_discord.py` (borde) y nota de `discord.py`. |
| `requirements.txt` | `discord.py==…` fija. |
| `.gitignore` | Asegurar `data/discord_token.txt` (o patrón bajo `data/`). |
| `asistencia/storage/sqlite.py` | Columna `discord_enabled`; migración al abrir esquema; activar; buscar sesión discord abierta. |
| `asistencia/usecases/attendance.py` | `enable_discord`, `check_in_discord`. |
| `app.py` | Ruta `POST .../discord`. |
| `bot_discord.py` | Entrada del bot (borde). |
| `static/profesor.html`, `profesor.js` | Botón y estado. |
| `README.md` | Cómo crear el bot, token en `data/`, invitar, arrancar `bot_discord.py`, botón del panel. |
| `AGENTS.md` | Tabla de estado: spec 007. |
| `tests/` | Tests de acción, API del botón, constitución 3.1; bot: reglas sin red Discord (mock o solo usecase). |

### 3.6 Enmienda de constitución (CA-10)

P4 añade: en el registro por Discord, el **nombre** guardado es el **nombre visible** de la cuenta en ese momento; **prohibido** guardar identificador de Discord o email. Sigue siendo solo nombre + hora en el registro de asistencia.

Versión **3.0 → 3.1** (añadido, no contradice de golpe la regla de nombre+hora). Historial con fecha 2026-10-27 y motivo spec 007.

`tests/test_architecture.py` / personal_references: buscan la versión vigente **3.1** y la frase nueva.

---

## 4. Comprobación

| Criterio | Qué lo cubre |
| --- | --- |
| CA-01 | Test API: profesor activa Discord en sesión abierta → queda marcada. UI: verificación manual del botón. |
| CA-02 | Test acción/bot: sin marca o sesión cerrada → mensaje, sin fila en `checkins`. |
| CA-03 | Test `check_in_discord` con código vigente →  nombre visible + hora. |
| CA-04 | Test código malo/caducado → error, sin registro. |
| CA-05 | Test segundo intento mismo `name_key` → ya registrado, sin duplicar. |
| CA-06 | Suite actual de check-in web sin cambios de comportamiento. |
| CA-07 | Test/manual: tras registro discord, `GET` sesión profesor incluye el nombre (polling ≤ 5 s ya existe). |
| CA-08 | Reutiliza quitar check-in existente. |
| CA-09 | Export CSV existente; test con un check-in “discord” (mismo esquema). |
| CA-10 | Test constitución 3.1 y texto P4; `checkins` sin columnas Discord. |
| CA-11 | Verificación manual del botón en ancho ~400 px; mensajes del bot en español en tests de texto. |

---

## 5. Comprobación de la constitución (v3.0, antes de la enmienda)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | Discord es fuente adicional; el núcleo sigue siendo código + panel. |
| P2 Simplicidad | Sí | Una columna, una acción, un proceso bot, un comando. |
| P3 Dependencias mínimas | Sí, con justificación | Solo se añade `discord.py` (§2). |
| P4 Privacidad | No, hasta 3.1 | Hoy el nombre es “el que escribe el alumno”. La enmienda 3.1 permite el nombre visible de Discord como ese nombre; sin id ni email. |
| P5 Accesible y móvil | Sí | Botón en el panel responsive; Discord es la UI del alumno ahí. |
| P6 Español | Sí | Avisos del bot, panel, README y plan en español. |
| §5 Calidad | Sí | Cada CA tiene test o verificación manual escrita arriba. |
| §6 Seguridad | Sí | Código caduca igual; sin doble registro por `name_key`; sesión cerrada no acepta. |

---

## 6. Decisiones tomadas

1. **Código obligatorio también en Discord** (2026-10-27): decisión de producto en la spec.
2. **Solo nombre visible en disco** (2026-10-27): anti-duplicado = `name_key`; no columna Discord.
3. **Botón en el panel** (2026-10-27): no comando de activación en el servidor como vía de esta spec.
4. **Bot en proceso aparte** (2026-10-27): evita mezclar asyncio de Discord con el servidor Flask.
5. **Token en `data/discord_token.txt`** (2026-10-27): sin `.env`, alineado con ARCHITECTURE.
6. **Registro Discord sin límite por IP** (2026-10-27): el intento no es del navegador del alumno; el código sigue siendo el freno.
