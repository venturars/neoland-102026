import { findById } from "../queries/users.js";

// Find one user by id. The id is a separate parameter.
export function findUserById(id) {
  let user;
  try {
    user = findById(id);
  } catch {
    throw new Error("DATABASE_ERROR");
  }

  if (user === undefined || user === null) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}
