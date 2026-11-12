# Árbol de AsistenciApp

```
asistenciapp/
├── docs/
│   ├── CONSTITUTION.md      # reglas no negociables
│   ├── ARCHITECTURE.md      # cómo se organiza el código
│   ├── TREE.md              # este archivo
│   └── STYLE.md             # cómo se escribe el código
├── AGENTS.md                # manual de trabajo del agente
├── README.md                # cómo arrancar la app (para humanos)
├── specs/
│   └── NNN-nombre/
│       ├── spec.md          # qué y por qué
│       ├── plan.md          # cómo
│       └── tasks.md         # pasos
├── requirements.txt         # dependencias de Python (Flask, pytest)
├── pytest.ini               # configuración de pytest
├── app.py                   # petición del navegador y respuesta
├── asistencia/
│   ├── domain/              # reglas
│   ├── actions/             # acciones de pasar lista
│   └── infra/               # base, CSV y túnel
├── static/                  # HTML, CSS y JS del navegador
├── tests/                   # tests (test_*.py)
├── .venv/                   # entorno virtual de Python (no se sube a git)
└── data/                    # base de datos SQLite (no se sube a git)
```

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `005-docs-and-architecture`.
