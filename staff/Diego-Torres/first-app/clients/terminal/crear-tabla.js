import { db } from "../../db/connection.js";
import { crearAlmacenSqlite } from "../../queries/sqlite.js";

crearAlmacenSqlite(db);
console.log(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all());
