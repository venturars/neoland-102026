import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const ORIGIN = "http://127.0.0.1:3003";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const originUrl = new URL(ORIGIN);
  const portText = originUrl.port;
  const port = Number(portText);
  const hostname = originUrl.hostname;
  await app.listen(port, hostname);
  console.log(ORIGIN);
}

bootstrap();
