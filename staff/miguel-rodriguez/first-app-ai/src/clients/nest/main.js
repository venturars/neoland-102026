import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";

const HOST = "127.0.0.1";
const PORT = 3003;
try {
  const app = await NestFactory.create(AppModule);
  const builder = new DocumentBuilder();
  builder.setTitle("First app");
  builder.setVersion("1.0.0");
  const configuration = builder.build();
  const document = SwaggerModule.createDocument(app, configuration);
  SwaggerModule.setup("", app, document);
  await app.listen(PORT, HOST);
  console.log(`http://${HOST}:${PORT}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
