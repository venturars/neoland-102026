import { safe } from "./safe.js";
import { findUserById } from "./find-user-by-id.js";

export const insertUser = (db) =>
  safe(({ name, email }) => {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO users (name, email) VALUES (:name, :email)")
      .run({ name, email });
    return findUserById(db)(Number(lastInsertRowid));
  });
