import { findById } from "../queries/users.js";
import { copyUser } from "./shared.js";

export async function findUserById(id) {
  let fila;
  try {
    fila = await findById(id);
  } catch {
    throw new Error("Could not find the user");
  }

  if (!fila) {
    throw new Error("User not found");
  }

  return copyUser(fila);
}
