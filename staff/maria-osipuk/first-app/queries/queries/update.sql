UPDATE users
SET name = :name,
    email = :email,
    updated_at = :updatedAt
WHERE id = :id;
