import { Catch, HttpException } from "@nestjs/common";

const ERROR_STATUS = {
  "Name is empty": 400,
  "Email is invalid": 400,
  "Email is already used": 409,
  "User not found": 404,
  "Could not create the user": 500,
  "Could not list the users": 500,
  "Could not find the user": 500,
  "Could not update the user": 500,
  "Could not delete the user": 500,
};

@Catch()
export class HttpExceptionFilter {
  catch(error, host) {
    const http = host.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    if (error instanceof HttpException) {
      const status = error.getStatus();
      if (status === 404) {
        response.status(404);
        response.end();
        return;
      }
    }

    if (error instanceof Error) {
      const message = error.message;
      const status = ERROR_STATUS[message];
      if (typeof status === "number") {
        response.status(status);
        response.json({ message });
        return;
      }
    }

    let message = "";
    if (request.method === "POST") {
      if (request.path === "/users") {
        message = "Could not create the user";
      }
    }
    if (request.method === "GET") {
      if (request.path === "/users") {
        message = "Could not list the users";
      }
      if (request.path.startsWith("/users/")) {
        message = "Could not find the user";
      }
    }
    if (request.method === "PATCH") {
      if (request.path.startsWith("/users/")) {
        message = "Could not update the user";
      }
    }
    if (request.method === "DELETE") {
      if (request.path.startsWith("/users/")) {
        message = "Could not delete the user";
      }
    }

    if (message === "") {
      response.status(404);
      response.end();
      return;
    }
    response.status(500);
    response.json({ message });
  }
}
