import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const createUsersTableSql = readFileSync(
  join(directory, "../queries/queries/create-users-table.sql"),
  "utf8",
);

export const db = new DatabaseSync(join(directory, "users.sqlite"));

db.exec(createUsersTableSql);
