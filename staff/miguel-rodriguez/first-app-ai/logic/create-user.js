import { findByEmail, insert } from "../queries/users.js";

export function createUser(input) {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Name is empty");
  }

  const email = input.email.trim().toLowerCase();
  const parts = email.split("@");
  if (email.length > 64 || parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("Email is invalid");
  }

  let existingUser;
  try {
    existingUser = findByEmail(email);
  } catch {
    throw new Error("Could not create the user");
  }

  if (existingUser) {
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
