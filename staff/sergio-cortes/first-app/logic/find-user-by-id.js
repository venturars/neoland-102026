import { DatabaseError, NotFoundError, ValidationError } from "./errors.js";
import { findById } from "../queries/user.js";

export function findUserById(id) {
  if (typeof id !== "number") {
    throw new ValidationError("Id is invalid");
  }

  let user;

  try {
    user = findById(id);
  } catch (error) {
    throw new DatabaseError("Could not find the user");
  }

  if (user === undefined) {
    throw new NotFoundError("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
