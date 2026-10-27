import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";

const dbPath = join(import.meta.dirname, "users.sqlite");

export const db = new DatabaseSync(dbPath);
