import { NotFoundError, ValidationError } from "./errors.js";
import { findById } from "../queries/user.js";

export function findUserById(id) {
  if (typeof id !== "number") {
    throw new ValidationError("Id is invalid");
  }

  let user;

  try {
    user = findById(id);
  } catch (error) {
    throw new NotFoundError("User is not found");
  }

  if (user === undefined) {
    throw new NotFoundError("User is not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
