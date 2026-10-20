import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const SCHEMA = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");

export function openDatabase(path) {
  const db = new DatabaseSync(path);
  db.exec(SCHEMA);
  return db;
}
