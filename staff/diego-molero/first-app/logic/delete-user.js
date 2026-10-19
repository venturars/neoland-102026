import { isValidId } from "./validate-user.js";

// La eliminación es definitiva; el repositorio indica si borró una fila.
export function deleteUser(userRepository, id) {
  if (!isValidId(id)) {
    return { ok: false, error: "INVALID_ID" };
  }

  if (!userRepository.remove(id)) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }

  return { ok: true };
}
