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

  let nameIsEmpty = false;

  if (typeof name !== "string") {
    nameIsEmpty = true;
  }

  if (typeof name === "string") {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      nameIsEmpty = true;
    }
  }

  if (nameIsEmpty) {
    throw new ValidationError("Name is empty");
  }

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

  let emailUsedByAnother = false;

  if (owner !== undefined) {
    const sameUser = owner.id === id;

    if (!sameUser) {
      emailUsedByAnother = true;
    }
  }

  if (emailUsedByAnother) {
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
