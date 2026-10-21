import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const folder = path.dirname(fileURLToPath(import.meta.url));

/**
 * Opens the SQLite file BD/users.db and creates the users table if needed.
 * The database file stays inside this folder.
 */
export function openDatabase() {
  const database = new DatabaseSync(path.join(folder, "users.db"));
  const schema = fs.readFileSync(path.join(folder, "users.sqlite"), "utf8");
  database.exec(schema);
  return database;
}

export const database = openDatabase();
