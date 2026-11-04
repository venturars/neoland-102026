INSERT INTO notes (userId, title, content)
VALUES (:userId, :title, :content)
RETURNING *;
