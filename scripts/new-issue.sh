#!/usr/bin/env bash
# Crea una issue en el repo de este directorio.
# La primera línea de stdin es el título. El resto es el cuerpo.
# Con --dry-run no llama al alta: imprime la persona asignada y el título.

set -euo pipefail

dry_run=0
if [[ "${1:-}" == "--dry-run" ]]; then
  dry_run=1
elif [[ -n "${1:-}" ]]; then
  echo "Uso: scripts/new-issue.sh [--dry-run]" >&2
  echo "La primera línea de stdin es el título. El resto es el cuerpo." >&2
  exit 1
fi

input=$(cat)
if [[ "$input" != *$'\n'* ]]; then
  echo "Faltan el título y el cuerpo. La primera línea es el título y el resto es el cuerpo." >&2
  exit 1
fi

title=${input%%$'\n'*}
body=${input#*$'\n'}

if [[ -z "$title" ]]; then
  echo "Falta el título." >&2
  exit 1
fi

if ((${#title} >= 72)); then
  echo "El título tiene ${#title} caracteres. El máximo es 71." >&2
  exit 1
fi

if [[ "$body" != *"## Qué hay que hacer"* || "$body" != *"## Cómo probarlo"* ]]; then
  echo "El cuerpo tiene que incluir «## Qué hay que hacer» y «## Cómo probarlo»." >&2
  exit 1
fi

login=$(gh api user --jq .login)

if ((dry_run)); then
  printf 'Persona asignada: %s\n' "$login"
  printf 'Título: %s\n' "$title"
  exit 0
fi

body_file=$(mktemp)
trap 'rm -f "$body_file"' EXIT
printf '%s' "$body" >"$body_file"

gh api "repos/{owner}/{repo}/issues" \
  --method POST \
  -f "title=${title}" \
  -F "body=@${body_file}" \
  -f "assignees[]=${login}" \
  --jq '"Persona asignada: \(.assignee.login // .assignees[0].login)\nNúmero: \(.number)\nTítulo: \(.title)\nURL: \(.html_url)"'
