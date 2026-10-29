import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = dirname(filePath);
const databasePath = join(directory, "users.sqlite");

export const db = new DatabaseSync(databasePath);
