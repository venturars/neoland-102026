UPDATE users
SET name = COALESCE(?, name),
    email = COALESCE(?, email)
WHERE id = ?;
