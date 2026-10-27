import { list } from "../queries/users.js";

export function listUsers() {
  try {
    return list();
  } catch {
    throw new Error("Could not list the users");
  }
}
