import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const folder = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(folder, "../queries/queries/create-table-users.sql");

/**
 * Opens the SQLite file db/users.sqlite and creates the users table if needed.
 * The database file stays inside this folder.
 */
export function openDatabase() {
  const database = new DatabaseSync(path.join(folder, "users.sqlite"));
  const schema = fs.readFileSync(schemaPath, "utf8");
  database.exec(schema);
  return database;
}

export const database = openDatabase();
