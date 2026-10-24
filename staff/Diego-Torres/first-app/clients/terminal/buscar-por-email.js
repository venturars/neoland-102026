import { db } from "../../db/connection.js";
import { buscarUsuarioPorEmail } from "../../logic/operaciones.js";
import { crearAlmacenSqlite } from "../../queries/sqlite.js";

const almacen = crearAlmacenSqlite(db);

console.log(await buscarUsuarioPorEmail(almacen, "Ana@Ejemplo.com"));
