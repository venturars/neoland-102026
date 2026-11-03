import { findUserById as findUserRowById } from "../queries/users.js";

export function findUserById(id) {
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

  let user;

  try {
    const numericId = Number(id);
    user = findUserRowById(numericId);
  } catch {
    throw new Error("Could not find the user");
  }

  if (!user) {
    throw new Error("User does not exist");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
