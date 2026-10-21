import { db } from "../../db/connection.js";
import { eliminarUsuario } from "../../logic/operaciones.js";
import { crearAlmacenSqlite } from "../../queries/sqlite.js";

const almacen = crearAlmacenSqlite(db);

console.log(await eliminarUsuario(almacen, "1"));
