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
  console.log("Correo repetido:", app.createUser({ name: "Otra persona", email: "lucia@example.com" }));
  console.log("Actualizar nombre:", app.updateUser(id, { name: "Lucía García" }));
  console.log("Eliminar usuario:", app.deleteUser(id));
  console.log("Eliminar usuario inexistente:", app.deleteUser(id));
  console.log("Lista final:", app.listUsers());
} finally {
  app.close();
}
