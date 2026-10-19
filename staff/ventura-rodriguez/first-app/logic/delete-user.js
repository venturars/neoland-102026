import { findById, remove } from "../queries/users.js";

export function deleteUser(id) {
  let current;
  try {
    current = findById(id);
  } catch {
    throw new Error("Could not delete the user");
  }

  if (!current) {
    throw new Error("User not found");
  }

  try {
    remove(id);
  } catch {
    throw new Error("Could not delete the user");
  }
}
