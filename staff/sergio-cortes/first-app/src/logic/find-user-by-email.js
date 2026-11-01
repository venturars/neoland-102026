import { DatabaseError, NotFoundError, ValidationError } from "./errors.js";
import { findByEmail } from "../queries/user.js";

export function findUserByEmail(email) {
  let emailIsInvalid = false;

  if (typeof email !== "string") {
    emailIsInvalid = true;
  }

  if (typeof email === "string") {
    const hasSpace = email.includes(" ");

    if (hasSpace) {
      emailIsInvalid = true;
    }
  }

  if (emailIsInvalid) {
    throw new ValidationError("Email is invalid");
  }

  const atIndex = email.indexOf("@");
  const lastAtIndex = email.lastIndexOf("@");

  let atSignIsInvalid = false;

  if (atIndex <= 0) {
    atSignIsInvalid = true;
  }

  if (atIndex !== lastAtIndex) {
    atSignIsInvalid = true;
  }

  if (atSignIsInvalid) {
    throw new ValidationError("Email is invalid");
  }

  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.lastIndexOf(".");

  let domainDotIsInvalid = false;

  if (dotIndex <= 0) {
    domainDotIsInvalid = true;
  }

  if (dotIndex === domain.length - 1) {
    domainDotIsInvalid = true;
  }

  if (domainDotIsInvalid) {
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
