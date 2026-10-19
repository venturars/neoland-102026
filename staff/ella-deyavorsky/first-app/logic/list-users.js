import { listUsers as readUsers } from "../queries/user.js";

// Return every saved user with the public fields only.
export function listUsers() {
  let users;
  try {
    users = readUsers();
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
