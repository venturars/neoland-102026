// El SQL de la tabla users, una consulta por nombre.
// queries/users.js pide cada consulta por su nombre y db/server.js ejecuta
// solo las que están aquí: el servidor nunca ejecuta SQL que le llegue de fuera.
// Los "?" se rellenan con los valores en orden; así se evita la inyección SQL.

export const USER_QUERIES = {
  // RETURNING * hace que SQLite devuelva la fila recién insertada.
  insertUser: "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",

  selectUserByEmail: "SELECT * FROM users WHERE email = ?",

  selectAllUsers: "SELECT * FROM users ORDER BY id",

  // En SQLite, "=" sobre texto distingue mayúsculas: "Ana" no coincide con "ana".
  selectUsersByName: "SELECT * FROM users WHERE name = ? ORDER BY id",

  // COALESCE(?, name) significa "usa el valor nuevo; si es null, conserva el actual".
  // Por eso se pasa null en el campo que no se quiere cambiar.
  updateUserById: `
    UPDATE users
    SET name = COALESCE(?, name),
        email = COALESCE(?, email),
        updated_at = datetime('now')
    WHERE id = ?
    RETURNING *
  `,

  // RETURNING id devuelve una fila por usuario borrado: ninguna si el id no existía.
  deleteUserById: "DELETE FROM users WHERE id = ? RETURNING id",
};
