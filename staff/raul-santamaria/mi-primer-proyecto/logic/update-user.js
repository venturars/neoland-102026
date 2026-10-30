import { findByEmail, findById, update } from "../queries/users.js";

export function updateUser(input) {
  const rawId = input.id;
  const id = Number(rawId);
  const idIsInteger = Number.isInteger(id);
  let idIsValid = false;
  if (idIsInteger) {
    if (id > 0) {
      idIsValid = true;
    }
  }
  if (!idIsValid) {
    throw new Error("User id is not valid");
  }

  let current;
  try {
    current = findById(id);
  } catch {
    throw new Error("Could not update the user");
  }

  if (!current) {
    throw new Error("No user exists with that id");
  }

  let name = current.name;
  if (input.name !== undefined) {
    const rawName = input.name;
    name = rawName.trim();
  }
  if (name === "") {
    throw new Error("Name is empty");
  }

  let email = current.email;
  if (input.email !== undefined) {
    const rawEmail = input.email;
    const trimmedEmail = rawEmail.trim();
    email = trimmedEmail.toLowerCase();
  }
  const parts = email.split("@");
  const hasTwoParts = parts.length === 2;
  let hasSingleAt = false;
  if (hasTwoParts) {
    const localPart = parts[0];
    const domainPart = parts[1];
    const hasLocalPart = localPart.length > 0;
    const hasDomainPart = domainPart.length > 0;
    if (hasLocalPart) {
      if (hasDomainPart) {
        hasSingleAt = true;
      }
    }
  }
  const emailIsTooLong = email.length > 64;
  if (!hasSingleAt) {
    throw new Error("Email is invalid");
  }
  if (emailIsTooLong) {
    throw new Error("Email is invalid");
  }

  let owner;
  try {
    owner = findByEmail(email);
  } catch {
    throw new Error("Could not update the user");
  }

  let emailUsedByAnother = false;
  if (owner) {
    const sameUser = owner.id === current.id;
    if (!sameUser) {
      emailUsedByAnother = true;
    }
  }
  if (emailUsedByAnother) {
    throw new Error("Email is already used");
  }

  let user;
  try {
    user = update({ id, name, email });
  } catch {
    throw new Error("Could not update the user");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
