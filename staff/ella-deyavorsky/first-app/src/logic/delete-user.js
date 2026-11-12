import { findById, remove } from "../queries/users.js";

export async function deleteUser({ id }) {
  let currentUser;
  try {
    currentUser = await findById(id);
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
    await remove(currentUser.id);
  } catch {
    throw new Error("The database failed.");
  }
}
