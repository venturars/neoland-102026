import { findAll } from "../queries/user.js";

export function listUsers(database) {
  return findAll(database);
}
