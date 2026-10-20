import { findByEmail } from "../queries/users.js";

// Normaliza el correo antes de consultar y selecciona los cinco campos públicos.
export function findUserByEmail(input) {
  if (typeof input !== "string") return { ok: false, error: "INVALID_EMAIL" };
  const email = input.trim().toLowerCase();
  if (email.length > 64 || !/^[^\s@]+@[^\s@]+$/u.test(email)) {
    return { ok: false, error: "INVALID_EMAIL" };
  }
  const user = findByEmail(email);
  if (!user) return { ok: false, error: "USER_NOT_FOUND" };
  return {
    ok: true,
    user: { id: user.id, name: user.name, email: user.email,
      createdAt: user.createdAt, updatedAt: user.updatedAt },
  };
}
