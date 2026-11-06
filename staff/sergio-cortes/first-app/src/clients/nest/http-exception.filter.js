import { Catch, HttpException } from "@nestjs/common";
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../../logic/errors.js";

@Catch()
export class HttpExceptionFilter {
  catch(exception, host) {
    const http = host.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();

    if (exception.type === "entity.parse.failed") {
      response.status(400);
      response.json({ message: "Body is invalid" });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      if (status === 404) {
        response.status(404);
        response.end();
        return;
      }

      if (status === 400) {
        response.status(400);
        response.json({ message: "Body is invalid" });
        return;
      }
    }

    if (exception instanceof ValidationError) {
      response.status(400);
      response.json({ message: exception.message });
      return;
    }

    if (exception instanceof NotFoundError) {
      response.status(404);
      response.json({ message: exception.message });
      return;
    }

    if (exception instanceof ConflictError) {
      response.status(409);
      response.json({ message: exception.message });
      return;
    }

    if (exception instanceof DatabaseError) {
      response.status(500);
      response.json({ message: exception.message });
      return;
    }

    let couldNot = "";

    if (request.method === "GET") {
      if (request.path === "/users") {
        couldNot = "Could not list the users";
      }
    }

    if (request.method === "GET") {
      if (request.path !== "/users") {
        if (request.path.startsWith("/users/")) {
          couldNot = "Could not find the user";
        }
      }
    }

    if (request.method === "POST") {
      if (request.path === "/users") {
        couldNot = "Could not create the user";
      }
    }

    if (request.method === "PATCH") {
      if (request.path.startsWith("/users/")) {
        couldNot = "Could not update the user";
      }
    }

    if (request.method === "DELETE") {
      if (request.path.startsWith("/users/")) {
        couldNot = "Could not delete the user";
      }
    }

    if (couldNot === "") {
      response.status(404);
      response.end();
      return;
    }

    response.status(500);
    response.json({ message: couldNot });
  }
}
