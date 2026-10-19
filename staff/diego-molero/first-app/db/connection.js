import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

export const defaultDatabasePath = fileURLToPath(new URL("./users.sqlite", import.meta.url));

// Las rutas parten de este archivo, independientemente de la terminal.
export function openDatabase(databasePath = defaultDatabasePath) {
  const db = new DatabaseSync(databasePath);
  try {
    db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}
