import { db } from "../../db/connection.js";
import { actualizarUsuario } from "../../logic/operaciones.js";
import { crearAlmacenSqlite } from "../../queries/sqlite.js";

const almacen = crearAlmacenSqlite(db);

const cambiada = await actualizarUsuario(almacen, "1", {
  nombre: "Ana Torres",
});
console.log(cambiada);
