# Árbol

```text
first-app/
├── AGENTS.md
├── .gitignore
├── .prettierignore
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
│
├── scripts/
│   └── jupyter.sh
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
├── agents/
│   ├── create-branch.md
│   ├── create-commit.md
│   ├── create-issue.md
│   ├── create-pr.md
│   ├── git-workflow-agent.md
│   ├── help-me-to-think.md
│   └── launch-push.md
│
├── skills/
│   ├── assign-author/
│   │   └── SKILL.md
│   ├── assign-reviewers/
│   │   └── SKILL.md
│   ├── check-status/
│   │   └── SKILL.md
│   ├── commit-changes/
│   │   └── SKILL.md
│   ├── create-branch/
│   │   └── SKILL.md
│   ├── create-branch-from-staging/
│   │   └── SKILL.md
│   ├── create-draft/
│   │   └── SKILL.md
│   ├── create-empty-commit/
│   │   └── SKILL.md
│   ├── create-issue/
│   │   └── SKILL.md
│   ├── create-pr-base-staging/
│   │   └── SKILL.md
│   ├── grill-me/
│   │   └── SKILL.md
│   ├── grill-with-docs/
│   │   └── SKILL.md
│   ├── launch-push/
│   │   └── SKILL.md
│   ├── link-pr-to-issue/
│   │   └── SKILL.md
│   └── pull-changes/
│       └── SKILL.md
│
├── tools/
│   ├── check-status.sh
│   ├── commit-changes.sh
│   ├── create-branch-from-staging.sh
│   ├── create-branch.sh
│   ├── create-empty-commit.sh
│   ├── launch-push.sh
│   └── pull-changes.sh
│
├── templates/
│   ├── issues/
│   │   └── basic_issue.md
│   └── pull-request/
│       └── basic-pull-request.md
│
├── MCPS/
│   └── github-mcp-server/
│       └── mcp.txt
│
└── docs/
    ├── ARCHITECTURE.md
    ├── CONSTITUTION.md
    ├── DATABASE.md
    ├── ERRORS.md
    ├── STYLE.md
    ├── TREE.md
    └── specs/
        ├── adapt-git-workflow/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        ├── align-code-with-guides/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
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
        ├── jupyter-script/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        ├── prettier-and-eslint/
        │   ├── spec.md
        │   ├── plan.md
        │   └── tasks.md
        └── split-sdd-guides/
            ├── spec.md
            ├── plan.md
            └── tasks.md
```
