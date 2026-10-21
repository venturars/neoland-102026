INSERT INTO users (name, email, created_at, updated_at)
VALUES (
  :name,
  :email,
  datetime('now', 'localtime'),
  datetime('now', 'localtime')
);
