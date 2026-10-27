import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "./errors.js";
import { findByEmail, findById, update } from "../queries/user.js";

export function updateUser(input) {
  const id = input.id;
  const name = input.name;
  const email = input.email;

  if (typeof id !== "number") {
    throw new ValidationError("Id is invalid");
  }

  if (typeof name !== "string" || name.trim() === "") {
    throw new ValidationError("Name is empty");
  }

  if (typeof email !== "string" || email.includes(" ")) {
    throw new ValidationError("Email is invalid");
  }

  const atIndex = email.indexOf("@");
  const lastAtIndex = email.lastIndexOf("@");

  if (atIndex <= 0 || atIndex !== lastAtIndex) {
    throw new ValidationError("Email is invalid");
  }

  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.lastIndexOf(".");

  if (dotIndex <= 0 || dotIndex === domain.length - 1) {
    throw new ValidationError("Email is invalid");
  }

  let current;

  try {
    current = findById(id);
  } catch {
    throw new DatabaseError("Could not update the user");
  }

  if (current === undefined) {
    throw new NotFoundError("User not found");
  }

  let owner;

  try {
    owner = findByEmail(email);
  } catch {
    throw new DatabaseError("Could not update the user");
  }

  if (owner !== undefined && owner.id !== id) {
    throw new ConflictError("Email is already used");
  }

  let user;

  try {
    user = update({ id, name, email });
  } catch {
    throw new DatabaseError("Could not update the user");
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
