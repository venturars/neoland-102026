import { DatabaseError, ValidationError } from "./errors.js";
import { findByName } from "../queries/user.js";

export function findUserByName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new ValidationError("Name is empty");
  }

  const trimmedName = name.trim();

  let users;

  try {
    users = findByName(trimmedName);
  } catch (error) {
    throw new DatabaseError("Could not find the user");
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
