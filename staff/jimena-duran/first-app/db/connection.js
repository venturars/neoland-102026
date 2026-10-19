import { DatabaseSync } from "node:sqlite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const databaseDirectory = dirname(fileURLToPath(import.meta.url));
const defaultDatabasePath = resolve(databaseDirectory, "users.sqlite");
const databasePath = process.env.USERS_DB_PATH ?? defaultDatabasePath;

export const db = new DatabaseSync(databasePath);