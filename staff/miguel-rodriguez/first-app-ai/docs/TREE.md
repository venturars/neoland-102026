# Project tree

```text
first-app-ai/
├── .cursor/
│   └── agents/
│       ├── create-branch.md
│       ├── create-commit.md
│       ├── create-issue.md
│       ├── create-pr.md
│       ├── help-me-to-think.md
│       └── launch-push.md
├── .gitignore
├── AGENTS.md
├── MCPS/
│   ├── github-mcp-server/
│   │   └── mcp.txt
│   └── socket-mcp/
│       └── mcp.txt
├── README.md
├── agents/
│   ├── create-branch.md
│   ├── create-commit.md
│   ├── create-issue.md
│   ├── create-pr.md
│   ├── git-workflow-agent.md
│   ├── help-me-to-think.md
│   └── launch-push.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONSTITUTIONS.md
│   ├── DATABASE.md
│   ├── ERRORS.md
│   ├── STYLE.md
│   ├── TREE.md
│   └── specs/
│       ├── bruno-http-client/
│       │   ├── spec.md
│       │   ├── plan.md
│       │   └── tasks.md
│       ├── nest-swagger-ui/
│       │   ├── spec.md
│       │   ├── plan.md
│       │   └── tasks.md
│       ├── workflow-rounds-and-commits/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── vscode-user-client/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── vanilla-web-client/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── align-code-with-guides/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── complete-user-clients/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── classifier/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── find-user-by-name/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── git-workflow-automation/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── jupyter-client/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── move-layers-under-src/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── prettier-and-eslint/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── socket-mcp-access/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── socket-package-validation/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── rest-user-client/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── update-workflow-task-checks/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── update-git-workflow-templates/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── serve-data-through-node/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       └── split-sdd-guides/
│           ├── plan.md
│           ├── spec.md
│           └── tasks.md
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── requirements-jupyter.txt
├── scripts/
│   ├── jupyter.js
│   └── web.js
├── skills/
│   ├── assign-author/
│   │   └── SKILL.md
│   ├── assign-reviewers/
│   │   └── SKILL.md
│   ├── check-status/
│   │   └── SKILL.md
│   ├── commit-changes/
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
├── src/
│   ├── clients/
│   │   ├── chrome/
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   │   ├── popup.js
│   │   │   ├── server.js
│   │   │   └── styles.css
│   │   ├── electron/
│   │   │   ├── app.js
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   └── styles.css
│   │   ├── http/
│   │   │   ├── app.js
│   │   │   ├── bruno.md
│   │   │   └── bruno/
│   │   │       ├── bruno.json
│   │   │       ├── collection.bru
│   │   │       ├── 01-sql-online/
│   │   │       │   ├── 01-empty-list.bru
│   │   │       │   ├── 02-create-ada.bru
│   │   │       │   ├── 03-create-grace.bru
│   │   │       │   ├── 04-list-users.bru
│   │   │       │   ├── 05-find-ada.bru
│   │   │       │   ├── 06-patch-name.bru
│   │   │       │   ├── 07-patch-email.bru
│   │   │       │   ├── 08-snapshot-users.bru
│   │   │       │   ├── 09-create-empty-name.bru
│   │   │       │   ├── 10-preserve-after-create-empty-name.bru
│   │   │       │   ├── 11-create-invalid-email.bru
│   │   │       │   ├── 12-preserve-after-create-invalid-email.bru
│   │   │       │   ├── 13-create-used-email.bru
│   │   │       │   ├── 14-preserve-after-create-used-email.bru
│   │   │       │   ├── 15-patch-empty-name.bru
│   │   │       │   ├── 16-preserve-after-patch-empty-name.bru
│   │   │       │   ├── 17-patch-invalid-email.bru
│   │   │       │   ├── 18-preserve-after-patch-invalid-email.bru
│   │   │       │   ├── 19-patch-used-email.bru
│   │   │       │   ├── 20-preserve-after-patch-used-email.bru
│   │   │       │   ├── 21-find-missing.bru
│   │   │       │   ├── 22-preserve-after-find-missing.bru
│   │   │       │   ├── 23-patch-missing.bru
│   │   │       │   ├── 24-preserve-after-patch-missing.bru
│   │   │       │   ├── 25-delete-missing.bru
│   │   │       │   ├── 26-preserve-after-delete-missing.bru
│   │   │       │   ├── 27-delete-ada.bru
│   │   │       │   ├── 28-list-grace.bru
│   │   │       │   ├── 29-delete-grace.bru
│   │   │       │   ├── 30-empty-list-after-delete.bru
│   │   │       │   └── folder.bru
│   │   │       └── 02-sql-offline/
│   │   │           ├── 01-create-sql-offline.bru
│   │   │           ├── 02-list-sql-offline.bru
│   │   │           ├── 03-find-sql-offline.bru
│   │   │           ├── 04-update-sql-offline.bru
│   │   │           ├── 05-delete-sql-offline.bru
│   │   │           └── folder.bru
│   │   ├── vscode/
│   │   │   ├── .vscode/
│   │   │   │   └── launch.json
│   │   │   ├── extension.cjs
│   │   │   ├── package.json
│   │   │   ├── panel.html
│   │   │   ├── panel.js
│   │   │   └── panel.css
│   │   ├── web/
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   └── styles.css
│   │   ├── jupyter/
│   │   │   ├── 01-create-users-table.ipynb
│   │   │   ├── 02-create-user.ipynb
│   │   │   ├── 03-list-users.ipynb
│   │   │   ├── 04-find-user-by-email.ipynb
│   │   │   ├── 05-find-user-by-id.ipynb
│   │   │   ├── 06-find-user-by-name.ipynb
│   │   │   ├── 07-update-user.ipynb
│   │   │   ├── 08-delete-user.ipynb
│   │   │   ├── 09-users-gender-count.ipynb
│   │   │   ├── client.py
│   │   │   └── run-operation.js
│   │   └── terminal/
│   │       ├── create-user.txt
│   │       ├── create-users-table.txt
│   │       ├── delete-user.txt
│   │       ├── find-user-by-email.txt
│   │       ├── find-user-by-id.txt
│   │       ├── find-user-by-name.txt
│   │       ├── list-users.txt
│   │       ├── update-user.txt
│   │       └── users-gender-count.txt
│   ├── db/
│   │   └── server.js
│   ├── logic/
│   │   ├── create-user.js
│   │   ├── delete-user.js
│   │   ├── find-user-by-email.js
│   │   ├── find-user-by-id.js
│   │   ├── find-user-by-name.js
│   │   ├── list-users.js
│   │   ├── update-user.js
│   │   └── users-gender-count.js
│   └── queries/
│       ├── queries/
│       │   ├── create-users-table.js
│       │   ├── find-all.js
│       │   ├── find-by-email.js
│       │   ├── find-by-id.js
│       │   ├── find-by-name.js
│       │   ├── insert.js
│       │   ├── list-tables.js
│       │   ├── remove.js
│       │   └── update.js
│       └── users.js
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
├── tests/
│   ├── nest-swagger.test.js
│   ├── browser-classifier.test.js
│   ├── client-apis.test.js
│   ├── client-ui-state.test.js
│   ├── serve-data-through-node.test.js
│   ├── vscode-client.test.js
│   └── web-client.test.js
└── tools/
    ├── check-status.sh
    ├── commit-changes.sh
    ├── create-branch-from-staging.sh
    ├── create-empty-commit.sh
    ├── launch-push.sh
    └── pull-changes.sh
```


Cliente src/clients/nest: main.js, app.module.js, users.controller.js,
users.service.js y http-exception.filter.js. babel.config.json configura la
compilación; dist/ es salida generada ignorada por Git.


Random-picker additions:

- `src/logic/pick-random-user.js`
- `src/clients/terminal/pick-random-user.txt`
- `tests/random-user-picker.test.js`
- `docs/specs/random-user-picker/spec.md`
- `docs/specs/random-user-picker/plan.md`
- `docs/specs/random-user-picker/tasks.md`
