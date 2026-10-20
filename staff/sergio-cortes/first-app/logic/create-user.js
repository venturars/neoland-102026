import { ConflictError, DatabaseError, ValidationError } from "./errors.js";
import { findByEmail, insert } from "../queries/user.js";

export function createUser(input) {
  const name = input.name;
  const email = input.email;

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

  let owner;

  try {
    owner = findByEmail(email);
  } catch (error) {
    throw new DatabaseError("Could not create the user");
  }

  if (owner !== undefined) {
    throw new ConflictError("Email is already used");
  }

  let user;

  try {
    user = insert({ name, email });
  } catch (error) {
    throw new DatabaseError("Could not create the user");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
