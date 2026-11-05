SELECT *
FROM users
WHERE LOWER(name) = LOWER(:name)
ORDER BY id;
