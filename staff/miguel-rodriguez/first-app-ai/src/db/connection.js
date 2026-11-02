import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const modulePath = fileURLToPath(import.meta.url);
const directory = dirname(modulePath);
const databasePath = join(directory, "users.sqlite");

export const db = new DatabaseSync(databasePath);
