-- Return every user, oldest id first.
SELECT
  id,
  name,
  email,
  created_at AS createdAt,
  updated_at AS updatedAt
FROM users
ORDER BY id;
