import { error, log } from "node:console";
import { once } from "node:events";

import { createHttpServer } from "./create-http-server.js";

export async function startHttpServer() {
  const server = createHttpServer();

  // Listen only on this computer. Opening the page does not add a login.
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
