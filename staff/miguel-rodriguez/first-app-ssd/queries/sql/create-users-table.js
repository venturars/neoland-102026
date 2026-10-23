export const createUsersTableSql = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 9007199254740991),
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
  email TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (length(trim(email)) BETWEEN 3 AND 64),
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;`;
