import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

let db;
try {
  const path = fileURLToPath(new URL("./users.sqlite", import.meta.url));
  db = new DatabaseSync(path);
} catch {
  throw new Error("Could not open the database");
}

export { db };
