import "reflect-metadata";

import { error as logError, log } from "node:console";

import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module.js";

// This client only turns HTTP into calls to logic/ and back. The rules
// stay in logic/ and the SQL stays in the data server (pnpm start).
const HOSTNAME = "127.0.0.1";
const PORT = 3003;

try {
  const app = await NestFactory.create(AppModule);

  // The page describes the five routes of the controller and lets the
  // person launch them. The empty path publishes it at the address of the
  // client, and it is registered in Express, outside the Nest routes.
  const builder = new DocumentBuilder();
  builder.setTitle("Users");
  builder.setVersion("0.0.0");
  const config = builder.build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("", app, document);

  // Listen only on this computer, like the data server.
  await app.listen(PORT, HOSTNAME);

  log("First App Nest client: http://" + HOSTNAME + ":" + PORT);
} catch {
  logError(
    "No se ha podido iniciar el cliente Nest. Comprueba si el puerto 3003 está ocupado.",
  );
  process.exitCode = 1;
}
