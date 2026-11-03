import { error, log } from "node:console";
import { once } from "node:events";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import process, { chdir } from "node:process";
import { fileURLToPath } from "node:url";

import { handleRequest } from "./handle-request.js";

export async function startBrowserServer() {
  const filePath = fileURLToPath(import.meta.url);
  const browserDir = dirname(filePath);
  const appRoot = join(browserDir, "..", "..", "..");
  chdir(appRoot);

  const server = createServer(handleRequest);

  server.listen(3000, "127.0.0.1");
  await once(server, "listening");

  log("First App (browser): http://127.0.0.1:3000");
}

try {
  await startBrowserServer();
} catch {
  error(
    "No se ha podido iniciar el cliente de navegador. Comprueba si el puerto 3000 está ocupado.",
  );
  process.exitCode = 1;
}
