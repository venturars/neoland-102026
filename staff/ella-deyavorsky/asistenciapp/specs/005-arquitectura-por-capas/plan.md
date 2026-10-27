# Plan técnico 005 · Documentación en `docs/` y código por capas

> Estado: **Implementado v1.3 (2026-10-26)** · Spec: [spec.md](spec.md) v1.3 · Creado: 2026-10-26

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La base es el ejemplo [python-clean-architecture-example](https://github.com/claudiosw/python-clean-architecture-example), recortado a lo que esta app necesita.

---

## 1. Visión general

Se mueve y renombra documentación, se escriben dos documentos (`docs/ARCHITECTURE.md`, normas de escritura en `AGENTS.md`) y se reorganiza el paquete `asistencia/` en tres partes (`domain`, `usecases`, `storage`); `app.py` queda como borde HTTP más delgado. **No cambia el comportamiento**: mismas rutas, mismos mensajes, mismas pantallas, mismo esquema de base de datos. No se añade ninguna dependencia.

---

## 2. Decisiones

### 2.1 Documentación (CA-01, CA-02, CA-06, CA-08)

- `git mv CONSTITUTION.md docs/CONSTITUTION.md`. El contenido no se edita.
- `git mv AGENT.md AGENTS.md`. Se actualizan sus rutas (`docs/CONSTITUTION.md`, árbol de carpetas §3) y se añade la sección «Normas de escritura del código» (§2.3).
- El README apunta a `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`.
- Las specs 001–004 no se tocan.

### 2.2 Las capas: qué se queda del ejemplo y qué no (CA-03, CA-04, CA-05, CA-09)

El ejemplo separa dominio, aplicación, infraestructura y presentación, con interfaces abstractas (puertos), inyección de dependencias con contenedor y una entidad por concepto. Aquí se queda la **separación en capas y el sentido de las dependencias**; se deja fuera lo que la constitución P2 y P3 no justifica.

| Del ejemplo | Aquí |
| --- | --- |
| Dominio / Aplicación / Infraestructura / Presentación | Tres partes: `domain` (reglas), `usecases` (acciones), `storage` (SQLite). La presentación es `app.py`, el borde HTTP. **No** se crean `web/` ni `infrastructure/`: no tendrían contenido propio (P2) |
| Regla de dependencias hacia el dominio | Sí |
| Casos de uso | Sí: funciones, no clases |
| Interfaces abstractas (puertos) | **No**: solo hay un almacenamiento real (SQLite). Las acciones lo usan directamente, sin clase abstracta; se añade un puerto cuando haya un segundo caso (P2) |
| Contenedor de inyección de dependencias | **No**: se cablea a mano en `create_app` |
| Entidades como clases | **No**: sesiones y registros siguen siendo diccionarios |
| Librerías de validación, ORM, etc. | **No** (P3) |

Estructura final:

```
asistenciapp/
├── app.py                      # borde HTTP: create_app (rutas, errores HTTP, token), main, port_in_use; solo conoce db_path
├── asistencia/
│   ├── domain/                 # reglas puras, sin Flask ni SQLite
│   │   ├── codes.py            # (antes asistencia/codes.py)
│   │   ├── names.py            # (antes asistencia/names.py)
│   │   └── session.py          # decisiones de sesión y sus errores
│   ├── usecases/
│   │   └── attendance.py       # acciones: crear, consultar, registrar, cerrar, borrar, listar para exportar
│   ├── storage/
│   │   └── sqlite.py           # (antes asistencia/db.py) repositorio
│   ├── export.py               # se queda donde está
│   └── tunnel.py               # se queda donde está
├── static/  tests/  docs/  specs/
```

Dependencias permitidas (las demás están prohibidas):

| Parte | Puede importar |
| --- | --- |
| `domain` | solo la biblioteca estándar |
| `usecases` | `domain` y `storage`. Son las únicas que usan `storage` |
| `storage` | solo la biblioteca estándar (ningún módulo del proyecto) |
| `app.py` | `usecases`, `domain`, `export` y `tunnel` (y Flask). **Ni `storage` ni `sqlite3`** (CA-16) |
| `export.py`, `tunnel.py` | quedan fuera de las partes; solo los importa `app.py` |

### 2.3 Dónde va cada cosa que la app ya hace (CA-05, CA-09)

| Hoy | Pasa a | Parte |
| --- | --- | --- |
| Código rotatorio (`codes.py`) | `domain/codes.py` | dominio |
| Validar y normalizar nombres (`names.py`) | `domain/names.py` | dominio |
| «Sesión no existe», «sesión cerrada», «código no válido» (hoy `abort`/`error` en `app.py`) | `domain/session.py`: funciones de decisión y excepciones `SessionNotFound`, `SessionClosed`, `InvalidCode` con el mensaje de hoy | dominio |
| «Registro no existe» | también en `domain/session.py` como `CheckinNotFound`, para no crear otro módulo | dominio |
| Lógica dentro de las rutas de `app.py` (título por defecto, calcular `code`/`secondsLeft`, hora ISO, orquestar las decisiones) | `usecases/attendance.py`; cada acción recibe `db_path` y el reloj `now`, y usa `storage` directamente | acciones |
| SQL y esquema (`db.py`) | `storage/sqlite.py`. Cada función recibe la ruta de la base de datos, abre y cierra su propia conexión y no toma decisiones de negocio (CA-14, CA-15). Esquema sin cambios | almacenamiento |
| CSV (`export.py`) | se queda en `asistencia/export.py` | fuera de las partes |
| cloudflared (`tunnel.py`) | se queda en `asistencia/tunnel.py` | fuera de las partes |
| Rutas Flask, JSON, estados HTTP, token del profesor, `ProxyFix`, `main()`, `port_in_use` | se quedan en `app.py`, que traduce los errores del dominio a 404/409/422/400 | borde HTTP |

`create_app` solo conoce `db_path`: al arrancar llama a la acción `prepare(db_path)`, que crea el esquema y devuelve el token del profesor (se usa solo si `create_app` no recibe uno), y después pasa `db_path` a cada acción. Las acciones pasan `db_path` al almacenamiento (CA-16). Los casos de uso devuelven diccionarios y lanzan los errores del dominio. Así el JSON y los mensajes no cambian (CA-11). `app.py` sigue exportando `create_app` y `port_in_use` para que `python app.py`, `conftest.py` y `test_port.py` funcionen igual. `asistencia/hack-etico.sh` no es código de la app; se queda donde está.

### 2.4 Normas de escritura en `AGENTS.md` (CA-07)

Sección nueva, al estilo de `requests/api.py`. Reglas concretas:

- **Módulo:** empieza con una docstring de una frase que dice para qué sirve.
- **Función pública:** docstring con `:param nombre:` por cada parámetro, `:return:` y `:rtype:`; las que lanzan errores añaden `:raises Error:`.
- **Ejemplo:** un bloque `Usage::` con un uso corto.
- **Tipos** en los parámetros y el resultado de toda función pública.
- Funciones pequeñas con una sola tarea; sin lógica de negocio en las rutas; los errores de negocio son excepciones del dominio con mensaje claro en español.
- Las partes importan solo en el sentido de `docs/ARCHITECTURE.md`.
- Nombres en inglés, mensajes y docstrings en español; comentarios solo para el porqué; sin código muerto ni abstracciones «por si acaso».

Ejemplo que llevará `AGENTS.md`:

```python
def check_open(session: dict) -> None:
    """Comprueba que la sesión admite registros.

    :param session: la sesión tal como la guarda el almacenamiento.
    :return: nada si está abierta.
    :rtype: None
    :raises SessionClosed: si la sesión ya está cerrada.

    Usage::

        >>> check_open({"closed": False})
    """
```

### 2.5 Tests (CA-10, CA-13)

Los tests de antes no cambian lo que comprueban. Solo cambian los imports: `asistencia.codes` → `asistencia.domain.codes`, `asistencia.names` → `asistencia.domain.names`, `asistencia.db` → `asistencia.storage.sqlite`. `export` y `tunnel` no cambian de ruta.

Se añade `tests/test_architecture.py` con dos grupos de comprobaciones:

1. **Imports:** lee con `ast` los `import` de cada `.py` de `domain`, `usecases` y `storage` y falla si alguno importa lo que no le toca (tabla de §2.2; `usecases` puede importar `domain` y `storage`). Falla también si falta alguna de las tres carpetas. Además, falla si `app.py` importa `asistencia.storage` o `sqlite3` (CA-16).
2. **Documentos:** existen `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`; no existen `CONSTITUTION.md` ni `AGENT.md` en la raíz; `AGENTS.md` contiene `:param`, `:return` y `Usage`.

El test de referencias personales sigue valiendo: mira todos los `.md`, incluido `docs/`.

### 2.6 Orden de ejecución

Primero la documentación, después el código (dominio → almacenamiento → acciones → `app.py`), con `pytest` en verde en cada paso. Se mueve con `git mv` para conservar el historial.

---

## 3. Comprobación de la constitución

| Regla | Cómo la cumple el plan |
| --- | --- |
| P1 Independiente de la plataforma | El dominio y las acciones no conocen Flask ni SQLite; una integración nueva (Discord…) entra por una capa de entrada. |
| P2 Simplicidad | Sin puertos, sin contenedor, sin entidades-clase. Tres partes, cada una con contenido real; sin `web/` ni `infrastructure/` vacías. |
| P3 Dependencias mínimas | Ninguna dependencia nueva. |
| P4 Privacidad | Mismos datos guardados; el esquema no cambia. |
| P5 Móvil y accesible | `static/` no se toca. |
| P6 Todo en español | Documentos y mensajes en español; nombres de código en inglés. |
| §3 Stack | No cambia (Python, Flask, SQLite, pytest). |
| §4 SDD | Spec aprobada → este plan → tasks → implementación. |
| §5 Calidad | Cada CA tiene verificación (§4). `pytest` en verde en cada paso. |
| §6 Seguridad | Validación, token, códigos y cierre de sesión se mueven sin cambiar su lógica. |
| §7 Alcance | Todo dentro de `staff/ella-deyavorsky/asistenciapp/`. |

---

## 4. Verificación

| CA | Cómo |
| --- | --- |
| CA-01, 02, 06 | Listar la carpeta; `git diff -M` muestra `CONSTITUTION.md` movida sin cambios. |
| CA-03, 04, 05 | Lectura de `docs/ARCHITECTURE.md` contra la tabla de §2.3 (decisiones de sesión en `domain/session.py`). |
| CA-07 | Lectura de `AGENTS.md`; el test comprueba `:param`, `:return` y `Usage`. |
| CA-08 | Búsqueda de `AGENT.md` y `CONSTITUTION.md` en README y `AGENTS.md`: solo rutas nuevas. |
| CA-09 | `tests/test_architecture.py`, grupo de imports (nuevo). |
| CA-10 | `pytest`: todos los tests anteriores en verde. |
| CA-11 | Manual: arrancar con `python app.py`, crear clase, registrar a un alumno, cerrar y exportar. Parar el servidor y comprobar el puerto libre. |
| CA-12 | Ejecutar los comandos del README. |
| CA-13 | `tests/test_architecture.py`, grupo de documentos (nuevo). |
| CA-16 | `tests/test_architecture.py`: `app.py` no importa `asistencia.storage` ni `sqlite3`; `pytest`; manual de CA-11 otra vez. |
| CA-14, 15 | Revisión de `sqlite.py` (cada función abre y cierra con `_connection`; no importa nada del proyecto) y `test_architecture.py` con `storage` sin dependencias propias; doctest del módulo; `pytest`. |

---

## 5. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | Spec 005 aprobada |
| 1.0 | 2026-10-26 | Aprobado | Ok para pasar a las tareas |
| 1.1 | 2026-10-26 | Tres partes (`domain`, `usecases`, `storage`); `export.py` y `tunnel.py` no se mueven; decisiones de sesión en `domain/session.py`; normas de escritura concretas; test de documentos | Spec 005 v1.1. Aprobado |
| 1.2 | 2026-10-26 | `storage` abre y cierra su propia conexión por función, recibe `db_path` y no importa nada del proyecto; `create_app` deja de gestionar conexiones | Spec 005 v1.2. Aprobado e implementado |
| 1.3 | 2026-10-26 | `app.py` no importa `storage` ni `sqlite3`; nueva acción `prepare(db_path)`; las acciones dejan de recibir `repo` y usan `storage` directamente; `usecases` puede importar `storage` | Spec 005 v1.3. Aprobado |
