import { db } from "../../db/connection.js";
import { listarUsuarios } from "../../logic/operaciones.js";
import { crearAlmacenSqlite } from "../../queries/sqlite.js";

const almacen = crearAlmacenSqlite(db);

console.log(await listarUsuarios(almacen));
