import "reflect-metadata";
/* global console, URL */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app-module.js";

const ORIGIN = "http://127.0.0.1:3003";
const address = new URL(ORIGIN);
const portText = address.port;
const port = Number(portText);
const hostname = address.hostname;

const app = await NestFactory.create(AppModule);
await app.listen(port, hostname);
console.log(ORIGIN);
