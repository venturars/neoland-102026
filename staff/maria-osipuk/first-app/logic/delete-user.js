import {
  createUsersTable,
  deleteUserRow,
  findUserById,
} from "../queries/users.js";

export function deleteUser({ id }) {
  createUsersTable();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("User id must be a positive integer");
  }

  let user;

  try {
    user = findUserById(id);
  } catch {
    throw new Error("Unable to find user");
  }

  if (!user) {
    throw new Error("User does not exist");
  }

  try {
    deleteUserRow(id);
  } catch {
    throw new Error("Unable to delete user");
  }
}
