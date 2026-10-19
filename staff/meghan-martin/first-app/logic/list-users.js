import { findAll } from "../queries/users.js";
import { toUser } from "./user-fields.js";

export function listUsers() {
  let users;
  try {
    users = findAll();
  } catch {
    throw new Error("Could not list the users");
  }
  return users.map(toUser);
}
