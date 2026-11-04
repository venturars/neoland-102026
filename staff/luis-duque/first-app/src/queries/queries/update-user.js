export const UPDATE_USER = `UPDATE users
SET name = COALESCE(?, name),
    email = COALESCE(?, email)
WHERE id = ?;
`;
