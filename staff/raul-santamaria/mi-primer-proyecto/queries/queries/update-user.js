import { openDatabase, closeDatabase } from "../../db/connection.js";
import { createUsersTable } from "./create-users-table.js";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function toUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function update(input) {
  const db = openDatabase();

  try {
    createUsersTable(db);

    const updatedAt = today();

    db.prepare(
      `UPDATE users
       SET name = ?, email = ?, updated_at = ?
       WHERE id = ?`,
    ).run(input.name, input.email, updatedAt, input.id);

    const row = db
      .prepare(
        `SELECT id, name, email, created_at, updated_at
         FROM users
         WHERE id = ?`,
      )
      .get(input.id);

    return toUser(row);
  } finally {
    closeDatabase(db);
  }
}
