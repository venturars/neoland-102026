import { validateEmail } from "./validate-user.js";

// Busca por el correo normalizado y devuelve solo los campos públicos del usuario.
export function findUserByEmail(userRepository, email) {
  const validation = validateEmail(email);
  if (!validation.ok) {
    return validation;
  }

  const user = userRepository.findByEmail(validation.email);
  if (!user) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}
