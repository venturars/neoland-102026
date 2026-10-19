import { db } from "../db/connection.js";

export function deleteUserById(id) {
  const result = db.prepare("DELETE FROM users WHERE id = :id").run({ id });
  return result.changes > 0;
}
