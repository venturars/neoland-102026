import { findByEmail, insert } from "../queries/users.js";

export function createUser(input) {
  const rawName = input.name;
  const name = rawName.trim();
  if (name === "") {
    throw new Error("Name is empty");
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
    throw new Error("Could not create the user");
  }

  if (owner) {
    throw new Error("Email is already used");
  }

  let user;
  try {
    user = insert({ name, email });
  } catch {
    throw new Error("Could not create the user");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
