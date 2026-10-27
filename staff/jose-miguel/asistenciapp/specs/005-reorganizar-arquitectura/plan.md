# Plan técnico 005 · Reorganizar documentos y arquitectura

> Estado: **Implementado** (2026-10-26) · Spec: [spec.md](spec.md) v1.1 · Creado: 2026-10-26 · Aprobado: 2026-10-26

Este documento explica **cómo** se cumple la spec en esta copia. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

La forma de organizar el código toma la idea de tres capas (reglas, acciones, borde). La forma de documentar funciones toma la idea de decir qué recibe, qué devuelve y un ejemplo corto. No se copian herramientas ajenas ni se añaden dependencias.

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

En el README, la frase de las reglas pasa a enlazar `docs/CONSTITUTION.md` y `AGENTS.md`. El resto del README no cambia (incluido lo de las specs 003 y 004: activar el entorno separado de arrancar, y rutas `staff/<usuario>/asistenciapp`).

Las specs `001` a `004` no se reescriben.

### 2.2 `docs/ARCHITECTURE.md` dice la organización y lo que no entra (CA-02)

El documento, en español, explica las tres partes del §1 y qué archivo vive en cada una.

Dice también lo que este proyecto **no** necesita:

- Otras bases o ORMs. El guardado sigue siendo `sqlite3` y el archivo `data/asistencia.db`.
- Una segunda forma de guardar (memoria) y una interfaz para elegirla. Solo hay un almacén.
- Una aplicación de línea de comandos. La única entrada es `app.py`.
- Variables `.env`, pre-commit y documentación generada.

### 2.3 `AGENTS.md` conserva el día a día y añade cómo se escribe (CA-03)

El manual actual se renombra. Se actualizan el enlace a la constitución (`docs/CONSTITUTION.md`), el orden de lectura y el árbol de carpetas del §3. La tabla de estado mantiene las specs `001` a `005` y Discord como idea futura.

Se añade una sección de escritura:

- El módulo abre con una frase de qué hace.
- Cada función pública dice `:param`, `:return` y `:rtype`, y lleva un ejemplo `Usage::` si alguien la llama desde fuera.
- Las funciones públicas llevan tipos.
- Una función hace una cosa.

Los textos que ve el usuario siguen en español. Quien aprueba sigue siendo el usuario de esta copia.

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

`sqlite.py` abre y cierra la conexión dentro de cada función. No importa Flask ni las reglas. No comprueba si la sesión está cerrada ni si el código vale: guarda lo que la acción ya decidió.

`app.py` no importa `sqlite3` ni `asistencia.storage`. Al arrancar pide a la acción de preparación el token del profesor. Cada ruta pide una acción y devuelve JSON.

Las funciones públicas que se mueven se reescriben con la forma del §2.3. El comportamiento no cambia.

### 2.5 La constitución se enmienda a 3.1 (CA-09)

Hoy está en versión **3.0** (spec 002). Pasa a `docs/CONSTITUTION.md` y sube a **3.1**. En el §3, la tabla del stack nombra las carpetas nuevas: `docs/`, `asistencia/domain/`, `asistencia/usecases/`, `asistencia/storage/`, `app.py`. El archivo de datos sigue en `data/` y las pantallas en `static/`. El detalle apunta a `docs/ARCHITECTURE.md`.

No se tocan el propósito, la privacidad, P1–P6, ni lo que aportó la 3.0 (parada sin spec, carpeta y quien aprueba). El historial de enmiendas gana una fila con fecha 2026-10-26 y motivo esta spec.

### 2.6 Cómo se comprueba (CA-04 a CA-07)

`tests/test_architecture.py` lee el código y los documentos:

1. En `asistencia/domain/` no aparecen `sqlite3` ni `flask`.
2. En `asistencia/storage/sqlite.py` no aparecen `flask` ni las reglas de nombre, código o sesión.
3. En `app.py` no aparecen `sqlite3` ni `asistencia.storage`.
4. Existen `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`. No existen `CONSTITUTION.md` ni `AGENT.md` en la raíz.
5. `AGENTS.md` contiene `:param`, `:return` y `Usage`.
6. `ARCHITECTURE.md` nombra las tres partes y dice que no entran otras bases ni ORMs de más.
7. La constitución está en versión 3.1 y su §3 nombra `docs/`, `asistencia/domain/`, `asistencia/usecases/` y `asistencia/storage/`.

Los tests que importan `asistencia.codes` y `asistencia.names` pasan a `asistencia.domain`. El test de referencias personales (`tests/test_personal_references.py`) se ajusta si hace falta para los nombres nuevos de documentos, sin volver a introducir rutas personales. El resto de la suite se ejecuta igual. `pytest` en verde cubre que el pasar lista da el mismo resultado (CA-07).

---

## 3. Comprobación

| Criterio | Qué lo cubre |
| --- | --- |
| CA-01 | Test: existe `docs/CONSTITUTION.md` y no existe `CONSTITUTION.md` en la raíz |
| CA-02 | Test: `docs/ARCHITECTURE.md` separa las tres partes y excluye piezas que esta app no usa |
| CA-03 | Test: no existe `AGENT.md`; `AGENTS.md` tiene `:param`, `:return` y `Usage` |
| CA-04 | Test: `asistencia/domain/` no importa `sqlite3` ni `flask` |
| CA-05 | Test: `sqlite.py` no importa Flask ni las reglas |
| CA-06 | Test: `app.py` no importa `sqlite3` ni `asistencia.storage` |
| CA-07 | `pytest` completo, con la suite que ya cubre el pasar lista |
| CA-08 | El README enlaza `docs/CONSTITUTION.md` y `AGENTS.md`. Revisión del enlace dentro de `AGENTS.md` |
| CA-09 | Test: constitución 3.1 y el §3 nombra las carpetas nuevas. El propósito, la privacidad y las reglas de pasar lista no se reescriben |

---

## 4. Comprobación de la constitución (v3.0, antes de la enmienda)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Tres carpetas y un módulo de acciones. Solo hay un sitio donde guardar |
| P3 Dependencias mínimas | Sí | No se añade ninguna. Siguen Flask, pytest y `sqlite3` |
| P4 Privacidad | Sí | Se siguen guardando solo el nombre y la hora, en el mismo archivo local |
| P5 Accesible y móvil | Sí | `static/` no se toca |
| P6 Español | Sí | Documentos, errores y este plan en español. Los nombres de código pueden ir en inglés |
| §4 SDD | Sí | Esta spec aprobada autoriza el cambio. No se escribe sin ella |
| §5 Calidad | Sí | CA-01 a CA-06 y CA-09 tienen test. CA-07 es la suite actual. CA-08 tiene el enlace del README y la revisión del manual |
| §6 Seguridad | Sí | El código sigue caducando, la sesión cerrada no acepta registros y el duplicado sigue bloqueado. Esas decisiones pasan a `domain/`, no se relajan |
| §7 y §8 | Sí | Solo se edita dentro de `staff/<usuario>/asistenciapp/`. Quien aprueba es el usuario |

---

## 5. Decisiones tomadas

1. **Sin interfaz de almacén** (2026-10-26): aquí solo hay SQLite. Una interfaz sería una abstracción sin un segundo caso.
2. **El CSV y el túnel no son una cuarta parte** (2026-10-26): exportar da formato a filas ya cargadas. El túnel solo publica el enlace.
3. **La enmienda es 3.1** (2026-10-26): se añaden carpetas al §3 sobre la 3.0. No se quita ni se contradice un principio, así que no es una 4.0.
