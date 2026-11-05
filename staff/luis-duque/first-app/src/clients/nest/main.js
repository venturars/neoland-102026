import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const ORIGIN = "http://127.0.0.1:3003";

const originUrl = new URL(ORIGIN);
const port = Number(originUrl.port);
const hostname = originUrl.hostname;

const app = await NestFactory.create(AppModule);
await app.listen(port, hostname);
console.log(ORIGIN);
