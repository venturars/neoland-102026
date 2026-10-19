import { db } from "../db/connection.js";
import { normalizeEmail } from "./_shared/normalize-email.js";

export function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  return db
    .prepare("SELECT * FROM users WHERE email = :email")
    .get({ email: normalizedEmail });
}
