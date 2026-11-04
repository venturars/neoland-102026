-- Look up one user by id.
SELECT
  id,
  name,
  email,
  created_at AS createdAt,
  updated_at AS updatedAt
FROM users
WHERE id = :id;
