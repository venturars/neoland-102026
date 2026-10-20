import { deleteUserRow, findUserById } from "../queries/users.js";

export function deleteUser(input) {
  // The client must send one object. A missing object is rejected
  // here so the caller gets a business error, not a JavaScript TypeError.
  if (input === null || typeof input !== "object") {
    throw new Error("User id must be a positive integer");
  }

  // Check that id is a whole number greater than zero.
  // The client sends it as a JavaScript value, so a string like "1"
  // or a decimal like 1.5 must be rejected here, before any query runs.
  if (!Number.isInteger(input.id) || input.id <= 0) {
    throw new Error("User id must be a positive integer");
  }

  // Ask the database for that id. If SQLite fails, do not return
  // its message: replace it with a clear error about this operation.
  let user;

  try {
    user = findUserById(input.id);
  } catch {
    throw new Error("Unable to find user");
  }

  // A missing row is a business rule, not a database failure.
  if (!user) {
    throw new Error("User does not exist");
  }

  try {
    deleteUserRow(input.id);
  } catch {
    throw new Error("Unable to delete user");
  }
}
