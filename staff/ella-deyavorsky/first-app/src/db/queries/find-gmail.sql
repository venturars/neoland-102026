-- Return every user whose email contains @gmail, oldest id first.
SELECT
  id,
  name,
  email,
  created_at AS createdAt,
  updated_at AS updatedAt
FROM users
WHERE email LIKE '%@gmail%'
ORDER BY id;
