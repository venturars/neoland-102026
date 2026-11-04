# Jupyter script

## What

The Jupyter client opens with the same app command on macOS, Linux and Windows (Git Bash). Today it only works where Python lives in `.venv/bin`, so it fails on Windows.

The first run prepares the app's own Jupyter and opens the browser. The next runs reuse it and only open it. The notebook interface shows the notebooks of the app, as today. Lab is not opened and the Jupyter installed on the computer is not used.

The output of Node inside the notebooks is read as UTF-8 on every system, so accents and table borders show correctly on Windows too.

## Who

Whoever tests the app from the notebooks, without coding. They run one command from the app.

## Input

Nothing. The command is run from the app folder.

## Output

The browser opens the notebook interface on the list of notebooks of the app.

Example: one person runs the command in Git Bash on Windows and another in a macOS terminal. Both open `List users` and see the same table.

## Failures

- No Python 3 on the computer: the command prints `Python 3 is required to start Jupyter.` and ends with an error.
- Creating the Python environment or installing Jupyter fails: the command ends with that error and does not open the browser.

## Out of scope

- Changing the notebooks or what they show.
- PowerShell or `cmd` without Git Bash.
- Updating the Jupyter version.
