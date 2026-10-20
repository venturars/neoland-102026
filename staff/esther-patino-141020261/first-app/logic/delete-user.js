import { createUsersTable, findById, removeUser } from "../queries/run-query.js";
import { parseId } from "./user-rules.js";

export { removeUser };

export function deleteUser(id) {
  const userId = parseId(id);

  createUsersTable();

  const current = findById(userId);
  if (!current) {
    throw new Error("User not found");
  }

  removeUser(userId);
}
