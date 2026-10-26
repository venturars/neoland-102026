# Plan técnico 005 · Reorganizar documentos y arquitectura

> Estado: **Aplicado** · Spec: [spec.md](spec.md) v1.1 · Creado: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

La organización sale de [python-clean-architecture-example](https://github.com/claudiosw/python-clean-architecture-example). La forma de escribir el código sale de [requests/api.py](https://github.com/psf/requests/blob/main/src/requests/api.py). De los dos se toma la forma, no sus herramientas.

---

## 1. Visión general

Tres partes, y las flechas solo van hacia dentro:

1. **Reglas** (`asistencia/domain/`): deciden si un registro vale. No dibujan pantallas ni abren la base.
2. **Acciones** (`asistencia/usecases/`): el profesor abre, cierra, lista, exporta o quita; el alumno se registra. Piden la decisión a las reglas y el guardado al almacén.
3. **Borde**: `app.py` y `static/` muestran la app y hablan HTTP. `asistencia/storage/` abre el archivo SQLite. El túnel (`asistencia/tunnel.py`) solo publica el enlace.

`app.py` no abre la base. El almacén no decide reglas ni dibuja pantallas. Las pantallas (`static/`) no se tocan.

No se añaden dependencias. Siguen Flask, pytest, `sqlite3` y el archivo en `data/`.

---

## 2. Decisiones

### 2.1 Los documentos cambian de sitio (CA-01, CA-08)

| Ahora | Después |
| --- | --- |
| `CONSTITUTION.md` | `docs/CONSTITUTION.md` |
| `AGENT.md` | `AGENTS.md` |
| — | `docs/ARCHITECTURE.md` |

En el README, la frase de las reglas pasa a enlazar `docs/CONSTITUTION.md` y `AGENTS.md`. El resto del README no cambia.

Las specs `001` a `004` no se reescriben.

### 2.2 `docs/ARCHITECTURE.md` dice la organización y lo que no entra (CA-02)

El documento, en español, explica las tres partes del §1 y qué archivo vive en cada una.

Dice también lo que este proyecto **no** copia del ejemplo, porque aquí no hace falta:

- PostgreSQL, SQLAlchemy y Alembic. El guardado sigue siendo `sqlite3` y el archivo `data/asistencia.db`.
- Una segunda forma de guardar (memoria) y una interfaz para elegirla. Solo hay un almacén.
- Una aplicación de línea de comandos. La única entrada es `app.py`.
- Variables `.env`, pre-commit y documentación generada.

### 2.3 `AGENTS.md` conserva el día a día y añade cómo se escribe (CA-03)

El manual actual se renombra. Se actualizan el enlace a la constitución (`docs/CONSTITUTION.md`), el orden de lectura y el árbol de carpetas del §3.

Se añade una sección de escritura, con la forma de `requests/api.py`:

- El módulo abre con una frase de qué hace.
- Cada función pública dice `:param`, `:return` y `:rtype`, y lleva un ejemplo `Usage::` si alguien la llama desde fuera.
- Las funciones públicas llevan tipos.
- Una función hace una cosa.

Los textos que ve el usuario siguen en español.

### 2.4 El código queda en esas tres partes (CA-04, CA-05, CA-06)

| Ahora | Después | Parte |
| --- | --- | --- |
| `asistencia/codes.py` | `asistencia/domain/codes.py` | Reglas |
| `asistencia/names.py` | `asistencia/domain/names.py` | Reglas |
| La decisión «sesión cerrada» y «código no válido», hoy en `app.py` | `asistencia/domain/session.py` | Reglas |
| `asistencia/db.py` | `asistencia/storage/sqlite.py` | Almacén |
| Las acciones de `app.py` que mezclan reglas y base | `asistencia/usecases/attendance.py` | Acciones |
| `asistencia/export.py` | se queda | La acción de exportar lo llama; no abre la base ni decide si un registro vale |
| `asistencia/tunnel.py` | se queda | Borde. No sabe de asistencia |
| `app.py` | se queda, más delgado | HTTP: llama a las acciones y traduce el resultado a la respuesta |
| `static/` | no se toca | Pantallas |

Las reglas lanzan un error propio (sesión inexistente, sesión cerrada, código no válido, nombre no válido). No importan Flask ni `sqlite3`. `app.py` convierte ese error en el mismo estado HTTP de ahora: 404, 409, 422 y 400.

`sqlite.py` abre y cierra la conexión dentro de cada función. No importa Flask, ni `codes`, ni `names`, ni `session`. No comprueba si la sesión está cerrada ni si el código vale: guarda lo que la acción ya decidió.

`app.py` no importa `sqlite3` ni `asistencia.storage`. Al arrancar pide a la acción `prepare` el token del profesor. Cada ruta pide una acción y devuelve JSON.

Las funciones públicas que se mueven se reescriben con la forma del §2.3. El comportamiento no cambia.

### 2.5 La constitución se enmienda a 2.3 (CA-09)

Pasa a `docs/CONSTITUTION.md`. Sube de 2.2 a 2.3. En el §3, la tabla del stack nombra las carpetas nuevas: `docs/`, `asistencia/domain/`, `asistencia/usecases/`, `asistencia/storage/`, `app.py`. El archivo de datos sigue en `data/` y las pantallas en `static/`. El detalle apunta a `docs/ARCHITECTURE.md`.

No se tocan el propósito, la privacidad, P1–P6 ni las reglas de pasar lista. El historial de enmiendas gana una fila.

### 2.6 Cómo se comprueba (CA-04 a CA-07)

`tests/test_architecture.py` lee el código y los documentos:

1. En `asistencia/domain/` no aparecen `sqlite3` ni `flask`.
2. En `asistencia/storage/sqlite.py` no aparecen `flask`, `clean_name`, `is_valid_code` ni `session`.
3. En `app.py` no aparecen `sqlite3` ni `asistencia.storage`.
4. Existen `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`. No existen `CONSTITUTION.md` ni `AGENT.md` en la raíz.
5. `AGENTS.md` contiene `:param`, `:return` y `Usage`.
6. `ARCHITECTURE.md` nombra las tres partes y dice que no entran PostgreSQL, SQLAlchemy ni Alembic.
7. La constitución está en versión 2.3 y su §3 nombra `docs/`, `asistencia/domain/`, `asistencia/usecases/` y `asistencia/storage/`.

Los tests que importan `asistencia.codes` y `asistencia.names` pasan a `asistencia.domain`. El resto de la suite se ejecuta igual. `pytest` en verde cubre que el pasar lista da el mismo resultado (CA-07).

---

## 3. Comprobación

| Criterio | Qué lo cubre |
| --- | --- |
| CA-01 | Test: existe `docs/CONSTITUTION.md` y no existe `CONSTITUTION.md` en la raíz |
| CA-02 | Test: `docs/ARCHITECTURE.md` separa las tres partes y excluye PostgreSQL, SQLAlchemy y Alembic |
| CA-03 | Test: no existe `AGENT.md`; `AGENTS.md` tiene `:param`, `:return` y `Usage` |
| CA-04 | Test: `asistencia/domain/` no importa `sqlite3` ni `flask` |
| CA-05 | Test: `sqlite.py` no importa Flask ni las reglas |
| CA-06 | Test: `app.py` no importa `sqlite3` ni `asistencia.storage` |
| CA-07 | `pytest` completo, con la suite que ya cubre el pasar lista |
| CA-08 | El README enlaza `docs/CONSTITUTION.md` y `AGENTS.md`. Revisión del enlace dentro de `AGENTS.md` |
| CA-09 | Test: constitución 2.3 y el §3 nombra las carpetas nuevas. El propósito, la privacidad y las reglas de pasar lista no se reescriben |

---

## 4. Comprobación de la constitución (v2.2, antes de la enmienda)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Tres carpetas y un módulo de acciones. No hay interfaz de almacén ni segunda base: solo hay un sitio donde guardar |
| P3 Dependencias mínimas | Sí | No se añade ninguna. Siguen Flask, pytest y `sqlite3` |
| P4 Privacidad | Sí | Se siguen guardando solo el nombre y la hora, en el mismo archivo local |
| P5 Accesible y móvil | Sí | `static/` no se toca |
| P6 Español | Sí | Documentos, errores y este plan en español. Los nombres de código pueden ir en inglés |
| §5 Calidad | Sí | CA-01 a CA-06 y CA-09 tienen test. CA-07 es la suite actual. CA-08 tiene el enlace del README y la revisión del manual |
| §6 Seguridad | Sí | El código sigue caducando, la sesión cerrada no acepta registros y el duplicado sigue bloqueado. Esas decisiones pasan a `domain/`, no se relajan |

---

## 5. Decisiones tomadas

1. **Sin interfaz de almacén** (2026-10-23): el ejemplo la tiene porque guarda en memoria y en PostgreSQL. Aquí solo hay SQLite. Una interfaz sería una abstracción sin un segundo caso.
2. **El CSV y el túnel no son una cuarta parte** (2026-10-23): exportar da formato a filas que ya están cargadas. El túnel solo publica el enlace. Ninguno decide si un registro vale ni sustituye a la base.
3. **La enmienda es 2.3** (2026-10-23): se añaden carpetas al §3. No se quita ni se contradice un principio, así que no es una 3.0.
