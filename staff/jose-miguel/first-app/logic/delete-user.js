import { deleteUser as deleteUserRow, findUserById } from "../queries/users.js";

export function deleteUser(id) {
  let idMissing = false;
  if (id === undefined) {
    idMissing = true;
  }
  if (id === null) {
    idMissing = true;
  }
  if (!idMissing) {
    const idAsText = String(id);
    const trimmedId = idAsText.trim();
    if (trimmedId === "") {
      idMissing = true;
    }
  }
  if (idMissing) {
    throw new Error("User does not exist");
  }

  let currentUser;

  try {
    const numericId = Number(id);
    currentUser = findUserById(numericId);
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
