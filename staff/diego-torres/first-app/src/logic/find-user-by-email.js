import { findByEmail } from "../queries/users.js";
import { copyUser, validateEmail } from "./shared.js";

export async function findUserByEmail(email) {
  const normalizado = validateEmail(email);

  let fila;
  try {
    fila = await findByEmail(normalizado);
  } catch {
    throw new Error("Could not find the user");
  }

  if (!fila) {
    throw new Error("User not found");
  }

  return copyUser(fila);
}
