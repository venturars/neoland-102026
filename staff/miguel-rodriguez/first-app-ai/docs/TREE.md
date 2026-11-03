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
│       ├── vanilla-web-client/
│       │   ├── plan.md
│       │   ├── spec.md
│       │   └── tasks.md
│       ├── align-code-with-guides/
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
├── requirements-jupyter.txt
├── scripts/
│   └── jupyter.js
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
│   └── serve-data-through-node.test.js
└── tools/
    ├── check-status.sh
    ├── commit-changes.sh
    ├── create-branch-from-staging.sh
    ├── create-empty-commit.sh
    ├── launch-push.sh
    └── pull-changes.sh
```
