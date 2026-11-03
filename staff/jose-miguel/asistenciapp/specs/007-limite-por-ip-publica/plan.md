# Plan técnico 007 · Límite por IP pública

> Estado: **Aprobado** (2026-11-02) · Spec: [spec.md](spec.md) v1.0 · Issue: #735

---

## 1. Visión general

Antes de validar sesión y código, la acción de registrarse mira si la dirección de `request.remote_addr` está bloqueada, anota el intento, comprueba ventanas de 1 s y 60 s, y bloquea si toca. Luego sigue el flujo actual de check-in.

Sin dependencias nuevas. Misma base SQLite en `data/asistencia.db`.

---

## 2. Decisiones

### 2.1 Dirección contada (CA-07)

`app.py` pasa `request.remote_addr or ""`. `ProxyFix` con `x_for=0`, `x_proto=1`, `x_host=1`: no se confía en `X-Forwarded-For` ni `CF-Connecting-IP`. Tests envían cabeceras falsas y fijan `REMOTE_ADDR`.

Con túnel local, muchas peticiones llegan como `127.0.0.1`: el tope es compartido en esa máquina.

### 2.2 Qué cuenta (CA-01, CA-03)

Solo `POST /api/s/<id>/checkin`. Cuenta aunque falle código, nombre, sesión cerrada o inexistente.

### 2.3 Almacén (CA-04, CA-06, CA-09)

Tablas `registration_attempts` y `blocked_ips`. Podar intentos con más de 60 s. `checkins` sin columna de dirección.

### 2.4 HTTP (CA-04, CA-05)

Excepción `Banned` → respuesta **403** con `{ "error": "<mensaje>" }`. `static/alumno.js` muestra el error y oculta el formulario.

### 2.5 Constitución (CA-09)

Versión **3.3**, P4 con excepción. Plan incluye tabla de cumplimiento P1–P6 y §4 SDD.

---

## 3. Comprobación

| CA | Evidencia |
| --- | --- |
| CA-01–CA-07 | `tests/test_rate_limit.py`, `tests/test_attempts.py`, `tests/test_blocklist.py` |
| CA-08 | Tests de código existentes sin cambio de reglas en `domain/codes.py` |
| CA-09 | `docs/CONSTITUTION.md` 3.3 + `tests/test_architecture.py` |

---

## 4. Constitución (v3.3)

| Regla | ¿Cumple? |
| --- | --- |
| P1–P3 | Sí: mismo stack |
| P4 | Sí: enmienda acotada |
| P5–P6 | Sí: mensajes en español, móvil igual |
| §4 SDD | Sí: esta spec autoriza el cambio |
