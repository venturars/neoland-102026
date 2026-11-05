import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

const ORIGIN = "http://127.0.0.1:3003";
const SWAGGER_PATH = "api";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Users API")
    .setDescription("Nest client for first-app users")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
  const originUrl = new URL(ORIGIN);
  const portText = originUrl.port;
  const port = Number(portText);
  const hostname = originUrl.hostname;
  await app.listen(port, hostname);
  console.log(ORIGIN);
}

bootstrap();
