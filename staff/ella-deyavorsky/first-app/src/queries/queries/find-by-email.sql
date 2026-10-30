-- Look up one user by email.
SELECT
  id,
  name,
  email,
  created_at AS createdAt,
  updated_at AS updatedAt
FROM users
WHERE email = :email;
