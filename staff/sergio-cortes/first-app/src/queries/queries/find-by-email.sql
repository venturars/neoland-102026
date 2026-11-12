SELECT *
FROM users
WHERE LOWER(email) = LOWER(:email);
