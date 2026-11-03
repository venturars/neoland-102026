# Add typed templates

Issue: #766.

The issue and the pull request of the git workflow take their body from
a template of their type: `feat`, `fix`, `refactor`, `docs`, `chore` or
`test`.

It is used by the person who builds the app with AI. Only that person
has access, signed in to GitHub with write access to the repository.

The input is the type of the task. The output is the body of the issue
or of the pull request, in Spanish, filling the template of that type.
If the type has no template, the closest one is used. The "Issue"
section of the pull request is left empty when the draft is opened.

Example: a `docs` task is written down. The body fills
`templates/issues/docs_issue.md`. Later, the draft pull request fills
`templates/pull-request/docs-pull-request.md`, with the "Issue" section
empty.

There is no failure from the "Errors" list. If `basic_issue.md` or
`basic-pull-request.md` still exist or are named, or if the draft
pull request has the "Issue" section filled, the change is not done.

Out of scope: changing the business rules, the database, the clients,
the packages and the specs already written.
