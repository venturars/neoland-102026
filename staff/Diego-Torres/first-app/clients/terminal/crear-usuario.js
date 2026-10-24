import { db } from "../../db/connection.js";
import { buscarUsuarioPorEmail, crearUsuario } from "../../logic/operaciones.js";
import { crearAlmacenSqlite } from "../../queries/sqlite.js";

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
