import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

const ORIGIN = "http://127.0.0.1:3003";
const SWAGGER_PATH = "api";
const USER_ID_PARAMETER = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer", minimum: 1 },
};

function addUserIdParameter(document) {
  const byIdPath = document.paths["/users/{id}"];
  if (!byIdPath) {
    return;
  }
  const methods = ["get", "patch", "delete"];
  for (const method of methods) {
    const operation = byIdPath[method];
    if (operation) {
      operation.parameters = [USER_ID_PARAMETER];
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Users API")
    .setDescription("Nest client for first-app users")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  addUserIdParameter(document);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
  const originUrl = new URL(ORIGIN);
  const portText = originUrl.port;
  const port = Number(portText);
  const hostname = originUrl.hostname;
  await app.listen(port, hostname);
  console.log(ORIGIN);
}

bootstrap();
