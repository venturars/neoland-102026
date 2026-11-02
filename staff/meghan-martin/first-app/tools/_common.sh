# Comprobaciones compartidas. Se carga desde los otros scripts de tools/.

enter_repo() {
  local root
  root=$(git rev-parse --show-toplevel 2>/dev/null) || {
    echo "Esto no es un repositorio git." >&2
    exit 1
  }
  cd "$root"
}

refuse_detached() {
  if [[ $(git rev-parse --abbrev-ref HEAD) == "HEAD" ]]; then
    echo "No estás en una rama. Paro." >&2
    exit 1
  fi
}

refuse_main_or_staging() {
  local what=$1
  local current
  current=$(git rev-parse --abbrev-ref HEAD)
  if [[ "$current" == "main" || "$current" == "staging" ]]; then
    echo "No hago ${what} en ${current}." >&2
    exit 1
  fi
}

refuse_merge_in_progress() {
  local git_dir
  git_dir=$(git rev-parse --absolute-git-dir)
  if [[ -f "${git_dir}/MERGE_HEAD" ]]; then
    echo "Hay un merge a medias. No creo otra rama." >&2
    exit 1
  fi
}

refuse_commit_hooks() {
  local hooks name hook
  hooks=$(git rev-parse --git-path hooks)
  for name in pre-commit prepare-commit-msg commit-msg; do
    hook="${hooks}/${name}"
    if [[ -f "$hook" && -x "$hook" ]]; then
      echo "El hook ${name} podría cambiar el commit. Paro." >&2
      exit 1
    fi
  done
}

validate_issue_number() {
  if [[ ! "$1" =~ ^[0-9]+$ ]]; then
    echo "El número de la issue son solo dígitos." >&2
    exit 1
  fi
}

validate_type() {
  case "$1" in
    feat|fix|docs|refactor|test|chore) ;;
    *)
      echo "El tipo es feat, fix, docs, refactor, test o chore." >&2
      exit 1
      ;;
  esac
}

validate_slug() {
  if [[ ! "$1" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "La descripción va en minúsculas, con guiones." >&2
    exit 1
  fi
}

switch_keep_ignored() {
  git switch --no-overwrite-ignore "$@"
}

drop_staging_upstream() {
  local upstream
  upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)
  if [[ "$upstream" == "origin/staging" || "$upstream" == "staging" ]]; then
    git branch --unset-upstream
  fi
}
