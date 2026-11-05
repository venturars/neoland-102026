import "reflect-metadata";

import { error as logError, log } from "node:console";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

// This client only turns HTTP into calls to logic/ and back. The rules
// stay in logic/ and the SQL stays in the data server (pnpm start).
const HOSTNAME = "127.0.0.1";
const PORT = 3003;

try {
  const app = await NestFactory.create(AppModule);

  // Listen only on this computer, like the data server.
  await app.listen(PORT, HOSTNAME);

  log("First App Nest client: http://" + HOSTNAME + ":" + PORT);
} catch {
  logError(
    "No se ha podido iniciar el cliente Nest. Comprueba si el puerto 3003 está ocupado.",
  );
  process.exitCode = 1;
}
