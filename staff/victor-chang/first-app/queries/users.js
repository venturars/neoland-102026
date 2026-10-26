import { readFileSync } from "node:fs";
import { db } from "../db/connection.js";

function sql(file) {
  return readFileSync(new URL(`./queries/${file}`, import.meta.url), "utf8");
}

export function findAll() {
  return db.prepare(sql("find-all-users.sql")).all();
}

export function findById(id) {
  return db.prepare(sql("find-user-by-id.sql")).get({ id });
}

export function findByEmail(email) {
  return db.prepare(sql("find-user-by-email.sql")).get({ email });
}

export function insert(name, email) {
  const { lastInsertRowid } = db
    .prepare(sql("insert-user.sql"))
    .run({ name, email });
  return findById(Number(lastInsertRowid));
}

export function update(id, name, email) {
  db.prepare(sql("update-user.sql")).run({ id, name, email });
  return findById(id);
}

export function remove(id) {
  db.prepare(sql("delete-user.sql")).run({ id });
}
