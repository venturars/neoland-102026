import { findAll } from "../queries/users.js";

export function listUsers() {
  let rows;
  try {
    rows = findAll();
  } catch {
    throw new Error("Could not list the users");
  }

  const people = rows.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  });
  return people;
}
