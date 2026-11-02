import { deleteUserRow, findUserById } from "../queries/users.js";

export function deleteUser(id) {
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
    user = findUserById(id);
  } catch {
    throw new Error("Unable to find user");
  }

  // A missing row is a business rule, not a database failure.
  // The delete does not run when there is nobody to remove.
  if (!user) {
    throw new Error("User does not exist");
  }

  try {
    deleteUserRow(id);
  } catch {
    throw new Error("Unable to delete user");
  }

  // A successful delete removes the row and returns nothing.
  // The caller does not receive a stand-in object.
}
