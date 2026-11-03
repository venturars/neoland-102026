import { findByEmail, findById, update } from "../queries/users.js";
import { copyUser, validateChanges } from "./shared.js";

export async function updateUser(id, changes) {
  const cambios = validateChanges(changes);

  let actual;
  try {
    actual = await findById(id);
  } catch {
    throw new Error("Could not update the user");
  }

  if (!actual) {
    throw new Error("User not found");
  }

  const siguiente = { ...actual, ...cambios };

  if (siguiente.email !== actual.email) {
    let otro;
    try {
      otro = await findByEmail(siguiente.email);
    } catch {
      throw new Error("Could not update the user");
    }

    if (otro) {
      throw new Error("Email is already used");
    }
  }

  let fila;
  try {
    fila = await update({
      id: actual.id,
      name: siguiente.name,
      email: siguiente.email,
    });
  } catch {
    throw new Error("Could not update the user");
  }

  return copyUser(fila);
}
