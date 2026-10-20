import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const path = process.env.USERS_DB_PATH ?? join(directory, "users.sqlite");

export const db = new DatabaseSync(path);
