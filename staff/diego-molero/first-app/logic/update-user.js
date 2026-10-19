import { isUserInput, isValidId, validateUser } from "./validate-user.js";

// Una actualización parcial conserva los campos que no se han enviado.
export function updateUser(userRepository, id, changes) {
  if (!isValidId(id)) {
    return { ok: false, error: "INVALID_ID" };
  }

  if (!isUserInput(changes)) {
    return { ok: false, error: "INVALID_INPUT" };
  }

  if (changes.name === undefined && changes.email === undefined) {
    return { ok: false, error: "EMPTY_CHANGES" };
  }

  const current = userRepository.findById(id);
  if (!current) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }

  const validation = validateUser({
    name: changes.name === undefined ? current.name : changes.name,
    email: changes.email === undefined ? current.email : changes.email,
  });
  if (!validation.ok) {
    return validation;
  }

  const owner = userRepository.findByEmail(validation.data.email);
  if (owner && owner.id !== id) {
    return { ok: false, error: "EMAIL_ALREADY_USED" };
  }

  try {
    const user = userRepository.update({ id, ...validation.data });
    if (!user) {
      return { ok: false, error: "USER_NOT_FOUND" };
    }
    return { ok: true, user };
  } catch (error) {
    if (error.code === "EMAIL_ALREADY_USED") {
      return { ok: false, error: "EMAIL_ALREADY_USED" };
    }
    throw error;
  }
}
