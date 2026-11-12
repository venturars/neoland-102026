# Tasks — adapt the git workflow

## Update the constitution

1. In "Specs" of `docs/CONSTITUTIONS.md`, add the first paragraph from "Constitution". Result: the issue comes before the folder.
2. In "Specs" of `docs/CONSTITUTIONS.md`, add the review sentence from "Constitution". Result: a person reviews the spec and the plan before `tasks.md`.
3. In "spec.md" of `docs/CONSTITUTIONS.md`, add the `Issue: #N` line from "Constitution". Result: each spec opens with its issue.
4. In the last paragraph of `docs/CONSTITUTIONS.md`, write "issue, spec, plan, tasks, code". Result: the pass starts with the issue.
5. In `docs/TREE.md`, add the block from "Tree" after `scripts/`. Result: the tree lists the five new folders and their files.
6. In "Layers" of `docs/ARCHITECTURE.md`, add the five lines from "Architecture". Result: each new folder has its job.
7. In "Files" of `docs/ARCHITECTURE.md`, add the five subsections from "Architecture" before "docs/". Result: each new file has its job.
8. In "docs/" of `docs/ARCHITECTURE.md`, replace the `specs/` line with the one from "Architecture". Result: the specs open with `Issue: #N`.
9. In `AGENTS.md` of first-app, add the git workflow paragraph from "AGENTS.md" after the first line. Result: the guide points to `agents/git-workflow-agent.md`.
10. In `AGENTS.md` of first-app, add the "Order" section from "AGENTS.md" before "Rules". Result: the issue comes before `docs/specs/` and the stops are written.
11. In "Rules" of `AGENTS.md`, replace the new-feature line with the one from "AGENTS.md". Result: a new feature starts with the orchestrator.

## Get the outside tool ready

12. Copy `agents/create-branch.md` from the template. Result: the text is the same as in the template.
13. Copy `agents/create-commit.md` from the template. Result: the text is the same as in the template.
14. Copy `agents/create-issue.md` from the template. Result: the text is the same as in the template.
15. Copy `agents/create-pr.md` from the template. Result: the text is the same as in the template.
16. Copy `agents/git-workflow-agent.md` from the template. Result: the text is the same as in the template.
17. Copy `agents/help-me-to-think.md` from the template. Result: the text is the same as in the template.
18. Copy `agents/launch-push.md` from the template. Result: the text is the same as in the template.
19. Copy `skills/assign-author/SKILL.md` from the template. Result: the text is the same as in the template.
20. Copy `skills/assign-reviewers/SKILL.md` from the template. Result: the text is the same as in the template.
21. Copy `skills/check-status/SKILL.md` from the template. Result: the text is the same as in the template.
22. Copy `skills/commit-changes/SKILL.md` from the template. Result: the text is the same as in the template.
23. Copy `skills/create-branch-from-staging/SKILL.md` from the template. Result: the text is the same as in the template.
24. Copy `skills/create-branch/SKILL.md` from the template. Result: the text is the same as in the template.
25. Copy `skills/create-draft/SKILL.md` from the template. Result: the text is the same as in the template.
26. Copy `skills/create-empty-commit/SKILL.md` from the template. Result: the text is the same as in the template.
27. Copy `skills/create-issue/SKILL.md` from the template. Result: the text is the same as in the template.
28. Copy `skills/create-pr-base-staging/SKILL.md` from the template. Result: the text is the same as in the template.
29. Copy `skills/grill-me/SKILL.md` from the template. Result: the text is the same as in the template.
30. Copy `skills/grill-with-docs/SKILL.md` from the template. Result: the text is the same as in the template.
31. Copy `skills/launch-push/SKILL.md` from the template. Result: the text is the same as in the template.
32. Copy `skills/link-pr-to-issue/SKILL.md` from the template. Result: the text is the same as in the template.
33. Copy `skills/pull-changes/SKILL.md` from the template. Result: the text is the same as in the template.
34. Copy `tools/check-status.sh` from the template. Result: the script is executable.
35. Copy `tools/commit-changes.sh` from the template. Result: the script is executable.
36. Copy `tools/create-branch-from-staging.sh` from the template. Result: the script is executable.
37. Copy `tools/create-branch.sh` from the template. Result: the script is executable.
38. Copy `tools/create-empty-commit.sh` from the template. Result: the script is executable.
39. Copy `tools/launch-push.sh` from the template. Result: the script is executable.
40. Copy `tools/pull-changes.sh` from the template. Result: the script is executable.
41. Copy `templates/issues/basic_issue.md` from the template. Result: the text is the same as in the template.
42. Copy `templates/pull-request/basic-pull-request.md` from the template. Result: the text is the same as in the template.
43. Copy `MCPS/github-mcp-server/mcp.txt` from the template. Result: the text is the same as in the template.
44. In `skills/check-status/SKILL.md`, change `./tools/` to `staff/ella-deyavorsky/first-app/tools/`. Result: the command runs from the root of the repository.
45. In `skills/pull-changes/SKILL.md`, change `./tools/` to `staff/ella-deyavorsky/first-app/tools/`. Result: the command runs from the root of the repository.
46. In `skills/create-branch-from-staging/SKILL.md`, change `./tools/` to `staff/ella-deyavorsky/first-app/tools/`. Result: the command runs from the root of the repository.
47. In `skills/create-branch/SKILL.md`, change `./tools/` to `staff/ella-deyavorsky/first-app/tools/`. Result: the command runs from the root of the repository.
48. In `skills/create-empty-commit/SKILL.md`, change `./tools/` to `staff/ella-deyavorsky/first-app/tools/`. Result: the command runs from the root of the repository.
49. In `skills/commit-changes/SKILL.md`, change `./tools/` to `staff/ella-deyavorsky/first-app/tools/`. Result: the command runs from the root of the repository.
50. In `skills/launch-push/SKILL.md`, change `./tools/` to `staff/ella-deyavorsky/first-app/tools/`. Result: the command runs from the root of the repository.

## Run it

51. From the root of the repository, run `staff/ella-deyavorsky/first-app/tools/check-status.sh`. Result: it prints the repository, the branch and the remote, and exits with 0.
52. Compare `git diff --stat` against `staging` for `logic/`, `queries/`, `db/`, `clients/` and `package.json`. Result: there is no change.
