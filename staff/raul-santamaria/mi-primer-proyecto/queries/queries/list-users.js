import { openDatabase, closeDatabase } from "../../db/connection.js";
import { createUsersTable } from "./create-users-table.js";

function toUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function list() {
  const db = openDatabase();

  try {
    createUsersTable(db);

    const rows = db
      .prepare(
        `SELECT id, name, email, created_at, updated_at
         FROM users
         ORDER BY id`,
      )
      .all();

    const result = [];

    for (const row of rows) {
      result.push(toUser(row));
    }

    return result;
  } finally {
    closeDatabase(db);
  }
}
