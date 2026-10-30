import { findUserById as findUserRowById } from "../queries/users.js";

export function findUserById(id) {
  // Check that id is a whole number greater than zero.
  // The client sends it as a JavaScript value, so a string like "1"
  // or a decimal like 1.5 must be rejected here, before any query runs.
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("User id must be a positive integer");
  }

  // Ask the database for that id. If SQLite fails, do not return
  // its message: replace it with a clear error about this operation.
  let user;

  try {
    user = findUserRowById(id);
  } catch {
    throw new Error("Unable to find user");
  }

  // A missing row is a business rule, not a database failure.
  if (!user) {
    throw new Error("User does not exist");
  }

  // Return only the fields the client needs, with camelCase names.
  // created_at stays inside the database column name until this mapping.
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
