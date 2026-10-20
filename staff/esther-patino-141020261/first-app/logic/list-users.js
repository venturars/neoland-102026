import { createUsersTable, findAll } from "../queries/run-query.js";
import { toUser } from "./user-rules.js";

export { createUsersTable, findAll };

export function listUsers() {
  createUsersTable();
  return findAll().map(toUser);
}
