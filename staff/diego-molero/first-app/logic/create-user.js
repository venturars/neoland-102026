import { validateUser } from "./validate-user.js";

// El repositorio se recibe desde fuera: esta función no importa SQLite.
export function createUser(userRepository, input) {
  const validation = validateUser(input);
  if (!validation.ok) {
    return validation;
  }

  if (userRepository.findByEmail(validation.data.email)) {
    return { ok: false, error: "EMAIL_ALREADY_USED" };
  }

  try {
    const user = userRepository.insert(validation.data);
    return { ok: true, user };
  } catch (error) {
    // Otro proceso podría registrar ese correo después de la consulta.
    if (error.code === "EMAIL_ALREADY_USED") {
      return { ok: false, error: "EMAIL_ALREADY_USED" };
    }
    throw error;
  }
}
