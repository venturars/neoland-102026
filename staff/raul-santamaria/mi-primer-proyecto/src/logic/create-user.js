import { findByEmail, insert } from "../queries/users.js";

export function createUser(input) {
  const name = input.name.trim();
  if (name === "") {
    throw new Error("Name is empty");
  }

  const email = input.email.trim().toLowerCase();
  const parts = email.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

  if (!hasSingleAt || email.length > 64) {
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
