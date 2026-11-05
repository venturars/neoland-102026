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
│   ├── jupyter-node-http.sh
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
│   │   │   ├── app.js
│   │   │   └── bruno/
│   │   │       ├── 01-sql-online/
│   │   │       │   ├── 01-empty-list.bru
│   │   │       │   ├── 02-create-ada.bru
│   │   │       │   ├── 03-list-users.bru
│   │   │       │   ├── 04-find-ada.bru
│   │   │       │   ├── 05-patch-name.bru
│   │   │       │   ├── 06-create-empty-name.bru
│   │   │       │   ├── 07-create-invalid-email.bru
│   │   │       │   ├── 08-create-used-email.bru
│   │   │       │   ├── 09-get-missing.bru
│   │   │       │   ├── 10-patch-missing.bru
│   │   │       │   ├── 11-delete-missing.bru
│   │   │       │   ├── 12-delete-ada.bru
│   │   │       │   ├── 13-list-after-delete.bru
│   │   │       │   ├── 14-count-empty.bru
│   │   │       │   └── folder.bru
│   │   │       ├── 02-sql-offline/
│   │   │       │   ├── 15-create-sql-offline.bru
│   │   │       │   ├── 16-list-sql-offline.bru
│   │   │       │   ├── 17-find-sql-offline.bru
│   │   │       │   ├── 18-update-sql-offline.bru
│   │   │       │   ├── 19-delete-sql-offline.bru
│   │   │       │   ├── 20-count-sql-offline.bru
│   │   │       │   └── folder.bru
│   │   │       ├── bruno.json
│   │   │       └── collection.bru
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
│   │   ├── node-http/
│   │   │   ├── app.js
│   │   │   └── jupyter/
│   │   │       ├── create-user.ipynb
│   │   │       ├── delete-user.ipynb
│   │   │       ├── find-user-by-id.ipynb
│   │   │       ├── list-users.ipynb
│   │   │       └── update-user.ipynb
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
│   │   ├── bruno-http-client/
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
│   │   ├── node-http-client/
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
    ├── node-http-client.test.js
    ├── shared-database.test.js
    └── vscode-client.test.js
```
