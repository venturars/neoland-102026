# AGENTS.md — first-app

This is Miguel's original classroom user-management exercise, aligned with
Ventura's actual PR #139 at e50b7cd850c2a98ea0c477f6e7348ddbfa353531.
Read docs/CONSTITUTIONS.md for the current contracts. The separate crud-ssd
exercise is outside this project's scope and must not be changed.

Use Node ES modules, English names, kebab-case filenames, and named exports.
Keep one business operation per logic file. Logic imports concrete query
functions; it accepts no store argument. SQL is in queries/users.js, matching
the actual reference. Clients call logic and own output/connection cleanup.
Do not add a repository factory, application wrapper, CLI parser, custom error
classes, result wrappers, or dependencies without a concrete requested need.

Verify the terminal examples in a temporary project copy before reporting changes complete. Do not commit generated database files. Do not
create branches, commit, push, or open PRs without Miguel's instruction.
