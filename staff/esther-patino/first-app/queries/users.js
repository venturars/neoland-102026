import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../db/connection.js";

const queriesDirectory = dirname(fileURLToPath(import.meta.url));

function readQuery(name) {
  return readFileSync(join(queriesDirectory, "queries", `${name}.sql`), "utf8");
}

export function findById(id) {
  return db.prepare(readQuery("find-by-id")).get({ id });
}

export function findByEmail(email) {
  return db.prepare(readQuery("find-by-email")).get({ email });
}

export function insertUser({ name, email }) {
  return db.prepare(readQuery("insert-user")).get({ name, email });
}

export function updateUser({ id, name, email }) {
  return db.prepare(readQuery("update-user")).get({ id, name, email });
}

export function removeUser(id) {
  return db.prepare(readQuery("remove-user")).run({ id });
}

export function findAll() {
  return db.prepare(readQuery("find-all")).all();
}
