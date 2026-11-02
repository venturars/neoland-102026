import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const queriesDir = join(dirname(fileURLToPath(import.meta.url)), "queries");

function readSql(name) {
  return readFileSync(join(queriesDir, name), "utf8");
}

function copy(row) {
  if (!row) {
    return null;
  }
  return {
    id: String(row.id),
    nombre: row.name,
    email: row.email,
  };
}

export function createSqliteStore(db) {
  db.exec(readSql("create-users-table.sql"));

  const insertStmt = db.prepare(readSql("insert.sql"));
  const updateStmt = db.prepare(readSql("update.sql"));
  const removeStmt = db.prepare(readSql("remove.sql"));
  const findByIdStmt = db.prepare(readSql("find-by-id.sql"));
  const findByEmailStmt = db.prepare(readSql("find-by-email.sql"));
  const findByNameStmt = db.prepare(readSql("find-by-name.sql"));
  const findAllStmt = db.prepare(readSql("find-all.sql"));

  return {
    async save(user) {
      if (user.id === undefined || user.id === null) {
        return copy(
          insertStmt.get({
            name: user.nombre,
            email: user.email,
          }),
        );
      }

      return copy(
        updateStmt.get({
          id: Number(user.id),
          name: user.nombre,
          email: user.email,
        }),
      );
    },

    async findById(id) {
      return copy(findByIdStmt.get({ id: Number(id) }));
    },

    async findByEmail(email) {
      return copy(findByEmailStmt.get({ email }));
    },

    async findByName(name) {
      return findByNameStmt.all({ name }).map((row) => copy(row));
    },

    async findAll() {
      return findAllStmt.all().map((row) => copy(row));
    },

    async remove(id) {
      const info = removeStmt.run({ id: Number(id) });
      return info.changes > 0;
    },
  };
}
