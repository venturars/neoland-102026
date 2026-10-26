import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Keep the database file next to this file, no matter which folder we run from.
const currentFolder = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.join(currentFolder, "users.sqlite");

// Opening the database creates users.sqlite when the file is not there yet.
export const db = new DatabaseSync(databasePath);
