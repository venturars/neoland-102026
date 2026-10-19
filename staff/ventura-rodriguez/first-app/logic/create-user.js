import { findByEmail, insert } from "../queries/users.js";

export function createUser(input) {
  const name = input.name.trim();
  if (name === "") {
    return { ok: false, error: "EMPTY_NAME" };
  }

  const email = input.email.trim().toLowerCase();
  const parts = email.split("@");
  const hasSingleAt =
    parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;

  if (!hasSingleAt || email.length > 64) {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  if (findByEmail(email)) {
    return { ok: false, error: "EMAIL_ALREADY_USED" };
  }

  const user = insert({ name, email });
  return { ok: true, user };
}
