import { db } from "../../db/connection.js";
import { obtenerUsuario } from "../../logic/operaciones.js";
import { crearAlmacenSqlite } from "../../queries/sqlite.js";

const almacen = crearAlmacenSqlite(db);

console.log(await obtenerUsuario(almacen, "1"));
