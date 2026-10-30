# Árbol de AsistenciApp

```text
asistenciapp/
├── docs/
│   ├── CONSTITUTION.md    # reglas del proyecto
│   ├── ARCHITECTURE.md    # responsabilidades y dependencias
│   ├── TREE.md            # estructura de esta copia
│   └── STYLE.md           # escritura del código
├── AGENTS.md             # trabajo diario del agente
├── README.md             # instrucciones de uso
├── specs/                # spec, plan y tareas de cada cambio
├── app.py                # entrada HTTP y punto de arranque
├── asistencia/
│   ├── domain/           # decisiones sin HTTP ni base de datos
│   ├── usecases/         # coordinación de las acciones
│   ├── storage/          # persistencia SQLite
│   ├── export.py         # formato CSV
│   └── tunnel.py         # enlace público
├── static/               # pantallas
├── tests/                # comportamiento y fronteras
├── requirements.txt      # Flask y pytest
├── pytest.ini            # configuración de pruebas
├── .venv/                # entorno local fuera de Git
└── data/                 # datos locales fuera de Git
```

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-spec-antes-del-cambio`.
