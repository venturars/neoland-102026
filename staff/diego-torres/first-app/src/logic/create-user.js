import { findByEmail, insert } from "../queries/users.js";
import { copyUser, validateNewUser } from "./shared.js";

export async function createUser(data) {
  const nuevo = validateNewUser(data);

  let existente;
  try {
    existente = await findByEmail(nuevo.email);
  } catch {
    throw new Error("Could not create the user");
  }

  if (existente) {
    throw new Error("Email is already used");
  }

  let fila;
  try {
    fila = await insert(nuevo);
  } catch {
    throw new Error("Could not create the user");
  }

  return copyUser(fila);
}
