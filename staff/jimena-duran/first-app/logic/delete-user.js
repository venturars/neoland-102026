import { findById, remove } from "../queries/users.js";

export function deleteUser(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("User ID is invalid");
  }

  let currentUser;

  try {
    currentUser = findById(id);
  } catch {
    throw new Error("Could not delete the user");
  }

  if (!currentUser) {
    throw new Error("User not found");
  }

  try {
    remove(id);
  } catch {
    throw new Error("Could not delete the user");
  }
}