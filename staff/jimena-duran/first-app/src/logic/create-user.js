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
  if (parts.length !== 2) {
    throw new Error("Email is invalid");
  }
  if (parts[0].length === 0) {
    throw new Error("Email is invalid");
  }
  if (parts[1].length === 0) {
    throw new Error("Email is invalid");
  }
  if (email.length > 64) {
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
