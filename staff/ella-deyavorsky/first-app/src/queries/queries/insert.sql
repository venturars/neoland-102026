-- Save a new user. SQLite fills id, created_at, and updated_at.
INSERT INTO users (name, email)
VALUES (:name, :email)
RETURNING
  id,
  name,
  email,
  created_at AS createdAt,
  updated_at AS updatedAt;
