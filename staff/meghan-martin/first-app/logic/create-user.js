import { findByEmail, insert } from "../queries/users.js";

export function createUser(input) {
  if (typeof input?.name !== "string" || input.name.includes("\0")) {
    throw new Error("Name is empty");
  }
  const name = input.name.trim();
  if (name === "") {
    throw new Error("Name is empty");
  }

  if (typeof input?.email !== "string") {
    throw new Error("Email is invalid");
  }
  const email = input.email.trim().toLowerCase();
  const parts = email.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
  if (!hasSingleAt || email.length > 64 || /\s/.test(email)) {
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
