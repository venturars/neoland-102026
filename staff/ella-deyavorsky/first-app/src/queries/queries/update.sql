-- Change the name and email of one existing user, and refresh updated_at.
UPDATE users
SET
  name = :name,
  email = :email,
  updated_at = datetime('now')
WHERE id = :id
RETURNING
  id,
  name,
  email,
  created_at AS createdAt,
  updated_at AS updatedAt;
