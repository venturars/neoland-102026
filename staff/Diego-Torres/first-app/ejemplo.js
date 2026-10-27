import { db } from "./db/connection.js";
import {
  updateUser,
  findUserByEmail,
  createUser,
  listUsers,
} from "./logic/index.js";
import { createSqliteStore } from "./queries/users.js";

const store = createSqliteStore(db);

const email = "Ana@Ejemplo.com";
let ana = await findUserByEmail(store, email);
if (!ana) {
  ana = await createUser(store, {
    nombre: " Ana ",
    email,
  });
}
console.log(ana);

const changed = await updateUser(store, ana.id, {
  nombre: "Ana Torres",
});
console.log(changed);
console.log(await listUsers(store));
