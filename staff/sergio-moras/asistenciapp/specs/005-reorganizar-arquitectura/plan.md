# Plan 005 · Ordenar documentos y código por responsabilidades

> Estado: **Aprobado** (2026-11-01) · Spec: [spec.md](spec.md) v1.0

Referencias: [python-clean-architecture-example](https://github.com/claudiosw/python-clean-architecture-example) para la organización y [requests/api.py](https://github.com/psf/requests/blob/main/src/requests/api.py) para la forma de documentar funciones. De ambas se toma la idea, no sus herramientas.

---

## 1. Organización elegida

El ejemplo de referencia separa *domain*, *interactor* (casos de uso), *infra* y la app. Aquí se queda con cuatro piezas:

```
app.py                 → entrada HTTP (Flask)
asistencia/
├── domain/            → reglas de pasar lista
├── use_cases/         → lo que hacen el profesor y el alumno
└── infra/             → base de datos, CSV y túnel
```

**Quién puede importar a quién:**

| Pieza | Puede importar | No puede importar |
| --- | --- | --- |
| `domain/` | biblioteca estándar | Flask, `sqlite3`, `use_cases`, `infra` |
| `use_cases/` | `domain`, `infra` | Flask |
| `infra/` | biblioteca estándar | Flask, `domain`, `use_cases` |
| `app.py` | `use_cases`, errores de `domain`, `infra/tunnel.py` | `sqlite3`, `infra/sqlite_store.py` |

`infra/` no conoce las reglas: guarda y lee lo que le piden.

---

## 2. Decisiones

### 2.1 Ficheros del código (CA-05, CA-06, CA-07)

| Ahora | Después | Qué cambia |
| --- | --- | --- |
| `asistencia/codes.py` | `asistencia/domain/codes.py` | Se mueve y se documenta |
| `asistencia/names.py` | `asistencia/domain/names.py` | Se mueve, se documenta y lanza `InvalidName` (hereda de `ValueError`, así nada que capture `ValueError` deja de funcionar) |
| comprobaciones dentro de `app.py` | `asistencia/domain/rules.py` | Nuevo. Errores `SessionNotFound`, `SessionClosed`, `InvalidCode` y las funciones que los lanzan |
| lógica de las rutas de `app.py` | `asistencia/use_cases/teacher.py` | Nuevo. Preparar la app, abrir, listar, ver, cerrar, quitar registro y exportar |
| lógica de las rutas de `app.py` | `asistencia/use_cases/student.py` | Nuevo. Ver la clase pública y registrarse |
| `asistencia/db.py` | `asistencia/infra/sqlite_store.py` | Se mueve, se documenta y añade `open_db(path)`, que abre y cierra la conexión |
| `asistencia/export.py` | `asistencia/infra/csv_export.py` | Se mueve y se documenta |
| `asistencia/tunnel.py` | `asistencia/infra/tunnel.py` | Se mueve y se documenta |
| `app.py` | `app.py` | Solo HTTP: lee la petición, llama a un caso de uso y convierte el resultado o el error en respuesta |
| `asistencia/hack-etico.sh` | no se mueve | Su ayuda nombra esa ruta y la spec deja la demo fuera de alcance (CA-09) |
| `static/` | no se toca | |

### 2.2 Casos de uso partidos por quién actúa

El profesor y el alumno tienen permisos distintos (el profesor necesita su enlace secreto). Separarlos en `teacher.py` y `student.py` deja claro qué acciones son públicas.

### 2.3 Una conexión por acción

Hoy `app.py` abre una conexión por petición con `flask.g`. Pasa a ser una por caso de uso: cada uno hace `with sqlite_store.open_db(db_path) as conn:` y usa esa conexión para todo lo que necesita. Así Flask deja de saber que hay base de datos, y cada acción (por ejemplo, comprobar la clase y registrar al alumno) usa una única conexión.

### 2.4 El tiempo entra como número

Hoy las rutas llaman a `now()` varias veces. Los casos de uso reciben el instante `t` (segundos Unix) y `app.py` lo calcula una vez por petición con el reloj que se le pasa a `create_app`. Así las reglas y los casos de uso se pueden probar sin reloj falso.

### 2.5 Errores y respuestas iguales que ahora (CA-08)

`app.py` traduce cada error a la misma respuesta de hoy:

| Error | Estado | Mensaje |
| --- | --- | --- |
| `SessionNotFound` | 404 | «Esta clase no existe. Revisa el enlace.» |
| `SessionClosed` | 409 | «La asistencia de esta clase ya está cerrada.» |
| `InvalidCode` | 422 | «El código no es válido o ha caducado. Pide el código actual al profesor.» |
| `InvalidName` | 400 | el mensaje del nombre |

Las rutas, los JSON y el orden de las comprobaciones (clase → abierta → nombre → código) no cambian. Las pantallas y `hack-etico.sh` hablan con la app por esas rutas, así que siguen funcionando (CA-09).

### 2.6 Sin interfaz de almacenamiento

El ejemplo de referencia define una interfaz para cambiar de base de datos. Aquí solo hay SQLite, y la constitución P2 pide no abstraer sin un segundo caso real: los casos de uso importan `sqlite_store` directamente.

### 2.7 Documentos (CA-01 a CA-04, CA-10)

- **`docs/CONSTITUTION.md`**: se mueve con `git mv`. Versión 2.3: la tabla del §3 nombra `app.py`, `asistencia/domain/`, `asistencia/use_cases/`, `asistencia/infra/` y `docs/`, y remite a `docs/ARCHITECTURE.md`. Se anota en el historial. Propósito, principios y reglas no cambian.
- **`docs/ARCHITECTURE.md`**: nuevo. Explica las cuatro piezas, la tabla de importaciones del §1, qué fichero va en cada una, el árbol de carpetas y lo que no se usa del ejemplo (PostgreSQL, SQLAlchemy, Alembic, interfaz de almacenamiento, segunda base de datos, CLI, `.env`, pre-commit).
- **`AGENTS.md`**: `git mv` desde `AGENT.md`. Se actualizan los enlaces, el orden de lectura y el árbol (que pasa a `docs/ARCHITECTURE.md`). Nueva sección «Cómo se escribe el código»: frase inicial en cada módulo; en cada función pública, tipos, `:param`, `:return`, `:rtype`, `:raises` si lanza errores y `Usage::` con un ejemplo; una función, una tarea.
- **README**: la frase de las reglas enlaza `docs/CONSTITUTION.md` y `AGENTS.md`. Nada más.

---

## 3. Tests

**Nuevos:**

- `tests/test_architecture.py`: lee cada fichero `.py` con `ast` y comprueba la tabla de importaciones del §1 (CA-05, CA-06, CA-07). También comprueba los documentos: constitución en `docs/` y no en la raíz, `AGENTS.md` sí y `AGENT.md` no, `ARCHITECTURE.md` con las piezas y lo excluido, constitución 2.3 con las carpetas nuevas, y los enlaces del README (CA-01 a CA-04, CA-10).
- `tests/test_rules.py`: prueba `domain/rules.py` sin app ni base de datos (CA-05).

**Ajustados** (solo los `import`): `test_codes.py`, `test_names.py`, `test_export.py`, `test_tunnel.py`.

**Sin cambios:** `test_api.py`, `test_port.py`, `test_no_personal_references.py` y `conftest.py`. Que `test_api.py` siga pasando sin tocarlo demuestra que la app responde igual (CA-08, CA-09).

---

## 4. Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-01 a CA-04, CA-10 | `test_architecture.py` y revisión de los enlaces |
| CA-05, CA-06, CA-07 | `test_architecture.py` y `test_rules.py` |
| CA-08 | `test_api.py` sin modificar y suite completa en verde |
| CA-09 | Arrancar la app en local y lanzar `hack-etico.sh` contra una clase de prueba con un rango corto de códigos; debe hacer las peticiones y obtener respuestas como antes |

---

## 5. Comprobación de la constitución

| Regla | Cumple | Motivo |
| --- | --- | --- |
| P1 Plataforma | Sí | El registro no cambia |
| P2 Simplicidad | Sí | Cuatro piezas y sin interfaces ni capas que no tengan un uso real |
| P3 Dependencias | Sí | Ninguna nueva |
| P4 Privacidad | Sí | Se guardan los mismos datos en el mismo archivo |
| P5 Móvil | Sí | `static/` no cambia |
| P6 Español | Sí | Documentos y mensajes en español; nombres de código en inglés |
| §3 Stack | Sí | Se enmienda para nombrar las carpetas nuevas (2.3) |
| §4 SDD | Sí | Spec aprobada; plan y tasks antes del cambio |
| §5 Calidad | Sí | Cada criterio tiene test o verificación manual |
| §6 Seguridad | Sí | Las comprobaciones de código, clase cerrada y duplicado pasan a `domain/` y a `use_cases/` sin relajarse |
| §7 Alcance | Sí | Solo `staff/sergio-moras/asistenciapp/` |
