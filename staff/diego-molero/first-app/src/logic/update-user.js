import { findById, findByEmail, update } from "../queries/users.js";

// Completa los campos omitidos con los datos del usuario actual.
export function updateUser(id, changes) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("User ID is invalid");
  }
  if (changes === null || typeof changes !== "object" || Array.isArray(changes)) {
    throw new Error("Input is invalid");
  }
  const keys = Object.keys(changes);
  const hasUnknownField = keys.some((key) => key !== "name" && key !== "email");
  if (hasUnknownField) {
    throw new Error("Input is invalid");
  }
  if (changes.name === undefined && changes.email === undefined) {
    throw new Error("No changes provided");
  }
  const current = findById(id);
  if (!current) {
    throw new Error("User not found");
  }

  const rawName = changes.name === undefined ? current.name : changes.name;
  const rawEmail = changes.email === undefined ? current.email : changes.email;
  if (typeof rawName !== "string") {
    throw new Error("Name is invalid");
  }
  const name = rawName.trim();
  if (name === "") {
    throw new Error("Name is invalid");
  }
  if (typeof rawEmail !== "string") {
    throw new Error("Email is invalid");
  }
  const trimmedEmail = rawEmail.trim();
  const email = trimmedEmail.toLowerCase();
  const hasValidEmail = /^[^\s@]+@[^\s@]+$/u.test(email);
  if (email.length > 64 || !hasValidEmail) {
    throw new Error("Email is invalid");
  }
  const owner = findByEmail(email);
  if (owner && owner.id !== id) {
    throw new Error("Email is already used");
  }

  const user = update({ id, name, email });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
