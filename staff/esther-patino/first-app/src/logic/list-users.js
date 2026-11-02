import { findAll } from "../queries/users.js";
import { toUser } from "./shared.js";

export { findAll };

export function listUsers() {
  const users = findAll();
  return users.map(toUser);
}
