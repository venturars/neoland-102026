# Business errors

All explicit business errors are ordinary `Error` objects with these exact messages:

| Message | Condition |
| --- | --- |
| `Name is empty` | Creation, update, or name lookup has an empty trimmed name. |
| `Email is invalid` | Creation, update, or email lookup fails the email checks. |
| `Email is already used` | Creation finds an existing email, or update finds another owner. |
| `User not found` | ID lookup, update, or delete cannot find the ID, or email lookup cannot find the valid email. |
| `Could not create the user` | A query called inside creation fails. |
| `Could not list the users` | The listing query fails. |
| `Could not update the user` | A query called inside updating fails. |
| `Could not delete the user` | A query called inside deletion fails. |
| `Could not find the user` | The email-lookup, ID-lookup, or name-lookup query fails. |
| `Could not classify the users` | Classifier database reading or an AI request fails. |

Business-condition errors stay outside query catch blocks. Query failures caught by logic are replaced by the operation's generic message. For valid inputs, an uninitialized table causes the corresponding generic query-failure error. Module-loading failures, such as an unreadable SQL file, occur before these business-function catch blocks.

The [constitution](CONSTITUTIONS.md#public-business-operations) defines each
operation's contract and validation order. Error messages are in English; there
are no custom error classes or result wrappers.

Jupyter's adapter and runner also display client messages. These describe client
setup or presentation; they are not additional business-operation errors.
