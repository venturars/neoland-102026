UPDATE users
SET name = :name,
    email = :email,
    updatedAt = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE id = :id
RETURNING *;
