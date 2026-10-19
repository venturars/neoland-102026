import { findByEmail, findById, update } from "../queries/users.js";

export function updateUser(id, changes) {
  const current = findById(id);
  if (!current) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }

  const name = changes.name === undefined ? current.name : changes.name.trim();
  if (name === "") {
    return { ok: false, error: "EMPTY_NAME" };
  }

  const email =
    changes.email === undefined
      ? current.email
      : changes.email.trim().toLowerCase();
  const parts = email.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

  if (!hasSingleAt || email.length > 64) {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  const owner = findByEmail(email);
  if (owner && owner.id !== current.id) {
    return { ok: false, error: "EMAIL_ALREADY_USED" };
  }

  const user = update({ id: current.id, name, email });
  return { ok: true, user };
}
