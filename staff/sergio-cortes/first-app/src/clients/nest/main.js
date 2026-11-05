import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const HOST = "127.0.0.1";
const ORIGIN = "http://127.0.0.1";
const PORT = 3003;

const app = await NestFactory.create(AppModule);
await app.listen(PORT, HOST);
console.log(`HTTP server listening on ${ORIGIN}:${PORT}`);
