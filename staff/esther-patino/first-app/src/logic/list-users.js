import { findAll } from "../queries/users.js";
import { toUser } from "./shared.js";

export { findAll };

export async function listUsers() {
  const users = await findAll();
  return users.map(toUser);
}
