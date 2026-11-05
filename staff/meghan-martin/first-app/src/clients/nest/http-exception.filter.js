import { Catch, HttpException } from "@nestjs/common";

const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const USER_NOT_FOUND = "User not found";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";

@Catch()
export class HttpExceptionFilter {
  catch(exception, host) {
    const http = host.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (status === 404) {
        response.status(404);
        response.end();
        return;
      }
    }

    if (exception instanceof Error) {
      const message = exception.message;
      if (message === NAME_IS_EMPTY) {
        response.status(400);
        response.json({ message });
        return;
      }
      if (message === EMAIL_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }
      if (message === EMAIL_IS_ALREADY_USED) {
        response.status(409);
        response.json({ message });
        return;
      }
      if (message === USER_NOT_FOUND) {
        response.status(404);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_CREATE_THE_USER) {
        response.status(500);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_LIST_THE_USERS) {
        response.status(500);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_FIND_THE_USER) {
        response.status(500);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_UPDATE_THE_USER) {
        response.status(500);
        response.json({ message });
        return;
      }
      if (message === COULD_NOT_DELETE_THE_USER) {
        response.status(500);
        response.json({ message });
        return;
      }
    }

    const path = request.path;
    let couldNot = "";
    if (request.method === "POST") {
      if (path === "/users") {
        couldNot = COULD_NOT_CREATE_THE_USER;
      }
    }
    if (request.method === "GET") {
      if (path === "/users") {
        couldNot = COULD_NOT_LIST_THE_USERS;
      }
    }
    if (request.method === "GET") {
      if (path !== "/users") {
        if (typeof path === "string") {
          if (path.startsWith("/users/")) {
            couldNot = COULD_NOT_FIND_THE_USER;
          }
        }
      }
    }
    if (request.method === "PATCH") {
      if (typeof path === "string") {
        if (path.startsWith("/users/")) {
          couldNot = COULD_NOT_UPDATE_THE_USER;
        }
      }
    }
    if (request.method === "DELETE") {
      if (typeof path === "string") {
        if (path.startsWith("/users/")) {
          couldNot = COULD_NOT_DELETE_THE_USER;
        }
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
