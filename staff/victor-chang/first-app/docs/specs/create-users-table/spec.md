# Create the users table

## What

Prepare the users table in the database as a step of its own, that whoever sets up the app can run and see. The app keeps creating the table on its own when it opens the database, so nothing breaks if this step is never run.

Running it again is safe: if the table exists, nothing changes and the saved users stay.

## Who

Whoever sets up the app or tests it from the notebooks.

## Input

Nothing.

## Output

No data. Afterwards the users table exists, with the saved users it already had.
Example: run it on a database with users 1 and 2 → users 1 and 2 are still listed. Run it on a database with no users table → the table exists and the list is empty.

## Failures

- The table cannot be created → the database's own error message. This step has no business rules, so no message from the error list applies.

## Out of scope

- Deleting or emptying the table.
- Changing the columns of the table.
- Stopping the app from creating the table on its own.
