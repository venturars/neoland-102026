/* global console */
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module.js";
import { ErrorsFilter } from "./errors.filter.js";

// The client listens only on this computer, so nobody else on the network can reach it.
const HOST = "127.0.0.1";
// The database program, the HTTP client and the extension use 3000, 3001 and 3002, so this client uses the next port.
const PORT = 3003;

// bodyParser: false, because Nest would also read forms. logger: false, so it prints one line like the other clients.
const app = await NestFactory.create(AppModule, {
  bodyParser: false,
  logger: false,
});

// Reads the body of a request as JSON only.
app.useBodyParser("json");

const httpAdapter = app.getHttpAdapter();
app.useGlobalFilters(new ErrorsFilter(httpAdapter));

// The page /docs shows the routes, as the decorators of the controller describe them, and sends requests to them.
const document = SwaggerModule.createDocument(
  app,
  new DocumentBuilder()
    .setTitle("Users API")
    .setDescription("Small user management app")
    .setVersion("0.0.0")
    .build(),
);
SwaggerModule.setup("docs", app, document);

await app.listen(PORT, HOST);
console.log("Nest client on http://" + HOST + ":" + PORT);
console.log("Swagger UI on http://" + HOST + ":" + PORT + "/docs");
