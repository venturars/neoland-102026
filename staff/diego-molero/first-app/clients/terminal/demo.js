import { createApp } from "../../app.js";

// La demo usa una base temporal en memoria y no modifica los usuarios guardados.
const app = createApp({ databasePath: ":memory:" });

try {
  const created = app.createUser({ name: "  Lucía Molero  ", email: "  LUCIA@example.com  " });
  console.log("Crear usuario:", created);
  if (!created.ok) {
    throw new Error(`No se pudo iniciar la demo: ${created.error}`);
  }

  const id = created.user.id;
  console.log("Listar usuarios:", app.listUsers());
  // La búsqueda reutiliza las reglas del correo y conserva el formato de resultados.
  console.log("Buscar por correo:", app.findUserByEmail("  LUCIA@EXAMPLE.COM  "));
  console.log("Buscar correo inválido:", app.findUserByEmail("sin-arroba"));
  console.log("Buscar usuario inexistente:", app.findUserByEmail("nadie@example.com"));
  console.log("Correo repetido:", app.createUser({ name: "Otra persona", email: "lucia@example.com" }));
  console.log("Actualizar nombre:", app.updateUser(id, { name: "Lucía García" }));
  console.log("Eliminar usuario:", app.deleteUser(id));
  console.log("Eliminar usuario inexistente:", app.deleteUser(id));
  console.log("Lista final:", app.listUsers());
} finally {
  app.close();
}
