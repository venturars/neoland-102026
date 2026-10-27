import { findByEmail, findById, update } from "../queries/users.js";

export function updateUser(input) {
  const id = Number(input.id);
  if (!Number.isInteger(id) || id <= 0) {
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

  const name = input.name === undefined ? current.name : input.name.trim();
  if (name === "") {
    throw new Error("Name is empty");
  }

  const email =
    input.email === undefined
      ? current.email
      : input.email.trim().toLowerCase();
  const parts = email.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

  if (!hasSingleAt || email.length > 64) {
    throw new Error("Email is invalid");
  }

  if (email !== current.email) {
    let owner;
    try {
      owner = findByEmail(email);
    } catch {
      throw new Error("Could not update the user");
    }

    if (owner) {
      throw new Error("Email is already used");
    }
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
