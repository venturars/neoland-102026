import { findById, remove } from "../queries/users.js";

export function deleteUser(id) {
  if (typeof id !== "number") {
    throw new Error("Invalid id");
  }
  if (!Number.isInteger(id)) {
    throw new Error("Invalid id");
  }
  if (id < 1) {
    throw new Error("Invalid id");
  }

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
