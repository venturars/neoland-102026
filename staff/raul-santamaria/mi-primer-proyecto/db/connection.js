import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(here, "users.sqlite");

// sqlite3 avisa con un callback. La promesa permite usar await.
export function openDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (openError) => {
      if (openError) {
        reject(openError);
        return;
      }

      resolve(db);
    });
  });
}

export function closeDatabase(db) {
  return new Promise((resolve, reject) => {
    db.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}
