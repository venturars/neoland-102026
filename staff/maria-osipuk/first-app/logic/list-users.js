import { createUsersTable, listUserRows } from "../queries/users.js";

export function listUsers() {
  createUsersTable();

  let rows;

  try {
    rows = listUserRows();
  } catch {
    throw new Error("Unable to list users");
  }

  const users = [];

  for (const row of rows) {
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
