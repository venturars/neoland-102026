import { findByName } from "../queries/users.js";
import { copyUser, validateName } from "./shared.js";

export async function findUserByName(name) {
  const limpio = validateName(name);

  let filas;
  try {
    filas = await findByName(limpio);
  } catch {
    throw new Error("Could not find the user");
  }

  return filas.map(copyUser);
}
