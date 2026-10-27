#!/bin/sh

set -eu

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
cd "$script_dir/.."

exec .venv/bin/jupyter notebook clients/jupyter --ip=127.0.0.1 --port=8888
