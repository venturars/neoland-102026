# Adapt the git workflow

Issue: #607.

Whoever works in this app follows the git workflow of the course: think
the task through, write it down, start it, save a piece of work and ask
for a review.

It is used by the person who builds the app with AI. Only that person
has access, signed in to GitHub with write access to the repository.

The input is a task of this app. The output is the task written down,
with the title in English and the body in Spanish. When the work starts,
the branch comes from staging. When a piece is saved, only that piece
goes in. The pull request says which task it closes. When a review is
asked, the person names the reviewers and the pull request stops being a
draft.

Example: a change is asked. It is written down what has to be done and
how to test it. The new branch comes from staging. The piece asked for
is saved. The pull request says that it closes that task. A review is
asked naming 2 people. The pull request leaves draft. The task stays
open until the pull request reaches the default branch of the
repository. Merging into staging does not close it.

Even if the git workflow does not stop, this app has stops. Nothing is
written for a feature before its task is written down. The first stop
is after the spec and the plan: a person reviews them. The second stop
is when the tasks are written. The work is built only when a person
asks.

There is no failure from the "Errors" list. If the branch does not come
from staging, if the pull request does not say which task it closes, if
a review is asked without naming reviewers, or if a spec is written
before its task exists, the workflow is not adapted.

Out of scope: changing the business rules, the database, the clients,
the packages and the specs already written.
