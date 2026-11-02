import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Keep the database file next to this file, no matter which folder we run from.
const currentFile = fileURLToPath(import.meta.url);
const currentFolder = path.dirname(currentFile);
const databasePath = path.join(currentFolder, "users.sqlite");

// Opening the database creates users.sqlite when the file is not there yet.
export const db = new DatabaseSync(databasePath);
