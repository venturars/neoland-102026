import { createUsersTable as createUsersTableRow } from "../queries/users.js";

export function createUsersTable() {
  try {
    createUsersTableRow();
  } catch {
    throw new Error("Could not create the users table");
  }
}
