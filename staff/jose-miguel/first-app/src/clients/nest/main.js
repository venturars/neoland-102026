import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

const ORIGIN = "http://127.0.0.1:3003";

const originUrl = new URL(ORIGIN);
const portText = originUrl.port;
const port = Number(portText);
const hostname = originUrl.hostname;

const app = await NestFactory.create(AppModule);
const builder = new DocumentBuilder();
builder.setTitle("Users Neoland");
builder.setVersion("0.0.0");
const config = builder.build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup("", app, document);
try {
  await app.listen(port, hostname);
} catch (error) {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Stop the other pnpm nest or free port ${port}.`,
    );
    process.exit(1);
  }
  throw error;
}
console.log(ORIGIN);
