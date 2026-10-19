import { findUserById, remove } from "../queries/user.js";

// Remove one user. Returns nothing.
export function deleteUser(id) {
  let currentUser;
  try {
    currentUser = findUserById(id);
  } catch {
    throw new Error("DATABASE_ERROR");
  }

  if (currentUser === undefined || currentUser === null) {
    throw new Error("USER_NOT_FOUND");
  }

  try {
    remove({ id: currentUser.id });
  } catch {
    throw new Error("DATABASE_ERROR");
  }
}
