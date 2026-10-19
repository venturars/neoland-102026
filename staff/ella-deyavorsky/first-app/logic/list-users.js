import { listUsers as readUsers } from "../queries/user.js";

// Return every saved user with the public fields only.
export function listUsers() {
  const users = readUsers();

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
