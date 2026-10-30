import { findById, remove } from "../queries/users.js";

export function deleteUser({ id }) {
  let currentUser;
  try {
    currentUser = findById(id);
  } catch {
    throw new Error("The database failed.");
  }

  let userIsMissing = false;
  if (currentUser === undefined) {
    userIsMissing = true;
  }
  if (currentUser === null) {
    userIsMissing = true;
  }
  if (userIsMissing) {
    throw new Error("No user was found.");
  }

  try {
    remove(currentUser.id);
  } catch {
    throw new Error("The database failed.");
  }
}
