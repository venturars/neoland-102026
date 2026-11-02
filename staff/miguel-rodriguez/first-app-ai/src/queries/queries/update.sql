UPDATE users
SET name = :name, email = :email, updatedAt = datetime('now', 'localtime')
WHERE id = :id
RETURNING *
