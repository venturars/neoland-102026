# Arquitectura de AsistenciApp

Cómo se organiza el código y dónde va cada pieza. Está basada en el ejemplo [python-clean-architecture-example](https://github.com/claudiosw/python-clean-architecture-example), recortada a lo que esta app necesita (constitución P2 y P3). Las reglas de escritura del código están en [AGENTS.md](../AGENTS.md).

---

## 1. Las partes

```
asistenciapp/
├── app.py                      # borde HTTP: rutas, token del profesor, errores HTTP, arranque
└── asistencia/
    ├── domain/                 # reglas puras, sin Flask ni SQLite
    │   ├── codes.py            # código rotatorio de 4 cifras
    │   ├── names.py            # validar y normalizar nombres; nombres parecidos
    │   ├── passes.py           # pase de 2 minutos y recibo del registro (firmados); un pase, un registro
    │   ├── rate_limit.py       # límite de intentos por IP y su error
    │   ├── roster.py           # leer y revisar la lista de un grupo; errores de grupos
    │   └── session.py          # decisiones de sesión y de grupo, y sus errores
    ├── usecases/
    │   ├── attendance.py       # acciones: crear, consultar, registrar, cerrar, borrar, decidir sobre nuevos, exportar
    │   └── groups.py           # acciones de grupos: revisar, crear, editar, archivar, borrar
    ├── storage/
    │   └── sqlite.py           # acceso a SQLite (sesiones, registros, grupos, copias de la lista, IP)
    ├── export.py               # CSV de la lista (sesión rápida y sesión con grupo)
    └── tunnel.py               # túnel público con cloudflared
```

| Parte | Qué contiene | Qué NO contiene |
| --- | --- | --- |
| `domain/` | Las reglas de negocio: calcular y validar el código, limpiar nombres, decidir «la sesión no existe», «la sesión está cerrada», «el código no es válido» y «esta IP se ha pasado de los límites» (con sus errores). | Flask, SQL, ficheros, red. |
| `usecases/` | Las acciones que hace la app. Reciben la ruta de la base de datos y el reloj, usan el dominio y el almacenamiento, y devuelven diccionarios. Son las únicas que usan `storage`; incluyen `prepare`, que crea la base al arrancar y devuelve el token del profesor. | Rutas, JSON de Flask, SQL. |
| `storage/` | SQL y esquema. Cada función recibe la ruta de la base de datos, abre y cierra su propia conexión y solo guarda y lee lo que la acción ya decidió. | Reglas de negocio: no comprueba si la sesión está cerrada ni si el código vale; no importa Flask, `codes`, `names` ni `session`. |
| `app.py` | Rutas Flask, token del profesor, `ProxyFix`, traducción de errores del dominio a estados HTTP (404, 409, 422, 400), `main` y `port_in_use`. | Decisiones de negocio. |
| `export.py`, `tunnel.py` | Se quedan donde están, fuera de las tres partes. Solo los usa `app.py`. | — |

---

## 2. Quién puede importar a quién

Las dependencias van siempre hacia el dominio. Lo que no está en la tabla está prohibido.

| Parte | Puede importar |
| --- | --- |
| `domain` | solo la biblioteca estándar |
| `usecases` | `domain` y `storage` (y la biblioteca estándar) |
| `storage` | solo la biblioteca estándar (ningún módulo del proyecto) |
| `app.py` | `usecases`, `domain`, `export`, `tunnel` y Flask. **Ni `storage` ni `sqlite3`**: solo conoce la ruta de la base (`db_path`) y se la pasa a las acciones |

`tests/test_architecture.py` lee los `import` de `domain`, `usecases` y `storage` y falla si alguno rompe la tabla. También falla si `app.py` importa `asistencia.storage` o `sqlite3`.

---

## 3. Dónde va cada cosa que la app ya hace

| La app… | Va en |
| --- | --- |
| Calcula el código rotatorio y comprueba si vale | `domain/codes.py` |
| Valida y normaliza nombres, y dice si dos nombres se parecen («¿Quisiste decir…?») | `domain/names.py` |
| Lee una lista pegada o un CSV (`;` o `,`), la revisa (repetidos, largos, más de 200) y define los errores de grupos | `domain/roster.py` |
| Firma y comprueba el pase de 2 minutos y el recibo que libera el navegador | `domain/passes.py` |
| Decide si un grupo puede abrir sesión (archivado, vacío) o borrarse (sesión abierta) | `domain/session.py` |
| Crea, revisa, edita, archiva y borra grupos | `usecases/groups.py` |
| Abre sesiones con grupo y su copia de la lista; valida el código y da el pase; registra de la lista o como nuevo; decide sobre los nuevos | `usecases/attendance.py` |
| Guarda grupos (`groups`, `group_students`), la copia fija de cada sesión (`session_roster`), los pases ya usados (`used_passes`, sin datos del alumno) y añade al arrancar las columnas nuevas de `sessions` y `checkins` | `storage/sqlite.py` |
| Decide si una IP se ha pasado de 5 intentos por segundo o 20 por minuto, y rechaza la bloqueada | `domain/rate_limit.py` |
| Decide «sesión no existe», «sesión cerrada», «código no válido» y «registro no existe» | `domain/session.py` |
| Crea, consulta, cierra sesiones; registra y borra asistentes; en `check_in` coordina el límite por IP (pregunta al almacenamiento, aplica la regla del dominio y bloquea) | `usecases/attendance.py` |
| Guarda y lee de SQLite, incluidas las tablas `ip_attempts` (contadores) y `blocked_ips` (lista negra), sin relación con nombres ni sesiones | `storage/sqlite.py` |
| Averigua la IP de la conexión (`request.remote_addr`, nunca una cabecera) y traduce el bloqueo a 429 | `app.py` |
| Exporta la lista a CSV (`to_csv` para sesiones rápidas, `to_group_csv` con «Estado» para sesiones con grupo) | `export.py` |
| Abre el túnel público | `tunnel.py` |
| Atiende las rutas, comprueba el token, devuelve JSON y estados HTTP, arranca el servidor | `app.py` |

---

## 4. Qué se dejó fuera del ejemplo y por qué

| Del ejemplo | Aquí | Motivo |
| --- | --- | --- |
| Capas `infrastructure` y `web` separadas | No | No tendrían contenido propio (P2). |
| Interfaces abstractas (puertos) | No | Solo hay un almacenamiento real (SQLite). Se añade un puerto cuando haya un segundo (P2). |
| Contenedor de inyección de dependencias | No | El cableado se hace a mano en `create_app` (P2). |
| Entidades como clases | No | Sesiones y registros son diccionarios. |
| Librerías de validación, ORM… | No | Dependencias mínimas (P3). |

---

## 5. Cómo añadir una funcionalidad nueva

1. Escribe la spec, el plan y las tasks (constitución §4).
2. Si hay una **regla nueva**, va en `domain/` con su test.
3. Si es una **acción nueva**, va en `usecases/attendance.py` (sesiones y registros) o en `usecases/groups.py` (grupos): recibe `db_path` y el reloj, usa el dominio y el almacenamiento, y lanza errores del dominio.
4. Si necesita **datos nuevos**, la función SQL va en `storage/sqlite.py`.
5. Si es una **ruta nueva**, va en `app.py`: llama a la acción y traduce los errores a HTTP. Sin lógica de negocio.
6. Una integración nueva (por ejemplo, un bot de Discord) es otro borde como `app.py` que llama a `usecases/`.
7. Ejecuta `pytest`: `test_architecture.py` avisa si algún `import` va en sentido contrario.
