"""Call the existing Node functions from a Jupyter notebook.

The notebooks stay in Python. The business rules stay in logic/.
This file only starts Node and returns the value or the error message
that the function already uses. Node opens db/users.sqlite.
"""

import json
import logging
import os
import subprocess
import traceback
from html import escape
from pathlib import Path

from IPython.display import HTML, display

# clients/jupyter/run_logic.py -> first-app, where package.json and logic/ live.
APP_ROOT = Path(__file__).resolve().parents[2]

# The names below are the real exports. They are fixed here so a notebook
# cannot build its own Node program or its own SQL.
FUNCTIONS = {
    "createUser": "logic/create-user.js",
    "findUserByEmail": "logic/find-user-by-email.js",
    "findUserById": "logic/find-user-by-id.js",
    "updateUser": "logic/update-user.js",
    "deleteUser": "logic/delete-user.js",
    "listUsers": "logic/list-users.js",
    "countUsersByGender": "logic/count-users-by-gender.js",
    "createUsersTable": "queries/users.js",
}


class LogicError(Exception):
    """A message already thrown by logic/, such as an invalid email."""


# The English text is the message logic/ already throws.
# The Spanish sentence is the only text the notebook shows for that case.
# An unknown message is not translated word by word: the person sees
# the generic sentence, and the original text stays in the log file.
MESSAGES = {
    "User does not exist": "No se ha encontrado ese usuario.",
    "User id must be a positive integer": "El identificador debe ser un número entero mayor que cero.",
    "User name is required": "Introduce un nombre.",
    "User email is invalid": "Introduce un email válido.",
    "User email is already registered": "Ya existe un usuario con ese email.",
    "User changes must be an object": "Revisa los datos que quieres modificar.",
    "Unable to create user": "No se ha podido crear el usuario.",
    "Unable to update user": "No se ha podido actualizar el usuario.",
    "Unable to delete user": "No se ha podido borrar el usuario.",
    "Unable to list users": "No se ha podido obtener la lista de usuarios.",
    "Unable to find user": "No se ha podido realizar la búsqueda.",
    "Unable to classify names": "No se han podido clasificar los nombres. Comprueba Ollama y el modelo configurado.",
}

GENERIC_MESSAGE = "No se ha podido completar la operación."

# The project has no logger of its own. This file is the diagnostic
# record for the Jupyter client. It is not printed in the notebook cell.
# propagate is off so the message does not also reach the console.
LOG_FILE = Path(__file__).resolve().parent / "jupyter-client.log"
_logger = logging.getLogger("jupyter-client")
if not _logger.handlers:
    _logger.setLevel(logging.ERROR)
    _logger.propagate = False
    _handler = logging.FileHandler(LOG_FILE)
    _handler.setFormatter(logging.Formatter("%(asctime)s %(message)s"))
    _logger.addHandler(_handler)


def report_error(error):
    """Show one Spanish sentence for a failed notebook call.

    A known LogicError uses its sentence from MESSAGES.
    Anything else, including an unknown LogicError, uses the generic
    sentence and keeps the technical text in the log file.
    This function does not raise again, so Jupyter does not draw a traceback.
    """
    sentence = None

    if isinstance(error, LogicError):
        sentence = MESSAGES.get(str(error).strip())

    if sentence is None:
        _logger.error("%s\n%s", error, traceback.format_exc())
        sentence = GENERIC_MESSAGE

    display(HTML("<p>" + escape(sentence) + "</p>"))


def create_user(name, email):
    """Create one user and return the record logic/ already returns."""
    return _call("createUser", [name, email])


def find_user_by_email(email):
    """Find one user by email."""
    return _call("findUserByEmail", [email])


def find_user_by_id(user_id):
    """Find one user by id."""
    return _call("findUserById", [user_id])


def update_user(user_id, changes):
    """Update only the fields present in changes."""
    return _call("updateUser", [user_id, changes])


def delete_user(user_id):
    """Delete one user. logic/ returns nothing when the delete works."""
    return _call("deleteUser", [user_id])


def list_users():
    """Return the users stored in db/users.sqlite."""
    return _call("listUsers", [])


def count_users_by_gender():
    """Count stored names. This waits, because the function waits for Ollama."""
    return _call("countUsersByGender", [], wait_for_result=True)


def create_users_table():
    """Prepare the users table. This is setup, not a business action."""
    return _call("createUsersTable", [])


