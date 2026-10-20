import { findById, remove } from "../queries/users.js";

export function deleteUser({ id }) {
  let currentUser;
  try {
    currentUser = findById(id);
  } catch {
    throw new Error("The database failed.");
  }

  if (currentUser === undefined || currentUser === null) {
    throw new Error("No user was found.");
  }

  try {
    remove(currentUser.id);
  } catch {
    throw new Error("The database failed.");
  }
}
