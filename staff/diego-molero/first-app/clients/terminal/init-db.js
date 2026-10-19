import { createApp } from "../../app.js";
import { defaultDatabasePath } from "../../db/connection.js";

// Inicializar varias veces conserva los datos existentes.
const app = createApp();
try {
  console.log(`Base de datos preparada: ${defaultDatabasePath}`);
} finally {
  app.close();
}
