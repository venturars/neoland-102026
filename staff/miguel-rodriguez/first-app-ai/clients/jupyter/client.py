"""Execute this app's Node client from a notebook without evaluating input as code."""

import json
import os
from pathlib import Path
import subprocess


def runNode(operation, *args):
    """Send the chosen operation and its arguments to this copy of first-app-ai."""
    modulePath = Path(__file__)
    resolvedPath = modulePath.resolve()
    parentDirectories = resolvedPath.parents
    app = parentDirectories[2]
    package = app / "package.json"
    try:
        packageText = package.read_text(encoding="utf-8")
        packageData = json.loads(packageText)
        packageName = packageData.get("name")
        validApp = packageName == "first-app-ai"
    except (OSError, ValueError):
        validApp = False
    appIsInvalid = not validApp
    if appIsInvalid:
        print("No encuentro la app.")
        return

    connectionPath = app / "db/connection.js"
    connectionExists = connectionPath.is_file()
    connectionIsMissing = not connectionExists
    if connectionIsMissing:
        print("No encuentro la app.")
        return

    listUsersPath = app / "logic/list-users.js"
    listUsersExists = listUsersPath.is_file()
    listUsersIsMissing = not listUsersExists
    if listUsersIsMissing:
        print("No encuentro la app.")
        return

    environment = os.environ.copy()
    environment.pop("NO_COLOR", None)
    environment["FORCE_COLOR"] = "1"
    runnerPath = app / "clients/jupyter/run-operation.js"
    runner = str(runnerPath)
    command = ["node", "--disable-warning=ExperimentalWarning", runner]
    request = {"operation": operation, "args": args}
    encodedRequest = json.dumps(request)
    result = subprocess.run(
        command,
        input=encodedRequest,
        encoding="utf-8",
        capture_output=True,
        cwd=app,
        env=environment,
    )
    output = result.stdout
    print(output, end="")
    errorOutput = result.stderr
    hasErrorOutput = bool(errorOutput)
    if hasErrorOutput:
        print(errorOutput, end="")
