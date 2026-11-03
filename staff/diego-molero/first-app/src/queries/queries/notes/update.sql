UPDATE notes
SET title = :title,
    content = :content,
    updatedAt = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE userId = :userId AND id = :id
RETURNING *;
