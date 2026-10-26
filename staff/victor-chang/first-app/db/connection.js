import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const DB_PATH = fileURLToPath(new URL("./users.sqlite", import.meta.url));
const SCHEMA = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");

export const db = new DatabaseSync(DB_PATH);
db.exec(SCHEMA);
