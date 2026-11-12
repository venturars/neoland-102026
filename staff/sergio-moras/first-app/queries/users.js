// Acceso a datos de la tabla users.
// Aquí vive todo el SQL. Estas funciones solo ejecutan consultas: no validan
// nada. Las validaciones y los mensajes de error están en la carpeta logic.

import connection from "../db/connection.js";

// Inserta un usuario y devuelve el usuario creado (con su id y sus fechas).
// RETURNING * hace que SQLite devuelva la fila recién insertada.
// Los "?" se rellenan con los valores en orden; así se evita la inyección SQL.
export function insertUser(name, email) {
  const statement = connection.prepare(
    "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
  );
  return statement.get(name, email);
}

// Devuelve el usuario con ese email, o undefined si no existe.
export function selectUserByEmail(email) {
  const statement = connection.prepare("SELECT * FROM users WHERE email = ?");
  return statement.get(email);
}

// Devuelve todos los usuarios ordenados por id (lista vacía si no hay ninguno).
export function selectAllUsers() {
  const statement = connection.prepare("SELECT * FROM users ORDER BY id");
  return statement.all();
}

// Actualiza un usuario y devuelve el usuario ya actualizado,
// o undefined si el id no existe.
// COALESCE(?, name) significa "usa el valor nuevo; si es null, conserva el actual".
// Por eso se pasa null en el campo que no se quiere cambiar.
export function updateUserById(id, name, email) {
  const statement = connection.prepare(`
    UPDATE users
    SET name = COALESCE(?, name),
        email = COALESCE(?, email),
        updated_at = datetime('now')
    WHERE id = ?
    RETURNING *
  `);
  return statement.get(name, email, id);
}

// Borra un usuario. Devuelve true si lo borró y false si el id no existía.
export function deleteUserById(id) {
  const statement = connection.prepare("DELETE FROM users WHERE id = ?");
  const result = statement.run(id);

  // changes es el número de filas borradas: 0 significa que no había ningún usuario con ese id.
  return result.changes > 0;
}
