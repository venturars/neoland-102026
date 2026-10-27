# Árbol

```text
first-app/
├── AGENTS.md
├── .gitignore
├── package.json
├── pnpm-lock.yaml
│
├── db/
│   ├── connection.js
│   └── users.sqlite
│
├── queries/
│   ├── queries/
│   │   ├── create-users-table.sql
│   │   ├── delete.sql
│   │   ├── find-by-email.sql
│   │   ├── find-by-id.sql
│   │   ├── insert.sql
│   │   ├── list.sql
│   │   └── update.sql
│   └── users.js
│
├── logic/
│   ├── count-users-by-gender.js
│   ├── create-user.js
│   ├── delete-user.js
│   ├── find-user-by-email.js
│   ├── find-user-by-id.js
│   ├── list-users.js
│   └── update-user.js
│
├── clients/
│   ├── jupyter/
│   │   ├── actualizar-usuario.ipynb
│   │   ├── bienvenida.ipynb
│   │   ├── borrar-usuario.ipynb
│   │   ├── buscar-usuario-por-email.ipynb
│   │   ├── buscar-usuario-por-id.ipynb
│   │   ├── contar-usuarios-por-genero.ipynb
│   │   ├── crear-usuario.ipynb
│   │   ├── listar-usuarios.ipynb
│   │   ├── preparar-tabla-usuarios.ipynb
│   │   └── run_logic.py
│   └── terminal/
│       ├── count-users-by-gender.txt
│       ├── create-users-table.txt
│       ├── create-user.txt
│       ├── delete-user.txt
│       ├── find-user-by-email.txt
│       ├── find-user-by-id.txt
│       ├── list-users.txt
│       └── update-user.txt
│
└── docs/
    ├── ARCHITECTURE.md
    ├── CONSTITUTION.md
    ├── DATABASE.md
    ├── ERRORS.md
    ├── STYLE.md
    ├── TREE.md
    └── specs/
        ├── classifier/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        ├── gestor-pnpm/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        ├── jupyter-client/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        └── split-sdd-guides/
            ├── spec.md
            ├── plan.md
            └── tasks.md
```
