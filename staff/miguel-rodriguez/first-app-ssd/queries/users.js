import { listUsersSql } from "./sql/list-users.js";
import { deleteUserSql } from "./sql/delete-user.js";
import { findUserByIdSql } from "./sql/find-user-by-id.js";
import { updateUserSql } from "./sql/update-user.js";
import { findUserByEmailSql } from "./sql/find-user-by-email.js";
import { insertUserSql } from "./sql/insert-user.js";
import { db } from "../db/connection.js";
import { createUsersTableSql } from "./sql/create-users-table.js";
import { findUsersSchemaSql } from "./sql/find-users-schema.js";

// Compare only our supported definition, preserving all quoted literal contents.
function normalizeDefinition(sql) {
  const parts = sql.match(/'(?:''|[^'])*'|[^']+/g);
  return parts
    .map((part) => {
      if (part.startsWith("'")) return part;
      return part.replace(/\s/g, "").toLowerCase();
    })
    .join("")
    .replace(/^createtableifnotexists/, "createtable")
    .replace(/;$/, "");
}

export function createUsersTable() {
  let existing;
  try {
    existing = db.prepare(findUsersSchemaSql).get({ name: "users" });
  } catch {
    throw new Error("Could not initialize the database");
  }

  if (existing) {
    if (
      existing.type !== "table" ||
      normalizeDefinition(existing.sql) !== normalizeDefinition(createUsersTableSql)
    ) {
      throw new Error("Users table schema is incompatible");
    }
    return;
  }

  try {
    db.exec(createUsersTableSql);
  } catch {
    throw new Error("Could not initialize the database");
  }
}


export function findByEmail(email) {
  return db.prepare(findUserByEmailSql).get({ email });
}

export function insertUser(name, email) {
  return db.prepare(insertUserSql).get({ name, email });
}


export function findById(id) {
  return db.prepare(findUserByIdSql).get({ id });
}

export function updateUserById(id, name, email) {
  return db.prepare(updateUserSql).get({ id, name, email });
}


export function deleteUserById(id) {
  return db.prepare(deleteUserSql).get({ id });
}


export function findAllUsers() {
  return db.prepare(listUsersSql).all();
}
