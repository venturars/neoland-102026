// Acceso a datos de la tabla users.
// Cada función pide una consulta de users-sql.js, por su nombre, al servidor
// de la base (db/server.js). No validan nada: las validaciones y los mensajes
// de error están en la carpeta logic.
// Solo usa fetch, así que este fichero funciona en Node y en el navegador.

const DATABASE_URL = "http://127.0.0.1:4000/query";

// Pide al servidor la consulta con ese nombre y devuelve la lista de filas.
// Lanza un Error si el servidor no está en marcha o si la consulta falla.
async function runQuery(queryName, params) {
  const body = JSON.stringify({ query: queryName, params: params });

  let response;
  try {
    response = await fetch(DATABASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });
  } catch (error) {
    throw new Error("Database is not running. Start it with pnpm db.", {
      cause: error,
    });
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }

  return data.rows;
}

// Inserta un usuario y devuelve el usuario creado (con su id y sus fechas).
export async function insertUser(name, email) {
  const rows = await runQuery("insertUser", [name, email]);
  return rows[0];
}

// Devuelve el usuario con ese email, o undefined si no existe.
export async function selectUserByEmail(email) {
  const rows = await runQuery("selectUserByEmail", [email]);
  return rows[0];
}

// Devuelve todos los usuarios ordenados por id (lista vacía si no hay ninguno).
export async function selectAllUsers() {
  const rows = await runQuery("selectAllUsers", []);
  return rows;
}

// Devuelve los usuarios con ese nombre exacto, ordenados por id (lista vacía si no hay ninguno).
export async function selectUsersByName(name) {
  const rows = await runQuery("selectUsersByName", [name]);
  return rows;
}

// Actualiza un usuario y devuelve el usuario ya actualizado,
// o undefined si el id no existe.
// Se pasa null en el campo que no se quiere cambiar.
export async function updateUserById(id, name, email) {
  const rows = await runQuery("updateUserById", [name, email, id]);
  return rows[0];
}

// Borra un usuario. Devuelve true si lo borró y false si el id no existía.
export async function deleteUserById(id) {
  const rows = await runQuery("deleteUserById", [id]);

  // Hay una fila por usuario borrado: ninguna significa que no había ningún usuario con ese id.
  return rows.length > 0;
}
