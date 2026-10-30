import { findById } from "../queries/users.js";

export function findUserById({ id }) {
  let user;
  try {
    user = findById(id);
  } catch {
    throw new Error("The database failed.");
  }

  let userIsMissing = false;
  if (user === undefined) {
    userIsMissing = true;
  }
  if (user === null) {
    userIsMissing = true;
  }
  if (userIsMissing) {
    throw new Error("No user was found.");
  }

  return user;
}
