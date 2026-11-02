import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const filePath = fileURLToPath(import.meta.url);
const directory = dirname(filePath);
const databasePath = join(directory, "users.sqlite");

export const db = new DatabaseSync(databasePath);
