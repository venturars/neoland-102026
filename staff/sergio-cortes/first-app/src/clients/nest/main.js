import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

const HOST = "127.0.0.1";
const ORIGIN = "http://127.0.0.1";
const PORT = 3003;
const SWAGGER_PATH = "docs";

const app = await NestFactory.create(AppModule);
const config = new DocumentBuilder()
  .setTitle("Users Neoland")
  .setVersion("0.0.0")
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup(SWAGGER_PATH, app, document);
await app.listen(PORT, HOST);
console.log(`HTTP server listening on ${ORIGIN}:${PORT}`);
console.log("--------------------------------");
console.log(
  `Swagger documentation available at ${ORIGIN}:${PORT}/${SWAGGER_PATH}`,
);
