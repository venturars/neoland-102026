import { findByEmail, insert } from "../queries/users.js";

// Valida los datos antes de guardar el usuario.
export function createUser(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input) ||
      Object.keys(input).some((key) => key !== "name" && key !== "email")) {
    throw new Error("Input is invalid");
  }
  if (typeof input.name !== "string" || input.name.trim() === "") {
    throw new Error("Name is invalid");
  }
  if (typeof input.email !== "string") {
    throw new Error("Email is invalid");
  }
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (email.length > 64 || !/^[^\s@]+@[^\s@]+$/u.test(email)) {
    throw new Error("Email is invalid");
  }
  if (findByEmail(email)) {
    throw new Error("Email is already used");
  }
  return insert({ name, email });
}
