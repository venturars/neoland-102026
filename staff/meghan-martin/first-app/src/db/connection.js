import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = dirname(filePath);
const defaultPath = join(directory, "users.sqlite");
const path = process.env.USERS_DB_PATH ?? defaultPath;

export const db = new DatabaseSync(path);
