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

export function findById(id) {
  const db = openDatabase();

  try {
    createUsersTable(db);

    const row = db
      .prepare(
        `SELECT id, name, email, created_at, updated_at
         FROM users
         WHERE id = ?`,
      )
      .get(id);

    if (!row) {
      return undefined;
    }

    return toUser(row);
  } finally {
    closeDatabase(db);
  }
}
