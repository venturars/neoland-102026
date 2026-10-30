# Tasks: align the code with the guides

Issue: #536.

1. Save the output before the change.
   Copy `db/users.sqlite` to a folder outside the repo. That copy is the snapshot, and no run writes to it.
   The script from "Check" in `plan.md` runs every action on a fresh copy of the snapshot (good inputs, one bad input per error sentence, inputs with two problems) and saves what each one prints or throws, including a `TypeError`.
   No file of the app is changed yet.

2. Open `logic/find-user-by-email.js`.
   The email and the user check are as "Email" and "User not found" say.
   The signature `findUserByEmail({ email })`, `findByEmail` and `return user;` do not change.

3. Open `logic/find-user-by-id.js`.
   The user check is as "User not found" says.
   The signature `findUserById({ id })`, `findById` and `return user;` do not change.

4. Open `logic/delete-user.js`.
   The user check is as "User not found" says, with `currentUser`.
   The signature `deleteUser({ id })`, `findById` and `remove` do not change.

5. Open `logic/create-user.js`.
   The email and the used email are as "Create a user" says.
   The signature `createUser({ name, email })`, the name lines, `findByEmail` and `insert` do not change.

6. Open `logic/update-user.js`.
   Nothing to update, the user check and the email are as "Update a user" says.
   The signature `updateUser({ id, name, email })`, the order of the checks, the name lines and `update` do not change.

7. Open `logic/count-users-by-gender.js`.
   The changes are the ones in "Count users by gender".
   The signature `countUsersByGender()`, the helper `askGenders`, the request to the model and the batch of 6 do not change.

8. Open `queries/users.js`.
   The folder, the reads and the runs are as "Queries" says.
   The signatures and `createUsersTable` do not change.

9. Open `db/connection.js`.
   The text is the one in "Connection".
   It still exports `db` and still opens `users.sqlite`.

10. Open `clients/terminal/create-users-table.txt`.
    `prepare` and `all` are as "Table client" says.
    It still creates the table and still prints the names from `sqlite_master`.

11. Open `docs/CONSTITUTIONS.md`.
    The start of step 2 is as "Constitution" says.
    The rest of the constitution does not change.

12. Check.
    In `first-app`, `pnpm format` and `pnpm lint` finish with no errors.
    The script runs again on a fresh copy of the snapshot from task 1: the output is identical to the one of task 1, except the dates.
    The original `db/users.sqlite` is back in place, and the rest of `clients/` does not change.
