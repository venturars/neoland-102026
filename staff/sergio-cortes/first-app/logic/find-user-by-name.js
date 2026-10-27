import { DatabaseError, ValidationError } from "./errors.js";
import { findByName } from "../queries/user.js";

export function findUserByName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new ValidationError("Name is empty");
  }

  const trimmedName = name.trim();

  let rows;

  try {
    rows = findByName(trimmedName);
  } catch {
    throw new DatabaseError("Could not find the user");
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
