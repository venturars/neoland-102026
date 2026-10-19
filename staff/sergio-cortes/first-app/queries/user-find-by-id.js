import { db } from "../db/connection.js";

export function findUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = :id").get({ id });
}
