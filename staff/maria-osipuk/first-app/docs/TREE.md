# Árbol

```text
first-app/
├── AGENTS.md
├── .gitignore
├── .prettierignore
├── README.md
├── babel.config.json
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── scripts/
│   └── jupyter.sh
├── src/
│   ├── clients/
│   │   ├── chrome/
│   │   │   ├── api.js
│   │   │   ├── manifest.json
│   │   │   ├── popup.html
│   │   │   ├── popup.js
│   │   │   └── styles.css
│   │   ├── electron/
│   │   │   ├── app.js
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   ├── preload.cjs
│   │   │   ├── styles.css
│   │   │   └── user-actions.js
│   │   ├── http/
│   │   │   └── app.js
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
│   │   ├── nest/
│   │   │   ├── app.module.js
│   │   │   ├── main.js
│   │   │   ├── users-exception.filter.js
│   │   │   ├── users.controller.js
│   │   │   └── users.service.js
│   │   ├── terminal/
│   │   │   ├── count-users-by-gender.txt
│   │   │   ├── create-user.txt
│   │   │   ├── create-users-table.txt
│   │   │   ├── delete-user.txt
│   │   │   ├── find-user-by-email.txt
│   │   │   ├── find-user-by-id.txt
│   │   │   ├── list-users.txt
│   │   │   └── update-user.txt
│   │   ├── vscode/
│   │   │   ├── extension.js
│   │   │   ├── index.html
│   │   │   ├── package.json
│   │   │   ├── styles.css
│   │   │   ├── user-actions.js
│   │   │   ├── users.svg
│   │   │   └── view.js
│   │   └── web/
│   │       ├── app.js
│   │       ├── index.html
│   │       └── styles.css
│   ├── db/
│   │   ├── server.js
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
│       │   ├── create-users-table.js
│       │   ├── delete.js
│       │   ├── find-by-email.js
│       │   ├── find-by-id.js
│       │   ├── insert.js
│       │   ├── list.js
│       │   └── update.js
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
│   ├── create-pr-base-staging.sh
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
│   ├── github-mcp-server/
│   │   └── mcp.txt
│   └── socket-mcp/
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
│   │   ├── chrome-extension-client/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── classifier/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── electron-desktop-client/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── express-rest-client/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── gestor-pnpm/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── independent-web-http-clients/
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
│   │   ├── nest-swagger-ui/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── nest-users-client/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── prettier-and-eslint/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── reorganize-sdd-docs/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── socket-mcp-reference/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── split-sdd-guides/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── sync-git-workflow-template/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── update-git-workflow-template/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   ├── vanilla-user-client/
│   │   │   ├── plan.md
│   │   │   ├── spec.md
│   │   │   └── tasks.md
│   │   └── vscode-extension-client/
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
    ├── chrome-client.test.js
    ├── database-server.test.js
    ├── electron-client.test.js
    ├── http-client.test.js
    ├── nest-client.test.js
    ├── shared-database.test.js
    └── vscode-client.test.js
```
