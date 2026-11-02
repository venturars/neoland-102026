#!/usr/bin/env bash
# Prueba los scripts contra un repositorio git de usar y tirar.
# No toca el repositorio de la clase.

set -euo pipefail

tools=$(cd "$(dirname "$0")/.." && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

origin="${work}/origin.git"
repo="${work}/my repo"
remote_work="${work}/remote work"

fail() {
  echo "Fallo: $*" >&2
  exit 1
}

expect_fail() {
  if (cd "$repo" && "$@"); then
    fail "tenía que fallar: $*"
  fi
}

run() {
  (cd "$repo" && "$@")
}

git init --bare -b staging "$origin" >/dev/null
git init -b staging "$repo" >/dev/null
git -C "$repo" config user.name "Test"
git -C "$repo" config user.email "test@example.com"
git -C "$repo" remote add origin "$origin"

echo hello >"${repo}/readme.txt"
git -C "$repo" add readme.txt
git -C "$repo" commit -m "start" >/dev/null
git -C "$repo" branch main
git -C "$repo" push -u origin staging >/dev/null

out=$(run "$tools/check-status.sh")
printf '%s\n' "$out" | grep -q "Repositorio:" || fail "sin repositorio"
printf '%s\n' "$out" | grep -q "Rama:" || fail "sin rama"
printf '%s\n' "$out" | grep -q "Remoto:" || fail "sin remoto"

mkdir -p "${repo}/nested dir"
nested=$(cd "${repo}/nested dir" && "$tools/check-status.sh")
printf '%s\n' "$nested" | grep -q "Repositorio:" || fail "desde una subcarpeta no escribe el repositorio"

run "$tools/create-branch-from-staging.sh" 12 chore try-the-flow
[[ $(git -C "$repo" rev-parse --abbrev-ref HEAD) == "12-chore-try-the-flow" ]] || fail "nombre de rama"
if git -C "$repo" rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  fail "la rama nueva sigue a un remoto"
fi

echo staged >"${repo}/staged.txt"
git -C "$repo" add staged.txt
run "$tools/create-empty-commit.sh" 12
[[ $(git -C "$repo" log -1 --format=%s) == "chore: open #12" ]] || fail "mensaje del commit vacío"
git -C "$repo" diff --cached --name-only | grep -qx "staged.txt" || fail "el índice no conservó staged.txt"

echo loose >"${repo}/loose file.txt"
echo named >"${repo}/my file.txt"
echo other >"${repo}/other.txt"
git -C "$repo" add other.txt
run "$tools/commit-changes.sh" "add the named file" "my file.txt"
git -C "$repo" log -1 --name-only --format= -- "my file.txt" | grep -qx "my file.txt" || fail "no entró el fichero con espacio"
git -C "$repo" diff --cached --name-only | grep -qx "other.txt" || fail "other.txt tenía que seguir preparado"
[[ -f "${repo}/loose file.txt" ]] || fail "se perdió el fichero suelto"
git -C "$repo" ls-files --error-unmatch "loose file.txt" >/dev/null 2>&1 && fail "el suelto entró en git"

printf '#!/bin/sh\nexit 1\n' >"${repo}/.git/hooks/pre-commit.sample"
chmod +x "${repo}/.git/hooks/pre-commit.sample"
echo more >"${repo}/more.txt"
run "$tools/commit-changes.sh" "sample hook stays" more.txt

printf '#!/bin/sh\nexit 0\n' >"${repo}/.git/hooks/pre-commit"
chmod +x "${repo}/.git/hooks/pre-commit"
before=$(git -C "$repo" rev-parse HEAD)
echo blocked >"${repo}/blocked.txt"
expect_fail "$tools/commit-changes.sh" "should not land" blocked.txt
[[ $(git -C "$repo" rev-parse HEAD) == "$before" ]] || fail "el hook no paró el commit"
rm -f "${repo}/.git/hooks/pre-commit"

expect_fail "$tools/launch-push.sh" --force
expect_fail "$tools/commit-changes.sh" "no directory" .
expect_fail "$tools/commit-changes.sh" "no directory" "nested dir"

run "$tools/launch-push.sh"
[[ $(git -C "$repo" rev-parse --abbrev-ref --symbolic-full-name '@{u}') == "origin/12-chore-try-the-flow" ]] || fail "el upstream no es la rama"

git -C "$repo" switch staging >/dev/null
git -C "$repo" branch -D 12-chore-try-the-flow >/dev/null
run "$tools/create-branch-from-staging.sh" 12 chore try-the-flow
[[ $(git -C "$repo" rev-parse --abbrev-ref --symbolic-full-name '@{u}') == "origin/12-chore-try-the-flow" ]] || fail "no recuperó la rama remota"

echo tracked >"${repo}/notes.txt"
git -C "$repo" add notes.txt
git -C "$repo" commit -m "track notes" >/dev/null
git -C "$repo" switch staging >/dev/null
echo notes.txt >>"${repo}/.git/info/exclude"
echo mine >"${repo}/notes.txt"
expect_fail "$tools/create-branch-from-staging.sh" 12 chore try-the-flow
[[ $(cat "${repo}/notes.txt") == "mine" ]] || fail "se pisó el fichero ignorado"
[[ $(git -C "$repo" rev-parse --abbrev-ref HEAD) == "staging" ]] || fail "cambió de rama al pisar un ignorado"
rm -f "${repo}/notes.txt"
git -C "$repo" switch --no-overwrite-ignore 12-chore-try-the-flow >/dev/null

git clone "$origin" "$remote_work" >/dev/null
git -C "$remote_work" config user.name "Test"
git -C "$remote_work" config user.email "test@example.com"
echo next >>"${remote_work}/readme.txt"
git -C "$remote_work" add readme.txt
git -C "$remote_work" commit -m "advance staging" >/dev/null
git -C "$remote_work" push origin staging >/dev/null
here=$(git -C "$repo" rev-parse --abbrev-ref HEAD)
run "$tools/pull-changes.sh"
[[ $(git -C "$repo" rev-parse --abbrev-ref HEAD) == "$here" ]] || fail "pull cambió de rama"
[[ $(git -C "$repo" rev-parse staging) == $(git -C "$repo" rev-parse origin/staging) ]] || fail "staging no se adelantó"

git -C "$repo" switch staging >/dev/null
echo local-only >"${repo}/local.txt"
git -C "$repo" add local.txt
git -C "$repo" commit -m "diverge" >/dev/null
git -C "$repo" switch "$here" >/dev/null
expect_fail "$tools/pull-changes.sh"
[[ $(git -C "$repo" rev-parse --abbrev-ref HEAD) == "$here" ]] || fail "un pull rechazado cambió de rama"
git -C "$repo" branch -f staging origin/staging

git -C "$repo" switch -c left staging >/dev/null
echo a >"${repo}/conflict.txt"
git -C "$repo" add conflict.txt
git -C "$repo" commit -m "left" >/dev/null
git -C "$repo" switch -c right staging >/dev/null
echo b >"${repo}/conflict.txt"
git -C "$repo" add conflict.txt
git -C "$repo" commit -m "right" >/dev/null
git -C "$repo" switch left >/dev/null
git -C "$repo" merge right >/dev/null 2>&1 || true
[[ -f "${repo}/.git/MERGE_HEAD" ]] || fail "no hay merge a medias"
echo stay >"${repo}/keep-me.txt"
expect_fail "$tools/create-branch-from-staging.sh" 3 chore during-merge
[[ -f "${repo}/keep-me.txt" ]] || fail "se perdió un fichero suelto durante el merge"
[[ -f "${repo}/.git/MERGE_HEAD" ]] || fail "el script deshizo el merge"
git -C "$repo" merge --abort

git -C "$repo" switch staging >/dev/null
expect_fail "$tools/create-empty-commit.sh" 12
expect_fail "$tools/launch-push.sh"
expect_fail "$tools/commit-changes.sh" "nope" readme.txt
git -C "$repo" switch main >/dev/null
expect_fail "$tools/create-empty-commit.sh" 12
expect_fail "$tools/launch-push.sh"

echo "Pruebas de git en el repositorio de usar y tirar: bien."
