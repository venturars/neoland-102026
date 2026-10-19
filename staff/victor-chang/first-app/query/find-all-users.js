import { safe } from "./safe.js";

export const findAllUsers = (db) =>
  safe(() =>
    db
      .prepare("SELECT * FROM users ORDER BY id")
      .all()
      .map((row) => ({ ...row })),
  );
