import { Catch, HttpException } from "@nestjs/common";

const STATUS_BY_MESSAGE = {
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
    const response = http.getResponse();
    const request = http.getRequest();
    if (error instanceof HttpException) {
      const status = error.getStatus();
      if (status === 404) {
        response.status(404).end();
        return;
      }
    }
    if (error instanceof Error) {
      const message = error.message;
      const knownMessage = Object.hasOwn(STATUS_BY_MESSAGE, message);
      if (knownMessage) {
        const status = STATUS_BY_MESSAGE[message];
        response.status(status).json({ message });
        return;
      }
    }
    const method = request.method;
    const path = request.path;
    let action;
    if (path === "/users" || path === "/users/") {
      if (method === "POST") {
        action = "create";
      }
      if (method === "GET") {
        action = "list";
      }
    } else if (path.startsWith("/users/")) {
      if (method === "GET") {
        action = "find";
      }
      if (method === "PATCH") {
        action = "update";
      }
      if (method === "DELETE") {
        action = "delete";
      }
    }
    if (!action) {
      response.status(404).end();
      return;
    }
    let message = `Could not ${action} the user`;
    if (action === "list") {
      message = "Could not list the users";
    }
    response.status(500).json({ message });
  }
}
