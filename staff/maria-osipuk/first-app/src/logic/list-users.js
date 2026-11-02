import { listUserRows } from "../queries/users.js";

export function listUsers() {
  // Ask the database for every user. If SQLite fails, do not return
  // its message: replace it with a clear error about this operation.
  let rows;

  try {
    rows = listUserRows();
  } catch {
    throw new Error("Unable to list users");
  }

  const users = [];

  for (const row of rows) {
    // Return only the fields the client needs, with camelCase names.
    // created_at stays inside the database column name until this mapping.
    users.push({
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  return users;
}
