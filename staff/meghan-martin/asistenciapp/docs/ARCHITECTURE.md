# Arquitectura de AsistenciApp

Este archivo dice **cómo está repartido el código** de esta carpeta.

Hay tres ideas. Una de fuera puede usar una de dentro. Una de dentro no llama a una de fuera.

---

## 1. Tres partes

1. **Reglas** (`asistencia/codes.py` y `asistencia/names.py`): dicen si el código y el nombre valen. No abren la base y no dibujan la página.
2. **Acciones y pantalla** (`app.py` y `static/`): `app.py` recibe la petición, pide la regla, abre la base y responde. `static/` es lo que ve el profesor y el alumno.
3. **Almacén** (`asistencia/db.py`): guarda y lee en SQLite. No decide si el código vale y no dibuja la página.

`asistencia/export.py` da formato CSV a filas que ya están cargadas. `asistencia/tunnel.py` publica el enlace para que los alumnos entren desde casa. Ninguno de los dos decide la asistencia.

---

## 2. Estructura de carpetas

```
asistenciapp/
├── docs/
│   └── ARCHITECTURE.md    # este archivo
├── CONSTITUTION.md        # reglas no negociables
├── AGENT.md               # cómo se trabaja
├── README.md              # cómo arrancar la app (para humanos)
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # dependencias de Python (Flask, pytest)
├── pytest.ini             # configuración de pytest
├── app.py                 # recibe la petición, pide la regla y abre la base
├── asistencia/
│   ├── codes.py           # reglas del código
│   ├── names.py           # reglas del nombre
│   ├── db.py              # almacén SQLite
│   ├── export.py          # CSV de filas ya cargadas
│   └── tunnel.py          # enlace público
├── static/                # HTML, CSS y JS del navegador
├── tests/                 # tests (test_*.py)
├── .venv/                 # entorno virtual de Python (no se sube a git)
└── data/                  # base de datos SQLite (no se sube a git)
```

---

## 3. Qué archivo vive en cada parte

| Archivo | Parte | Qué hace |
| --- | --- | --- |
| `asistencia/codes.py` | Reglas | Calcula el código de 4 cifras y dice si el que escribió el alumno vale |
| `asistencia/names.py` | Reglas | Acepta o rechaza el nombre |
| `asistencia/db.py` | Almacén | Crea las tablas, guarda la clase y los registros, y los lee |
| `asistencia/export.py` | CSV | Da formato a filas que ya están cargadas. No abre la base |
| `asistencia/tunnel.py` | Enlace | Publica el enlace público. No sabe de la lista |
| `app.py` | Pantalla | Recibe HTTP, usa las reglas, abre la base y devuelve la respuesta |
| `static/` | Pantalla | HTML, CSS y JavaScript. No abren la base |
