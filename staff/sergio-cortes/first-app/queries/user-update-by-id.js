import { db } from "../db/connection.js";
import { normalizeEmail } from "./_shared/normalize-email.js";
import { rethrowUniqueEmailConflict } from "./_shared/rethrow-unique-email-conflict.js";

export function updateUserById({ id, name, email }) {
  const normalizedEmail = normalizeEmail(email);

  return rethrowUniqueEmailConflict(() =>
    db
      .prepare(
        `
          UPDATE users
          SET name = :name,
              email = :email,
              updatedAt = datetime('now', 'localtime')
          WHERE id = :id
          RETURNING *
        `,
      )
      .get({ id, name, email: normalizedEmail }),
  );
}
