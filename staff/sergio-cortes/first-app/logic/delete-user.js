import { DatabaseError, NotFoundError, ValidationError } from "./errors.js";
import { findById, remove } from "../queries/user.js";

export function deleteUser(id) {
  if (typeof id !== "number") {
    throw new ValidationError("Id is invalid");
  }

  let user;

  try {
    user = findById(id);
  } catch (error) {
    throw new DatabaseError("Could not delete the user");
  }

  if (user === undefined) {
    throw new NotFoundError("User not found");
  }

  try {
    remove(id);
  } catch (error) {
    throw new DatabaseError("Could not delete the user");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
