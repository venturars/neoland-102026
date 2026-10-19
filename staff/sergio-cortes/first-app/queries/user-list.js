import { db } from "../db/connection.js";

export function listUsers() {
  return db.prepare("SELECT * FROM users ORDER BY id").all();
}
