import { findById, remove } from "../queries/users.js";

export function deleteUser(input) {
  const id = Number(input.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("User id is not valid");
  }

  let current;
  try {
    current = findById(id);
  } catch {
    throw new Error("Could not delete the user");
  }

  if (!current) {
    throw new Error("No user exists with that id");
  }

  try {
    remove(id);
  } catch {
    throw new Error("Could not delete the user");
  }
}
