UPDATE users
SET name = ?, email = ?, updatedAt = CURRENT_TIMESTAMP
WHERE id = ?;
