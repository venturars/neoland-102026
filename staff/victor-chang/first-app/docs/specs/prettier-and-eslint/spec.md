# Prettier and ESLint

## What

Whoever finishes a task formats the code with Prettier and checks it with ESLint, both installed with the app at an exact version. The formatting is the one used today: Prettier's default, with no config of its own. ESLint applies its recommended rules to the JavaScript of the app.

Each tool has its own command, run from the app: one formats every file, one checks the formatting without changing files, and one runs ESLint.

## Who

- Whoever builds the app with AI: runs the three commands before a task is done.
- Whoever reviews a change: runs the check and the lint and sees the same result.

## Input

The files of the app. The Python of the Jupyter client and the installed packages are not read.

## Output

- Format: every file is left in Prettier's default format (double quotes, semicolons, trailing commas, 2-space indentation, 80 columns). Today's files do not change.
- Check: it lists the files that are not formatted, or says that all of them are.
- Lint: it lists each problem with its file, line and rule, or prints nothing when there is none.

Example, after a task that left `const x = 1` unused in a `logic/` file:

```
logic/list-users.js
  4:9  error  'x' is assigned a value but never used  no-unused-vars
```

## Failures

This change adds no message to **Errors** and changes no feature.

The work is not done if the check or the lint fails on the code as it is after the change, or if a tool reads the Python of the Jupyter client or the installed packages.

## Out of scope

- A Prettier or ESLint config of its own beyond the recommended rules, extra plugins or extra rules.
- Running the tools on commit or in CI.
- Changing what any feature does.
