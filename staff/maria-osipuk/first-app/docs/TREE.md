# Árbol

```text
first-app/
├── AGENTS.md
├── .gitignore
├── .prettierignore
├── README.md
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── scripts/
│   └── jupyter.sh
├── src/
│   ├── clients/
│   │   ├── http/
│   │   │   ├── create-http-server.js
│   │   │   ├── handle-request.js
│   │   │   ├── handle-users.js
│   │   │   ├── read-json-body.js
│   │   │   ├── send-http-error.js
│   │   │   ├── send-json.js
│   │   │   ├── serve-public-file.js
│   │   │   └── start-http-server.js
│   │   ├── jupyter/
│   │   │   ├── actualizar-usuario.ipynb
│   │   │   ├── bienvenida.ipynb
│   │   │   ├── borrar-usuario.ipynb
│   │   │   ├── buscar-usuario-por-email.ipynb
│   │   │   ├── buscar-usuario-por-id.ipynb
│   │   │   ├── contar-usuarios-por-genero.ipynb
│   │   │   ├── crear-usuario.ipynb
│   │   │   ├── listar-usuarios.ipynb
│   │   │   ├── preparar-tabla-usuarios.ipynb
│   │   │   └── run_logic.py
│   │   ├── terminal/
│   │   │   ├── count-users-by-gender.txt
│   │   │   ├── create-user.txt
│   │   │   ├── create-users-table.txt
│   │   │   ├── delete-user.txt
│   │   │   ├── find-user-by-email.txt
│   │   │   ├── find-user-by-id.txt
│   │   │   ├── list-users.txt
│   │   │   └── update-user.txt
│   │   └── web/
│   │       ├── delete-selected-user.js
│   │       ├── index.html
│   │       ├── load-user-selection.js
│   │       ├── main.js
│   │       ├── navigate.js
│   │       ├── open-user-editor.js
│   │       ├── save-user.js
│   │       ├── select-user.js
│   │       ├── show-message.js
│   │       ├── show-screen.js
│   │       ├── show-user-menu.js
│   │       ├── state.js
│   │       └── styles.css
│   ├── db/
│   │   ├── connection.js
│   │   └── users.sqlite
│   ├── logic/
│   │   ├── count-users-by-gender.js
│   │   ├── create-user.js
│   │   ├── delete-user.js
│   │   ├── find-user-by-email.js
│   │   ├── find-user-by-id.js
│   │   ├── list-users.js
│   │   └── update-user.js
│   └── queries/
│       ├── queries/
│       │   ├── create-users-table.sql
│       │   ├── delete.sql
│       │   ├── find-by-email.sql
│       │   ├── find-by-id.sql
│       │   ├── insert.sql
│       │   ├── list.sql
│       │   └── update.sql
│       └── users.js
├── agents/
│   ├── create-branch.md
│   ├── create-commit.md
│   ├── create-issue.md
│   ├── create-pr.md
│   ├── git-workflow-agent.md
│   ├── help-me-to-think.md
│   └── launch-push.md
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
├── tools/
│   ├── check-status.sh
│   ├── commit-changes.sh
│   ├── create-branch-from-staging.sh
│   ├── create-branch.sh
│   ├── create-empty-commit.sh
│   ├── launch-push.sh
│   └── pull-changes.sh
├── templates/
│   ├── issues/
│   │   ├── chore_issue.md
│   │   ├── docs_issue.md
│   │   ├── feat_issue.md
│   │   ├── fix_issue.md
│   │   ├── refactor_issue.md
│   │   └── test_issue.md
│   └── pull-request/
│       ├── chore-pull-request.md
│       ├── docs-pull-request.md
│       ├── feat-pull-request.md
│       ├── fix-pull-request.md
│       ├── refactor-pull-request.md
│       └── test-pull-request.md
├── MCPS/
│   └── github-mcp-server/
│       └── mcp.txt
├── docs/
│   ├── specs/
│   │   ├── adapt-git-workflow/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── align-code-with-guides/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── classifier/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── gestor-pnpm/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── jupyter-client/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── jupyter-script/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── move-code-into-src/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── prettier-and-eslint/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── split-sdd-guides/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── update-git-workflow-template/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   └── vanilla-user-client/
│   │       ├── plan.md
│   │       ├── spec.md
│   │       └── tasks.md
│   ├── ARCHITECTURE.md
│   ├── CONSTITUTION.md
│   ├── DATABASE.md
│   ├── ERRORS.md
│   ├── STYLE.md
│   ├── TREE.md
│   └── WEB-CLIENT-GUIDE.md
└── tests/
    └── http-client.test.js
```
