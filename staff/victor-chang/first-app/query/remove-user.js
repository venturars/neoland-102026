import { safe } from "./safe.js";

export const removeUser = (db) =>
  safe((id) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
  });
