import { findById } from "../queries/users.js";

export function findUserById({ id }) {
  let user;
  try {
    user = findById(id);
  } catch {
    throw new Error("The database failed.");
  }

  if (user === undefined || user === null) {
    throw new Error("No user was found.");
  }

  return user;
}
