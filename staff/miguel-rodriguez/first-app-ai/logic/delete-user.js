import { findById, remove } from "../queries/users.js";

export function deleteUser(id) {
  let user;
  try {
    user = findById(id);
  } catch {
    throw new Error("Could not delete the user");
  }

  if (!user) {
    throw new Error("User not found");
  }

  try {
    remove(id);
  } catch {
    throw new Error("Could not delete the user");
  }
}
