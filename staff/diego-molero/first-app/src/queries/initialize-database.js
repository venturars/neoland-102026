import { db } from "../db/connection.js";
import { createUsersTable } from "./users.js";
import { createNotesTable } from "./notes.js";

// La migración aditiva se confirma solo si el esquema conserva la cascada.
export function initializeDatabase() {
  db.exec("BEGIN");
  try {
    createUsersTable();
    createNotesTable();

    const columns = db.prepare("PRAGMA table_info(notes)").all();
    const expectedColumns = [
      ["id", "INTEGER", 0, 1],
      ["userId", "INTEGER", 1, 0],
      ["title", "TEXT", 1, 0],
      ["content", "TEXT", 1, 0],
      ["createdAt", "TEXT", 1, 0],
      ["updatedAt", "TEXT", 1, 0],
    ];
    const hasValidColumns =
      columns.length === expectedColumns.length &&
      expectedColumns.every(([name, type, notNull, primaryKey], index) => {
        const column = columns[index];
        return (
          column.name === name &&
          column.type.toUpperCase() === type &&
          column.notnull === notNull &&
          column.pk === primaryKey
        );
      });
    const timestampDefault = "strftime('%Y-%m-%dT%H:%M:%fZ', 'now')";
    const hasValidDates =
      columns[4]?.dflt_value === timestampDefault &&
      columns[5]?.dflt_value === timestampDefault;
    const foreignKeys = db.prepare("PRAGMA foreign_key_list(notes)").all();
    const foreignKey = foreignKeys[0];
    const hasValidForeignKey =
      foreignKeys.length === 1 &&
      foreignKey.table === "users" &&
      foreignKey.from === "userId" &&
      foreignKey.to === "id" &&
      foreignKey.on_delete === "CASCADE";
    const indexes = db.prepare("PRAGMA index_list(notes)").all();
    const index = indexes.find((item) => item.name === "notes_user_id");
    const indexColumns = db.prepare("PRAGMA index_info(notes_user_id)").all();
    const hasValidIndex =
      index?.unique === 0 &&
      index.partial === 0 &&
      indexColumns.length === 2 &&
      indexColumns[0].name === "userId" &&
      indexColumns[1].name === "id";
    if (
      !hasValidColumns ||
      !hasValidDates ||
      !hasValidForeignKey ||
      !hasValidIndex
    ) {
      throw new Error("Notes schema is incompatible");
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
