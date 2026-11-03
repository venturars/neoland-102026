import { createServer } from "node:http";
import { error, log } from "node:console";
import process from "node:process";

import { db } from "../../db/connection.js";
import { createSqliteStore } from "../../queries/users.js";
import { handleRequest } from "./handle-request.js";

const HOST = "127.0.0.1";
const PORT = 3000;

const store = createSqliteStore(db);
const server = createServer((request, response) =>
  handleRequest(store, request, response),
);

server.on("error", (reason) => {
  if (reason.code === "EADDRINUSE") {
    error(
      `El puerto ${PORT} ya está ocupado. Cierra la otra First App (Ctrl+C en su terminal) y vuelve a intentarlo.`,
    );
  } else {
    error(`No se ha podido iniciar First App en el puerto ${PORT}.`);
  }
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  log(`First App: http://${HOST}:${PORT}`);
});
