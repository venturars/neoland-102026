# Arquitectura de AsistenciApp

Este archivo dice **cómo está repartido el código** de esta carpeta.

Hay tres partes. Una de fuera puede usar una de dentro. Una de dentro no llama a una de fuera.

---

## 1. Tres partes

1. **Reglas** (`asistencia/domain/`): dicen si la clase existe, si sigue abierta y si el código y el nombre valen. No abren la base y no dibujan la página.
2. **Acciones** (`asistencia/usecases/`): abren una clase, la cierran, anotan un nombre, listan, borran y exportan. Piden la regla y el almacén. No dibujan la página.
3. **Almacén** (`asistencia/storage/`): guarda y lee en SQLite. Abre el fichero y lo cierra. No decide si el código vale y no dibuja la página.

`app.py` recibe la petición, pide una acción y responde. No abre la base. `static/` es lo que ve el profesor y el alumno.

`asistencia/export.py` da formato CSV a filas que ya están cargadas. `asistencia/tunnel.py` publica el enlace para que los alumnos entren desde casa. Ninguno de los dos decide la asistencia.

---

## 2. Estructura de carpetas

```
asistenciapp/
├── docs/
│   ├── CONSTITUTION.md    # reglas no negociables
│   └── ARCHITECTURE.md    # este archivo
├── AGENTS.md              # cómo se trabaja
├── README.md              # cómo arrancar la app (para humanos)
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # dependencias de Python (Flask, pytest)
├── pytest.ini             # configuración de pytest
├── app.py                 # recibe la petición y pide una acción
├── asistencia/
│   ├── domain/            # reglas
│   ├── usecases/          # acciones
│   ├── storage/           # almacén SQLite
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
| `asistencia/domain/codes.py` | Reglas | Calcula el código de 4 cifras y dice si el que escribió el alumno vale |
| `asistencia/domain/names.py` | Reglas | Acepta o rechaza el nombre |
| `asistencia/domain/roster.py` | Reglas | La lista de la clase y qué nombres coinciden con lo escrito. No abre el fichero ni dibuja la página |
| `asistencia/domain/session.py` | Reglas | Dice si la clase existe, si sigue abierta y si el código vale ahora |
| `asistencia/domain/attempts.py` | Reglas | Decide si los intentos de una dirección se han pasado. No abre el fichero ni dibuja la página |
| `asistencia/usecases/attendance.py` | Acciones | Abre, cierra, anota, lista, borra y exporta. Pide la regla y el almacén |
| `asistencia/storage/sqlite.py` | Almacén | Crea las tablas, guarda la clase y los registros, y los lee |
| `asistencia/export.py` | CSV | Da formato a filas que ya están cargadas. No abre la base |
| `asistencia/tunnel.py` | Enlace | Publica el enlace público. No sabe de la lista |
| `app.py` | Pantalla | Recibe HTTP, pide una acción y devuelve la respuesta. No abre la base |
| `static/` | Pantalla | HTML, CSS y JavaScript. No abren la base |
