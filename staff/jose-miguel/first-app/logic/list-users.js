import { listUsers as listUserRows } from "../queries/users.js";

export function listUsers() {
  let rows;

  try {
    rows = listUserRows();
  } catch {
    throw new Error("Could not list the users");
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
