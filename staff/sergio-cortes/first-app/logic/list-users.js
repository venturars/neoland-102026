import { NotFoundError } from "./errors.js";
import { findAll } from "../queries/user.js";

export function listUsers() {
  let rows;

  try {
    rows = findAll();
  } catch (error) {
    throw new NotFoundError("Users are not found");
  }

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
