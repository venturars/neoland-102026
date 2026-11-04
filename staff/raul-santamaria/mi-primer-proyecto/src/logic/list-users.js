import { list } from "../queries/users.js";

export async function listUsers() {
  try {
    return await list();
  } catch {
    throw new Error("Could not list the users");
  }
}
