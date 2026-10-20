import { findById, findByEmail, update } from "../queries/users.js";

// Los campos omitidos se conservan; las reglas y el orden de errores no cambian.
export function updateUser(id, changes) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "INVALID_ID" };
  }
  if (changes === null || typeof changes !== "object" || Array.isArray(changes) ||
      Object.keys(changes).some((key) => key !== "name" && key !== "email")) {
    return { ok: false, error: "INVALID_INPUT" };
  }
  if (changes.name === undefined && changes.email === undefined) {
    return { ok: false, error: "EMPTY_CHANGES" };
  }
  const current = findById(id);
  if (!current) return { ok: false, error: "USER_NOT_FOUND" };

  const rawName = changes.name === undefined ? current.name : changes.name;
  const rawEmail = changes.email === undefined ? current.email : changes.email;
  if (typeof rawName !== "string" || rawName.trim() === "") {
    return { ok: false, error: "INVALID_NAME" };
  }
  if (typeof rawEmail !== "string") {
    return { ok: false, error: "INVALID_EMAIL" };
  }
  const name = rawName.trim();
  const email = rawEmail.trim().toLowerCase();
  if (email.length > 64 || !/^[^\s@]+@[^\s@]+$/u.test(email)) {
    return { ok: false, error: "INVALID_EMAIL" };
  }
  const owner = findByEmail(email);
  if (owner && owner.id !== id) return { ok: false, error: "EMAIL_ALREADY_USED" };
  try {
    const user = update({ id, name, email });
    return user ? { ok: true, user } : { ok: false, error: "USER_NOT_FOUND" };
  } catch (error) {
    if (error.code === "EMAIL_ALREADY_USED") {
      return { ok: false, error: "EMAIL_ALREADY_USED" };
    }
    throw error;
  }
}
