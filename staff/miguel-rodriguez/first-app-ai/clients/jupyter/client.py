"""Execute this app's Node client from a notebook without evaluating input as code."""

import json
import os
from pathlib import Path
import subprocess


def runNode(operation, *args):
    """Send the chosen operation and its arguments to this copy of first-app-ai."""
    app = Path(__file__).resolve().parents[2]
    package = app / "package.json"
    try:
        validApp = json.loads(package.read_text(encoding="utf-8")).get("name") == "first-app-ai"
    except (OSError, ValueError):
        validApp = False
    if not validApp or not (app / "db/connection.js").is_file() or not (app / "logic/list-users.js").is_file():
        print("No encuentro la app.")
        return

    environment = os.environ.copy()
    environment.pop("NO_COLOR", None)
    environment["FORCE_COLOR"] = "1"
    result = subprocess.run(
        ["node", "--disable-warning=ExperimentalWarning", str(app / "clients/jupyter/run-operation.js")],
        input=json.dumps({"operation": operation, "args": args}),
        encoding="utf-8",
        capture_output=True,
        cwd=app,
        env=environment,
    )
    print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="")
