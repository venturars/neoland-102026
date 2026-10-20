import { findAll } from "../queries/users.js";

// Return every saved user with the public fields only.
export function listUsers() {
  let users;
  try {
    users = findAll();
  } catch {
    throw new Error("DATABASE_ERROR");
  }

  return users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
}
