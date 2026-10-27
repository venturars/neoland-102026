import { DatabaseError, NotFoundError, ValidationError } from "./errors.js";
import { findByEmail } from "../queries/user.js";

export function findUserByEmail(email) {
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

  let user;

  try {
    user = findByEmail(email);
  } catch {
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
