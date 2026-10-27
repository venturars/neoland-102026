import { db } from "./db/connection.js";
import {
  actualizarUsuario,
  buscarUsuarioPorEmail,
  crearUsuario,
  listarUsuarios,
} from "./logic/index.js";
import { crearAlmacenSqlite } from "./queries/users.js";

const almacen = crearAlmacenSqlite(db);

const email = "Ana@Ejemplo.com";
let ana = await buscarUsuarioPorEmail(almacen, email);
if (!ana) {
  ana = await crearUsuario(almacen, {
    nombre: " Ana ",
    email,
  });
}
console.log(ana);

const cambiada = await actualizarUsuario(almacen, ana.id, {
  nombre: "Ana Torres",
});
console.log(cambiada);
console.log(await listarUsuarios(almacen));
