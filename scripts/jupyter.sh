#!/usr/bin/env bash
# Arranca Jupyter de first-app.
# El arranque sigue en staff/esther-patino/first-app/scripts/jupyter.js.

set -euo pipefail

repo_root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
cd "$repo_root/staff/esther-patino/first-app"

exec node scripts/jupyter.js
