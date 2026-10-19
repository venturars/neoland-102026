import { openDatabase, closeDatabase } from "../../db/connection.js";
import { createUsersTable } from "./create-users-table.js";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function insert(input) {
  const db = openDatabase();

  try {
    createUsersTable(db);

    const createdAt = today();
    const result = db
      .prepare(
        `INSERT INTO users (name, email, created_at, updated_at)
         VALUES (?, ?, ?, ?)`,
      )
      .run(input.name, input.email, createdAt, createdAt);

    return {
      id: Number(result.lastInsertRowid),
      name: input.name,
      email: input.email,
      createdAt,
      updatedAt: createdAt,
    };
  } finally {
    closeDatabase(db);
  }
}
