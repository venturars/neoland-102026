import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CONNECTION_FILE = fileURLToPath(import.meta.url);
const DB_DIRECTORY = dirname(CONNECTION_FILE);
const CREATE_USERS_TABLE_PATH = join(
  DB_DIRECTORY,
  "../queries/queries/create-users-table.sql",
);
const CREATE_USERS_TABLE_SQL = readFileSync(CREATE_USERS_TABLE_PATH, "utf8");
const DATABASE_PATH = join(DB_DIRECTORY, "users.sqlite");

export const db = new DatabaseSync(DATABASE_PATH);

db.exec(CREATE_USERS_TABLE_SQL);
