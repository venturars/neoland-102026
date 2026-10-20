# Specs

One folder per feature. The structure of `spec.md`, `plan.md` and `tasks.md` is defined in [docs/CONSTITUTION.md](../docs/CONSTITUTION.md) section 10.

| Folder                                          | Prefix | Tests                                      |
| ----------------------------------------------- | ------ | ------------------------------------------ |
| [create-user](create-user/)                     | `CU`   | `test/logic/create-user.test.js`           |
| [get-user](get-user/)                           | `GU`   | `test/logic/get-user.test.js`              |
| [get-user-by-email](get-user-by-email/)         | `GE`   | `test/logic/get-user-by-email.test.js`     |
| [list-users](list-users/)                       | `LU`   | `test/logic/list-users.test.js`            |
| [update-user](update-user/)                     | `UU`   | `test/logic/update-user.test.js`           |
| [delete-user](delete-user/)                     | `DU`   | `test/logic/delete-user.test.js`           |
| [count-users-by-gender](count-users-by-gender/) | `CG`   | `test/logic/count-users-by-gender.test.js` |
| [database-errors](database-errors/)             | `SQ`   | `test/query/safe.test.js`                  |
