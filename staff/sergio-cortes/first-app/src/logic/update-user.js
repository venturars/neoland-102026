import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "./errors.js";
import { findByEmail, findById, update } from "../queries/user.js";

export async function updateUser(input) {
  const id = input.id;
  const incomingName = input.name;
  const incomingEmail = input.email;

  if (typeof id !== "number") {
    throw new ValidationError("Id is invalid");
  }

  if (incomingName !== undefined) {
    let nameIsEmpty = false;

    if (typeof incomingName !== "string") {
      nameIsEmpty = true;
    }

    if (typeof incomingName === "string") {
      const trimmedName = incomingName.trim();

      if (trimmedName === "") {
        nameIsEmpty = true;
      }
    }

    if (nameIsEmpty) {
      throw new ValidationError("Name is empty");
    }
  }

  if (incomingEmail !== undefined) {
    let emailIsInvalid = false;

    if (typeof incomingEmail !== "string") {
      emailIsInvalid = true;
    }

    if (typeof incomingEmail === "string") {
      const hasSpace = incomingEmail.includes(" ");

      if (hasSpace) {
        emailIsInvalid = true;
      }
    }

    if (emailIsInvalid) {
      throw new ValidationError("Email is invalid");
    }

    const atIndex = incomingEmail.indexOf("@");
    const lastAtIndex = incomingEmail.lastIndexOf("@");

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

    const domain = incomingEmail.slice(atIndex + 1);
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
  }

  let current;

  try {
    current = await findById(id);
  } catch {
    throw new DatabaseError("Could not update the user");
  }

  if (current === undefined) {
    throw new NotFoundError("User not found");
  }

  let name = current.name;

  if (incomingName !== undefined) {
    name = incomingName;
  }

  let email = current.email;

  if (incomingEmail !== undefined) {
    email = incomingEmail;
  }

  let owner;

  try {
    owner = await findByEmail(email);
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
    user = await update({ id, name, email });
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
