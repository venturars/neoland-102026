import { findByEmail, insert } from "../queries/users.js";

export function createUser(input) {
  if (typeof input?.name !== "string") {
    throw new Error("Name is empty");
  }
  if (input.name.includes("\0")) {
    throw new Error("Name is empty");
  }
  const rawName = input.name;
  const name = rawName.trim();
  if (name === "") {
    throw new Error("Name is empty");
  }

  if (typeof input?.email !== "string") {
    throw new Error("Email is invalid");
  }
  const rawEmail = input.email;
  const trimmedEmail = rawEmail.trim();
  const email = trimmedEmail.toLowerCase();
  const parts = email.split("@");
  const hasTwoParts = parts.length === 2;
  let hasSingleAt = false;
  if (hasTwoParts) {
    const localPart = parts[0];
    const domainPart = parts[1];
    const localPartIsFilled = localPart.length > 0;
    const domainPartIsFilled = domainPart.length > 0;
    if (localPartIsFilled) {
      if (domainPartIsFilled) {
        hasSingleAt = true;
      }
    }
  }
  const emailIsTooLong = email.length > 64;
  const emailHasSpace = /\s/.test(email);
  if (!hasSingleAt) {
    throw new Error("Email is invalid");
  }
  if (emailIsTooLong) {
    throw new Error("Email is invalid");
  }
  if (emailHasSpace) {
    throw new Error("Email is invalid");
  }

  let owner;
  try {
    owner = findByEmail(email);
  } catch {
    throw new Error("Could not create the user");
  }
  if (owner) {
    throw new Error("Email is already used");
  }

  let savedUser;
  try {
    savedUser = insert({ name, email });
  } catch {
    throw new Error("Could not create the user");
  }

  return {
    id: savedUser.id,
    name: savedUser.name,
    email: savedUser.email,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt,
  };
}
