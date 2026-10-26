import { findAll } from "../queries/users.js";
import { toUser } from "./shared.js";

export { findAll };

export function listUsers() {
  return findAll().map(toUser);
}
