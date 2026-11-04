# Errors

A failure is thrown with one of the classes in `logic/errors.js`. Each class has a `code`, the message is always one from this list, in English, and `details` says what failed.

Steps 1 and 2, when the input or a business rule fails:

| Message                 | Class             | `code`       | `details`                                                   |
| ----------------------- | ----------------- | ------------ | ----------------------------------------------------------- |
| `Name is empty`         | `ValidationError` | `VALIDATION` | `{ field: "name" }`                                         |
| `Email is invalid`      | `ValidationError` | `VALIDATION` | `{ field: "email" }`                                        |
| `Email is already used` | `DuplicateError`  | `DUPLICATE`  | `{ field: "email", value }`                                 |
| `User not found`        | `NotFoundError`   | `NOT_FOUND`  | `{ resource: "user", id }` or `{ resource: "user", email }` |

If SQLite or the AI fails, in any step, that error does not leave `logic/`. One of these is thrown instead, as a `SystemError` (`code` `SYSTEM`, `details` `{}`), with the original error as `cause`:

- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not find the user`
- `Could not classify the users`

An error thrown in steps 1 and 2 passes through unchanged.

Step 4: if everything works, the function returns the shaped data. If the operation has no data, it returns nothing.

A new message is added to this list before any spec uses it.

This list is for `logic/`. A client throws nothing and prints the message `logic/` threw. The only messages of a client's own are:

- `Cannot find first-app.`, printed by a Jupyter notebook that does not find the app folder.
- `Python 3 is required to start Jupyter.`, printed by `scripts/jupyter.sh` when there is no Python 3.
- `Python 3 is required to start the web client.`, printed by `scripts/web.sh` when there is no Python 3.
- `This browser cannot open the database. Use Chrome or Edge.`, shown by the web client in a browser without the File System Access API.
- `Access to users.sqlite was denied.`, shown by the web client when the browser refuses permission to the file.
- `Could not read users.sqlite.` and `Could not save users.sqlite.`, shown by the web client when reading or writing the file fails.

## In code

When writing code:

- **Throw only the classes in `logic/errors.js`.** Never throw strings or plain `Error`. Never signal a failure by returning `null`, `false` or an error object.
- **Always fill `details`** with the shape the table above gives, e.g. `new NotFoundError("User not found", { resource: "user", id })`.
- **Validation stops at the first failing field** and names it in `details.field`.
- **One `try/catch` per `logic/` function**, around the calls to `queries/users.js` (and the AI). In the `catch`: rethrow an `AppError` as it is; turn anything else into that feature's `SystemError("Could not …", {}, { cause: error })`.
- **Never swallow** errors (`catch {}`) and never log and rethrow.
- `queries/users.js` and `db/` never catch errors.
