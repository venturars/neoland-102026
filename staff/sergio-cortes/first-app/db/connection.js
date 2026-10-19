import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = join(projectRoot, "data", "users.sqlite");

mkdirSync(dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);
