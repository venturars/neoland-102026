import { findByEmail } from "../queries/users.js";

// Normaliza el correo antes de buscar y devuelve los campos públicos.
export function findUserByEmail(input) {
  if (typeof input !== "string") throw new Error("Email is invalid");
  const email = input.trim().toLowerCase();
  if (email.length > 64 || !/^[^\s@]+@[^\s@]+$/u.test(email)) {
    throw new Error("Email is invalid");
  }
  const user = findByEmail(email);
  if (!user) throw new Error("User not found");
  return {
    id: user.id, name: user.name, email: user.email,
    createdAt: user.createdAt, updatedAt: user.updatedAt,
  };
}
