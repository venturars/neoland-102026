import { findByEmail, insert } from "../queries/users.js";

// Conserva la validación estricta y las respuestas propias al usar consultas directas.
export function createUser(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input) ||
      Object.keys(input).some((key) => key !== "name" && key !== "email")) {
    return { ok: false, error: "INVALID_INPUT" };
  }
  if (typeof input.name !== "string" || input.name.trim() === "") {
    return { ok: false, error: "INVALID_NAME" };
  }
  if (typeof input.email !== "string") {
    return { ok: false, error: "INVALID_EMAIL" };
  }
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (email.length > 64 || !/^[^\s@]+@[^\s@]+$/u.test(email)) {
    return { ok: false, error: "INVALID_EMAIL" };
  }
  if (findByEmail(email)) {
    return { ok: false, error: "EMAIL_ALREADY_USED" };
  }
  try {
    return { ok: true, user: insert({ name, email }) };
  } catch (error) {
    if (error.code === "EMAIL_ALREADY_USED") {
      return { ok: false, error: "EMAIL_ALREADY_USED" };
    }
    throw error;
  }
}
