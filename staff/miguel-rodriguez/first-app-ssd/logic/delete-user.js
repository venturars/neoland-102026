import { findById, deleteUserById } from "../queries/users.js";

export function deleteUser(id) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Id is invalid");

  let current;
  try {
    current = findById(id);
  } catch {
    throw new Error("Could not delete the user");
  }
  if (!current) throw new Error("User not found");

  let deleted;
  try {
    deleted = deleteUserById(id);
  } catch {
    throw new Error("Could not delete the user");
  }
  if (!deleted) throw new Error("User not found");
}
