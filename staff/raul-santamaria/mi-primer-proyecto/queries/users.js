import { createUsersTable } from "./queries/create-users-table.js";
import { deleteUser } from "./queries/delete-user.js";
import { findUserById } from "./queries/find-user-by-id.js";
import { insertUser } from "./queries/insert-user.js";
import { listUsers } from "./queries/list-users.js";
import { updateUser } from "./queries/update-user.js";

export async function createSqliteUsers(db) {
  await createUsersTable(db);

  return {
    findById(id) {
      return findUserById(db, id);
    },

    list() {
      return listUsers(db);
    },

    async insert(user) {
      const result = await insertUser(db, user);
      return findUserById(db, result.id);
    },

    async update(id, user) {
      await updateUser(db, id, user);
      return findUserById(db, id);
    },

    remove(id) {
      return deleteUser(db, id);
    },
  };
}
