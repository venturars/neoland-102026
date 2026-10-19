import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(here, "users.sqlite");

export function openDatabase() {
  return new DatabaseSync(dbPath);
}

export function closeDatabase(db) {
  db.close();
}
