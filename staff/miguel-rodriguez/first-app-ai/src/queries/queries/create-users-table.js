export const CREATE_USERS_TABLE =
  "CREATE TABLE IF NOT EXISTS users (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  email VARCHAR(64) NOT NULL UNIQUE,\n  createdAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),\n  updatedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))\n)\n";
