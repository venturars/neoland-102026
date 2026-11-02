UPDATE users
SET name = :name,
    email = :email,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING *
