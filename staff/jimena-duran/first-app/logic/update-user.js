import { findByEmail, findById, update } from "../queries/users.js";

export function updateUser(id, changes) {
  let current;
  try {
    current = findById(id);
  } catch {
    throw new Error("Could not update the user");
  }

  if (!current) {
    throw new Error("User not found");
  }

  let name = current.name;
  if (changes.name !== undefined) {
    const rawName = changes.name;
    name = rawName.trim();
  }
  if (name === "") {
    throw new Error("Name is empty");
  }

  let email = current.email;
  if (changes.email !== undefined) {
    const rawEmail = changes.email;
    const trimmedEmail = rawEmail.trim();
    email = trimmedEmail.toLowerCase();
  }
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
    throw new Error("Could not update the user");
  }

  if (owner) {
    if (owner.id !== current.id) {
      throw new Error("Email is already used");
    }
  }

  let user;
  try {
    user = update({ id: current.id, name, email });
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
