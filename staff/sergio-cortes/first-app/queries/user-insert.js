import { db } from "../db/connection.js";
import { normalizeEmail } from "./_shared/normalize-email.js";
import { rethrowUniqueEmailConflict } from "./_shared/rethrow-unique-email-conflict.js";

export function insertUser({ name, email }) {
  const normalizedEmail = normalizeEmail(email);

  return rethrowUniqueEmailConflict(() =>
    db
      .prepare(
        `
          INSERT INTO users (name, email)
          VALUES (:name, :email)
          RETURNING *
        `,
      )
      .get({ name, email: normalizedEmail }),
  );
}
