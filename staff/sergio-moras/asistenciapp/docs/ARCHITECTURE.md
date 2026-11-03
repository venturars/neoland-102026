# Arquitectura de AsistenciApp

Cómo está organizado el código y qué puede usar cada parte. Las reglas del proyecto están en [CONSTITUTION.md](CONSTITUTION.md); cómo se trabaja y cómo se escribe cada función, en [AGENTS.md](../AGENTS.md).

La idea viene de [python-clean-architecture-example](https://github.com/claudiosw/python-clean-architecture-example): las reglas en el centro, sin saber nada de la web ni de la base de datos, y lo externo alrededor. Se toma solo lo que esta app necesita (ver §5).

---

## 1. Las cuatro piezas

| Pieza | Carpeta | Responsabilidad |
| --- | --- | --- |
| **Reglas** | `asistencia/domain/` | Decidir si algo vale: el código, el nombre, si la clase existe y sigue abierta. Lanzan errores propios cuando no |
| **Casos de uso** | `asistencia/use_cases/` | Lo que hacen el profesor y el alumno. Piden la decisión a las reglas y el dato a la infraestructura |
| **Infraestructura** | `asistencia/infra/` | Hablar con el exterior: la base SQLite, el formato CSV y el túnel de Cloudflare. No decide reglas |
| **Entrada HTTP** | `app.py` (+ `static/`) | Recibir la petición, llamar a un caso de uso y convertir el resultado o el error en respuesta |

---

## 2. Quién puede importar a quién

| Pieza | Puede importar | No puede importar |
| --- | --- | --- |
| `asistencia/domain/` | biblioteca estándar | Flask, `sqlite3`, `use_cases`, `infra` |
| `asistencia/use_cases/` | `domain`, `infra` | Flask |
| `asistencia/infra/` | biblioteca estándar | Flask, `domain`, `use_cases` |
| `app.py` | `use_cases`, los errores de `domain`, `infra/tunnel.py` | `sqlite3`, `infra/sqlite_store.py` |

`tests/test_architecture.py` lee los `import` reales de cada fichero y falla si alguien rompe esta tabla.

---

## 3. Qué hay en cada fichero

| Fichero | Pieza | Qué hace |
| --- | --- | --- |
| `asistencia/domain/codes.py` | Reglas | Calcula el código de 4 cifras de cada ventana de 30 s y dice si uno es válido |
| `asistencia/domain/names.py` | Reglas | Limpia y valida el nombre del alumno, y calcula la clave para detectar duplicados |
| `asistencia/domain/rules.py` | Reglas | Errores de la clase (no existe, cerrada, código no válido) y las funciones que los lanzan |
| `asistencia/use_cases/teacher.py` | Casos de uso | Preparar la app, abrir, listar, ver, cerrar, quitar un registro y exportar |
| `asistencia/use_cases/student.py` | Casos de uso | Ver la clase y registrarse |
| `asistencia/infra/sqlite_store.py` | Infraestructura | Abrir `data/asistencia.db`, crear las tablas, guardar y leer |
| `asistencia/infra/csv_export.py` | Infraestructura | Convertir filas ya leídas en un CSV para Excel o Google Sheets |
| `asistencia/infra/tunnel.py` | Infraestructura | Lanzar `cloudflared` y obtener el enlace público |
| `app.py` | Entrada HTTP | Rutas Flask, permiso del profesor, arranque y traducción de errores a respuestas |
| `static/` | Entrada HTTP | Pantallas del profesor y del alumno (HTML, CSS y JS) |
| `asistencia/hack-etico.sh` | Fuera de las piezas | Demo de fuerza bruta. Solo habla con la app por HTTP |

---

## 4. Árbol de carpetas

```
asistenciapp/
├── AGENTS.md              # cómo se trabaja y cómo se escribe el código
├── README.md              # cómo usar la app
├── docs/
│   ├── CONSTITUTION.md    # reglas no negociables
│   └── ARCHITECTURE.md    # este archivo
├── specs/NNN-nombre/      # spec.md, plan.md y tasks.md de cada cambio
├── app.py                 # entrada HTTP
├── asistencia/
│   ├── domain/            # reglas
│   ├── use_cases/         # profesor y alumno
│   ├── infra/             # SQLite, CSV y túnel
│   └── hack-etico.sh      # demo de fuerza bruta
├── static/                # pantallas
├── tests/                 # pytest
├── requirements.txt       # Flask y pytest
├── pytest.ini
├── .venv/                 # entorno virtual (no se sube a git)
└── data/                  # base de datos (no se sube a git)
```

---

## 5. Lo que no se usa del ejemplo

El ejemplo de referencia es un proyecto más grande. Aquí no entran:

- **PostgreSQL, SQLAlchemy y Alembic.** Basta con `sqlite3` de la biblioteca estándar y un único archivo.
- **Una interfaz de almacenamiento ni una segunda base de datos.** Solo hay SQLite; los casos de uso usan `sqlite_store` directamente (constitución P2).
- **Una aplicación de línea de comandos.** La única entrada es `app.py`.
- **`.env`, pre-commit ni documentación generada.** No hay configuración secreta ni herramientas que los necesiten.

Si algún día hace falta una de ellas, se añade con su propia spec.