def show(value):
    """Render a function result as a table. This does not change the data."""
    if isinstance(value, list):
        display(HTML(_users_table(value)))
        return

    if isinstance(value, dict) and {"female", "male", "undefined"} <= set(value):
        display(HTML(_count_table(value)))
        return

    if isinstance(value, dict):
        display(HTML(_record_table(value)))
        return

    print(value)


def _call(function_name, arguments, wait_for_result=False):
    """Run one existing function in Node and read its JSON result.

    arguments travel as JSON. They are not pasted into the program text,
    so a name or an email cannot change the call itself.
    Node keeps its default database, db/users.sqlite.
    """
    if function_name not in FUNCTIONS:
        raise RuntimeError("That function is not part of the Jupyter client.")

    module_url = (APP_ROOT / FUNCTIONS[function_name]).as_uri()
    # countUsersByGender is async. The other functions return immediately.
    # The await stays in this bridge so the notebook does not reimplement it.
    wait_prefix = "await " if wait_for_result else ""
    script = "\n".join(
        [
            f'import {{ {function_name} }} from "{module_url}";',
            "const argumentsFromPython = JSON.parse(process.env.FIRST_APP_CALL_ARGUMENTS);",
            "try {",
            f"  const result = {wait_prefix}{function_name}(...argumentsFromPython);",
            "  if (result === undefined) {",
            '    console.log("RESULT null");',
            "  } else {",
            '    console.log("RESULT " + JSON.stringify(result));',
            "  }",
            "} catch (error) {",
            "  const message = error instanceof Error ? error.message : String(error);",
            '  console.log("ERROR " + message);',
            "  process.exitCode = 1;",
            "}",
        ]
    )

    environment = os.environ.copy()
    environment.pop("FIRST_APP_DATABASE_FILE", None)
    environment["FIRST_APP_CALL_ARGUMENTS"] = json.dumps(arguments)

    completed = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=APP_ROOT,
        env=environment,
        capture_output=True,
        text=True,
    )

    outcome = _read_outcome(completed.stdout)
    if outcome is None:
        detail = completed.stderr.strip() or completed.stdout.strip()
        raise RuntimeError(detail or "Node did not return a result.")

    kind, payload = outcome
    if kind == "ERROR" or completed.returncode != 0:
        raise LogicError(payload if kind == "ERROR" else (completed.stderr.strip() or payload))

    if payload == "null":
        return None

    return json.loads(payload)


def _read_outcome(stdout):
    """Use the last RESULT or ERROR line. Node may write other lines first."""
    found = None
    for line in stdout.splitlines():
        if line.startswith("RESULT "):
            found = ("RESULT", line[len("RESULT ") :])
        elif line.startswith("ERROR "):
            found = ("ERROR", line[len("ERROR ") :])
    return found


def _users_table(users):
    if len(users) == 0:
        return "<p>No hay usuarios.</p>"

    headers = [
        ("id", "Id"),
        ("name", "Nombre"),
        ("email", "Email"),
        ("createdAt", "Fecha de alta"),
        ("updatedAt", "Fecha de modificación"),
    ]
    head = "".join(f"<th>{escape(label)}</th>" for _, label in headers)
    body = []
    for user in users:
        cells = "".join(
            f"<td>{escape(str(user.get(key, '')))}</td>" for key, _ in headers
        )
        body.append(f"<tr>{cells}</tr>")
    return (
        "<table><thead><tr>"
        + head
        + "</tr></thead><tbody>"
        + "".join(body)
        + "</tbody></table>"
    )


def _record_table(record):
    labels = {
        "id": "Id",
        "name": "Nombre",
        "email": "Email",
        "createdAt": "Fecha de alta",
        "updatedAt": "Fecha de modificación",
    }
    rows = []
    for key, label in labels.items():
        if key in record:
            rows.append(
                f"<tr><th>{escape(label)}</th><td>{escape(str(record[key]))}</td></tr>"
            )
    return "<table><tbody>" + "".join(rows) + "</tbody></table>"


def _count_table(counts):
    labels = {
        "female": "female",
        "male": "male",
        "undefined": "undefined",
    }
    rows = []
    for key, label in labels.items():
        rows.append(
            f"<tr><th>{escape(label)}</th><td>{escape(str(counts[key]))}</td></tr>"
        )
    total = counts["female"] + counts["male"] + counts["undefined"]
    return (
        "<table><thead><tr><th>Categoría</th><th>Personas</th></tr></thead><tbody>"
        + "".join(rows)
        + "</tbody></table>"
        + f"<p>La suma de las tres categorías es {total}.</p>"
    )
