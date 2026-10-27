import { findAll } from "../queries/users.js";

export function listUsers() {
  let users;
  try {
    users = findAll();
  } catch {
    throw new Error("Could not list the users");
  }

  const contacts = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
  return contacts;
}
