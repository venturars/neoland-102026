import { safe } from "./safe.js";
import { findUserById } from "./find-user-by-id.js";

export const modifyUser = (db) =>
  safe((id, { name, email }) => {
    db.prepare(
      "UPDATE users SET name = :name, email = :email WHERE id = :id",
    ).run({ id, name, email });
    return findUserById(db)(id);
  });
