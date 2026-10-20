import { findById, remove } from "../queries/users.js";

// Remove one user. Returns nothing.
export function deleteUser(id) {
  let currentUser;
  try {
    currentUser = findById(id);
  } catch {
    throw new Error("DATABASE_ERROR");
  }

  if (currentUser === undefined || currentUser === null) {
    throw new Error("USER_NOT_FOUND");
  }

  try {
    remove(currentUser.id);
  } catch {
    throw new Error("DATABASE_ERROR");
  }
}
