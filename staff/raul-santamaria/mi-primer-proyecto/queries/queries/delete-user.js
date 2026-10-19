import { openDatabase, closeDatabase } from "../../db/connection.js";
import { createUsersTable } from "./create-users-table.js";

export function remove(id) {
  const db = openDatabase();

  try {
    createUsersTable(db);

    db.prepare(
      `DELETE FROM users
       WHERE id = ?`,
    ).run(id);
  } finally {
    closeDatabase(db);
  }
}
