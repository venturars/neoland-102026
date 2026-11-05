import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const ORIGIN = "http://127.0.0.1:3003";

const originUrl = new URL(ORIGIN);
const portText = originUrl.port;
const port = Number(portText);
const hostname = originUrl.hostname;

const app = await NestFactory.create(AppModule);
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
