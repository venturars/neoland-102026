# Format and lint

Issue: #478.

Whoever finishes a task formats the code with Prettier and checks it
with ESLint.

It is used by the person who builds the app with AI.

The input is the JavaScript code of the app. The format command is
called `format`. The check command is called `lint`.

The output is the code in Prettier's standard format. That format is the
one the code has now: double quotes, semicolons, trailing commas,
2-space indentation and a width of 80. There is no custom format
config, as `docs/STYLE.md` says. ESLint reports code errors and the
syntax that stops the code from running.

Example: a task is finished. `format` leaves the JavaScript in the
standard format. `lint` runs. If there is a syntax error, ESLint shows
it. If there are no errors, it shows none.

There is no failure from the "Errors" list. If `format` does not run
Prettier, if `lint` does not run ESLint, or if the two are not run when
a task is finished, the work is not done.

Out of scope: changing the business rules, rewriting the old code to
leave one action per line, formatting the Python environment and giving
Prettier a custom config.
