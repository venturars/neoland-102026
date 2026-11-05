import "reflect-metadata";
/* global console, URL */
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
await app.listen(port, hostname);
console.log(ORIGIN);
