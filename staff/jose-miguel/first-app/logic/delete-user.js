import { deleteUser as deleteUserRow, findUserById } from "../queries/users.js";

export function deleteUser(id) {
  if (id === undefined || id === null || String(id).trim() === "") {
    throw new Error("User does not exist");
  }

  let currentUser;

  try {
    currentUser = findUserById(Number(id));
  } catch {
    throw new Error("Could not delete the user");
  }

  if (!currentUser) {
    throw new Error("User does not exist");
  }

  try {
    deleteUserRow(currentUser.id);
  } catch {
    throw new Error("Could not delete the user");
  }
}
