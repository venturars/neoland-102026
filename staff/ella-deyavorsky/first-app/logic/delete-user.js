import { findUserById, remove } from "../queries/user.js";

// Remove one existing user.
export function deleteUser(input) {
  const currentUser = findUserById(input.id);
  if (currentUser === undefined || currentUser === null) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }

  const user = remove({ id: currentUser.id });

  return { ok: true, user };
}
