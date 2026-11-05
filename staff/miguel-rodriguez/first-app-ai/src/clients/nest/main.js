import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const HOST = "127.0.0.1";
const PORT = 3003;
try {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, HOST);
  console.log(`http://${HOST}:${PORT}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
