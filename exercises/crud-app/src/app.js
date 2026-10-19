import { openDatabase } from './db/connection.js';
import { createUsersRepository } from './db/users-repository.js';
import { createUser } from './logic/create-user.js';
import { updateUser } from './logic/update-user.js';
import { deleteUser } from './logic/delete-user.js';
import { listUsers } from './logic/list-users.js';

export function openApp() {
  const database = openDatabase();
  try {
    const users = createUsersRepository(database);
    return {
      createUser: input => createUser(input, users),
      updateUser: (id, input) => updateUser(id, input, users),
      deleteUser: id => deleteUser(id, users),
      listUsers: () => listUsers(users),
      close: () => database.close(),
    };
  } catch (error) {
    database.close();
    throw error;
  }
}
