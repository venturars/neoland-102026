// Abre la base de datos y exporta la conexión.
// Es el único punto de acceso al archivo users.sqlite: cualquier otro archivo
// que necesite la base de datos importa esta conexión.

import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

// Ruta absoluta a users.sqlite, calculada a partir de la ubicación de este archivo.
// Así funciona igual aunque ejecutes el comando desde otra carpeta.
const databasePath = fileURLToPath(new URL('./users.sqlite', import.meta.url));

// Si users.sqlite no existe, SQLite lo crea vacío.
const connection = new DatabaseSync(databasePath);

// Crea la tabla solo si todavía no existe, así los datos guardados nunca se pierden.
connection.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default connection;
