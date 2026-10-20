CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
