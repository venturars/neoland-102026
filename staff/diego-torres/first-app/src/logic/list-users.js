import { findAll } from "../queries/users.js";
import { copyUser } from "./shared.js";

export async function listUsers() {
  let filas;
  try {
    filas = await findAll();
  } catch {
    throw new Error("Could not list the users");
  }

  return filas.map(copyUser);
}
