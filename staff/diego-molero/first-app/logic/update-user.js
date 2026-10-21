import { findById, findByEmail, update } from "../queries/users.js";

// Completa los campos omitidos con los datos del usuario actual.
export function updateUser(id, changes) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("User ID is invalid");
  }
  if (changes === null || typeof changes !== "object" || Array.isArray(changes) ||
      Object.keys(changes).some((key) => key !== "name" && key !== "email")) {
    throw new Error("Input is invalid");
  }
  if (changes.name === undefined && changes.email === undefined) {
    throw new Error("No changes provided");
  }
  const current = findById(id);
  if (!current) throw new Error("User not found");

  const rawName = changes.name === undefined ? current.name : changes.name;
  const rawEmail = changes.email === undefined ? current.email : changes.email;
  if (typeof rawName !== "string" || rawName.trim() === "") {
    throw new Error("Name is invalid");
  }
  if (typeof rawEmail !== "string") {
    throw new Error("Email is invalid");
  }
  const name = rawName.trim();
  const email = rawEmail.trim().toLowerCase();
  if (email.length > 64 || !/^[^\s@]+@[^\s@]+$/u.test(email)) {
    throw new Error("Email is invalid");
  }
  const owner = findByEmail(email);
  if (owner && owner.id !== id) throw new Error("Email is already used");

  const user = update({ id, name, email });
  if (!user) throw new Error("User not found");
  return user;
}
