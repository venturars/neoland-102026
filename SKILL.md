# Skills

Cinco skills, en el orden en que las usa `docs/GIT-WORKFLOW.md`. Los pasos van en inglés. En cada una, la nota en español gana si choca con los pasos generales.

## git-commit

---

name: git-commit
description: >-
  Make a conventional commit from the real diff. Use when the user asks to
  commit, to save a piece of work, or says /commit.

---

# Git commit

1. Read the change. If files are staged, use `git diff --staged`. If nothing is staged, use `git diff`. Also run `git status --porcelain`.
2. Stage only the files that belong in this one change. Leave unrelated files unstaged. Never stage secrets (`.env`, credentials, private keys).
3. Write one conventional message:

```
<type>(optional scope): <imperative description>
```

The description is present tense, imperative, and under 72 characters. Types used here include `feat`, `fix`, `docs`, `refactor`, `test`, and `chore`.
4. Show the message and the file list. Commit only after the user says yes. Then push only if this moment of the workflow says to push.

```bash
git commit -m "$(cat <<'EOF'
<type>: <description>

EOF
)"
```

Do not change git config. Do not force-push. Do not skip hooks. If a hook rejects the commit, fix the problem and make a new commit. Do not amend.

**Nota de este repositorio.** Si esta nota choca con los pasos de arriba, manda la nota. Un commit es un trozo pequeño. El mensaje va en inglés. Antes de hacer el commit, se enseña el mensaje y los ficheros y se espera el sí. El camino completo está en `docs/GIT-WORKFLOW.md`.

## github-issues

---

name: github-issues
description: >-
  Draft and create a GitHub issue for one task. Use when the user wants to
  write a task down, create an issue, or says "crear una issue".

---

# GitHub issues

The user explains the task. Draft the issue. Do not create it until they say yes.

Show these four things:

- Title, in English, specific, under 72 characters.
- Author: the logged-in user.
- Assignee: the same user.
- Body, in English, with only these two parts:

```markdown
## What to do

## How to test
```

`How to test` is the steps a classmate follows on their own computer.

After yes, create it with `gh` on that user's account. The login comes from `gh api user --jq .login`.

```bash
gh api repos/{owner}/{repo}/issues \
  -X POST \
  -f title="Title under 72 characters" \
  -f type="Task" \
  -f body="$(cat <<'EOF'
## What to do

## How to test

EOF
)" \
  -f assignees[]="$(gh api user --jq .login)"
```

If the API rejects `type=Task`, create the issue again without a type and continue. No labels, no milestone, no project. This skill does not close the issue. GitHub closes it when a pull request with `Closes #<number>` is merged.

**Nota de este repositorio.** Si esta nota choca con los pasos de arriba, manda la nota. La alumna explica la tarea y el agente redacta. Se enseña título, autor, persona asignada y cuerpo, y se espera el sí. El alta va con `gh` y su cuenta. Para esta app, «how to test» es pegar el ejemplo de `clients/terminal/` desde `first-app`. No hay script de tests. El camino completo está en `docs/GIT-WORKFLOW.md`.

## create-github-pull-request-from-specification

---

name: create-github-pull-request-from-specification
description: >-
  Open or update a draft pull request into staging from the pull request
  template. Use when the user asks to create a pull request, open a PR, or
  says "crear una PR".

---

# Create the pull request

1. Read `.github/pull_request_template.md`.
2. Check whether the current branch already has a pull request. If it does, update that one. Do not open a second one.
3. Fill the template. The title is the issue title, in English. The body includes `Closes #<number>`. The base is `staging`. The assignee is the logged-in user, from `gh api user --jq .login`.
4. Show the title, the branch, the base, the `Closes` line, and the assignee. Wait for yes.
5. After yes, create it as a draft, or edit the one that already exists. Reply with the URL.

```bash
gh pr create --draft --base staging \
  --title "Issue title" \
  --assignee "$(gh api user --jq .login)" \
  --body "$(cat <<'EOF'
## What changed

## How to test

## Issue

Closes #
EOF
)"
```

To update an existing pull request, use `gh pr edit`. Do not mark the pull request ready in this skill. Ready for review is a later moment.

**Nota de este repositorio.** Si esta nota choca con los pasos de arriba, manda la nota. La pull request nace en draft hacia `staging`. El título es el de la issue. El cuerpo sale de la plantilla e incluye `Closes #<número>`. Pasarla a lista es el momento de pedir revisión, no este. El camino completo está en `docs/GIT-WORKFLOW.md`.

## grill-me

---

name: grill-me
description: >-
  Interview the user to sharpen a task before any issue exists. Use only
  when the user asks for grill-me.

---

# Grill me

Run the `grilling` skill.

Do this only when the user asks. The interview sharpens the task before the issue. During the interview, do not create the issue, the branch, or the pull request. Ask in the user's language. The issue they ask for afterwards is in English.

**Nota de este repositorio.** Si esta nota choca con los pasos de arriba, manda la nota. La alumna tiene que pedirla. La entrevista no abre issue, rama ni pull request. Las preguntas van en su idioma. La issue posterior va en inglés, como dice `docs/GIT-WORKFLOW.md`.

## grilling

---

name: grilling
description: >-
  Interview in rounds until a plan is shared. Use when grill-me calls this
  skill, or when the user asks to grill an idea.

---

# Grilling

Interview until you and the user share the same understanding. Treat the plan as a tree. A round asks every question whose answers you can use now, without guessing at something still open.

Number each question. Give your recommended answer. Word the question so that "yes" accepts that answer. Then wait.

```
Q1. <question>

Recommended: <answer>

Q2. <question>

Recommended: <answer>
```

Look up facts yourself. Do not ask the user for something you can check in the repo or with a tool. A question that depends on an answer you do not have yet belongs in a later round.

Stop when nothing important is still assumed. Do not create the issue, the branch, or the pull request until the user says the understanding is shared.

**Nota de este repositorio.** Si esta nota choca con los pasos de arriba, manda la nota. Esta skill solo entrevista. No escribe la issue. La llama `grill-me`, y solo cuando la alumna lo pide. El camino completo está en `docs/GIT-WORKFLOW.md`.
