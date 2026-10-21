import { createUsersTable, findAll } from "../queries/users.js";
import { toUser } from "./user-rules.js";

export { createUsersTable, findAll };

export function listUsers() {
  createUsersTable();
  return findAll().map(toUser);
}
