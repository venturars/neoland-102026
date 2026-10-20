import { findAll } from "../queries/user.js";

export function listUsers() {
  const rows = findAll();
  const users = [];

  for (const user of rows) {
    users.push({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  return users;
}
