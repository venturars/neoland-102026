import { openDatabase } from "./db/connection.js";
import { createUser } from "./logic/create-user.js";
import { deleteUser } from "./logic/delete-user.js";
import { listUsers } from "./logic/list-users.js";
import { updateUser } from "./logic/update-user.js";
import { createSqliteUserRepository } from "./repositories/sqlite-user-repository.js";

// Aquí se conectan las reglas con SQLite; importar el módulo no abre la base.
export function createApp({ databasePath } = {}) {
  const db = openDatabase(databasePath);
  try {
    const userRepository = createSqliteUserRepository(db);
    return {
      createUser: (input) => createUser(userRepository, input),
      listUsers: () => listUsers(userRepository),
      updateUser: (id, changes) => updateUser(userRepository, id, changes),
      deleteUser: (id) => deleteUser(userRepository, id),
      close: () => db.close(),
    };
  } catch (error) {
    db.close();
    throw error;
  }
}
