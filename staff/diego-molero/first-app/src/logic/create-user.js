import { findByEmail, insert } from "../queries/users.js";

// Valida los datos antes de guardar el usuario.
export function createUser(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Input is invalid");
  }
  const keys = Object.keys(input);
  const hasUnknownField = keys.some((key) => key !== "name" && key !== "email");
  if (hasUnknownField) {
    throw new Error("Input is invalid");
  }
  const rawName = input.name;
  if (typeof rawName !== "string") {
    throw new Error("Name is invalid");
  }
  const name = rawName.trim();
  if (name === "") {
    throw new Error("Name is invalid");
  }
  const rawEmail = input.email;
  if (typeof rawEmail !== "string") {
    throw new Error("Email is invalid");
  }
  const trimmedEmail = rawEmail.trim();
  const email = trimmedEmail.toLowerCase();
  const hasValidEmail = /^[^\s@]+@[^\s@]+$/u.test(email);
  if (email.length > 64 || !hasValidEmail) {
    throw new Error("Email is invalid");
  }
  const existingUser = findByEmail(email);
  if (existingUser) {
    throw new Error("Email is already used");
  }
  return insert({ name, email });
}
