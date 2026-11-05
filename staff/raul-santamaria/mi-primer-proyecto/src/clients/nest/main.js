import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

const ORIGIN = "http://127.0.0.1:3003";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Users API")
    .setDescription("Nest users client on port 3003")
    .setVersion("1.0")
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, openApiDocument);
  const originUrl = new URL(ORIGIN);
  const port = Number(originUrl.port);
  const hostname = originUrl.hostname;
  await app.listen(port, hostname);
  console.log(ORIGIN);
}

bootstrap();
