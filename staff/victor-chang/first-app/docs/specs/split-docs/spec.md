# Split the docs by topic

## What

Each topic of the app's rules is read in its own document: the architecture, the tree, the database, the errors and the style. The constitution keeps what is common to every change and links to them. The agent instructions keep how to work and link to them too. The docs stay in English.

No rule changes: every rule written today is still written, once, in one place.

## Who

- Whoever builds the app with AI: opens only the guide the task needs.
- Whoever checks a plan: finds each rule in one place.

## Input

Today's constitution and agent instructions.

## Output

| Guide        | What it holds                                                                    |
| ------------ | -------------------------------------------------------------------------------- |
| Architecture | The responsibility of each layer and each file, and the rules of each client     |
| Tree         | The folders and files only                                                       |
| Database     | The one database, the `users` table and how the SQL is kept and run              |
| Errors       | The messages, classes, codes and `details`, and how code throws and catches them |
| Style        | Naming, how code is written, constants and formatting                            |
| Constitution | What SDD is, the runtime, the specs, Node packages and the shape of a logic file |
| Agent guide  | The rules, the commands, the Socket check steps and the workflow                 |

Example: whoever adds a feature that touches only the SQL reads the database guide, not the whole constitution.

## Failures

This change adds no message to **Errors** and changes no feature.

The work is not done if a rule of today is lost, if a rule is written in two guides, or if a link points to a section that no longer exists.

## Out of scope

- Changing any rule.
- Translating the docs.
- Rewriting the specs already done, which keep their links to the constitution of their time.
