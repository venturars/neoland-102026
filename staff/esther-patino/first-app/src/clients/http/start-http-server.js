import { error, log } from "node:console";
import { once } from "node:events";
import { createServer } from "node:http";

import { handleRequest } from "./handle-request.js";

export async function startHttpServer() {
  const server = createServer(handleRequest);

  server.listen(3000, "127.0.0.1");
  await once(server, "listening");

  log("First App: http://127.0.0.1:3000");
}

try {
  await startHttpServer();
} catch {
  error(
    "No se ha podido iniciar First App. Comprueba si el puerto 3000 está ocupado.",
  );
  process.exitCode = 1;
}
