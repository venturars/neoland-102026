import { findByEmail, findById, update } from "../queries/users.js";

export function updateUser(id, changes) {
  if (typeof id !== "number" || !Number.isInteger(id) || id < 1) {
    throw new Error("Invalid id");
  }
  let current;
  try {
    current = findById(id);
  } catch {
    throw new Error("Could not update the user");
  }
  if (!current) {
    throw new Error("User not found");
  }
  const patch = changes ?? {};
  let name = current.name;
  if (patch.name !== undefined) {
    if (typeof patch.name !== "string" || patch.name.includes("\0")) {
      throw new Error("Name is empty");
    }
    name = patch.name.trim();
    if (name === "") {
      throw new Error("Name is empty");
    }
  }
  let email = current.email;
  if (patch.email !== undefined) {
    if (typeof patch.email !== "string") {
      throw new Error("Email is invalid");
    }
    email = patch.email.trim().toLowerCase();
    const parts = email.split("@");
    const hasSingleAt =
      parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
    if (!hasSingleAt || email.length > 64 || /\s/.test(email)) {
      throw new Error("Email is invalid");
    }
  }
  let owner;
  try {
    owner = findByEmail(email);
  } catch {
    throw new Error("Could not update the user");
  }
  if (owner && owner.id !== current.id) {
    throw new Error("Email is already used");
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
