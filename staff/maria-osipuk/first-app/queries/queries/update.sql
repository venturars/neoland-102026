UPDATE users
SET name = :name,
    email = :email,
    updated_at = datetime('now', 'localtime')
WHERE id = :id;
