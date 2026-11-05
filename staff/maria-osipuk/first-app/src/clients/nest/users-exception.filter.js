import { Catch, HttpException } from "@nestjs/common";

// The messages thrown by logic/. This client answers them in English,
// as they are, and only decides which HTTP status each one gets.
const ID_IS_INVALID = "User id must be a positive integer";
const NAME_IS_REQUIRED = "User name is required";
const EMAIL_IS_INVALID = "User email is invalid";
const EMAIL_IS_REGISTERED = "User email is already registered";
const USER_DOES_NOT_EXIST = "User does not exist";
const UNABLE_TO_CREATE = "Unable to create user";
const UNABLE_TO_LIST = "Unable to list users";
const UNABLE_TO_FIND = "Unable to find user";
const UNABLE_TO_UPDATE = "Unable to update user";
const UNABLE_TO_DELETE = "Unable to delete user";

// This message is born here: a broken body fails before reaching logic/.
const REQUEST_JSON_IS_INVALID = "Request JSON is invalid";

// @Catch() without arguments catches every error of this client. Each
// error ends here, so the person who made the request never sees the
// default Nest answer or a text this client does not know.
@Catch()
export class UsersExceptionFilter {
  catch(exception, host) {
    const http = host.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();

    // Nest raises its own HttpException for what happens before logic/.
    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      // A route that does not exist answers 404 without a body.
      if (status === 404) {
        response.status(404);
        response.end();
        return;
      }

      // A body that cannot be read as JSON is the only 400 that Nest
      // raises on its own.
      if (status === 400) {
        response.status(400);
        response.json({ message: REQUEST_JSON_IS_INVALID });
        return;
      }
    }

    if (exception instanceof Error) {
      const message = exception.message;

      if (message === ID_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === NAME_IS_REQUIRED) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === EMAIL_IS_INVALID) {
        response.status(400);
        response.json({ message });
        return;
      }

      if (message === EMAIL_IS_REGISTERED) {
        response.status(409);
        response.json({ message });
        return;
      }

      if (message === USER_DOES_NOT_EXIST) {
        response.status(404);
        response.json({ message });
        return;
      }

      // deleteUser looks for the user first, so without the data server
      // this is the message that arrives, not the one about deleting.
      if (request.method === "DELETE") {
        if (message === UNABLE_TO_FIND) {
          response.status(500);
          response.json({ message });
          return;
        }
      }
    }

    // Anything else answers the message of the operation, so an unknown
    // text never reaches the person who made the request. The operation
    // is known from the method and the path of the request.
    const path = request.path;
    const isUserPath = path.startsWith("/users/");
    let unableTo = "";

    if (request.method === "POST" && path === "/users") {
      unableTo = UNABLE_TO_CREATE;
    }

    if (request.method === "GET" && path === "/users") {
      unableTo = UNABLE_TO_LIST;
    }

    if (request.method === "GET" && isUserPath) {
      unableTo = UNABLE_TO_FIND;
    }

    if (request.method === "PATCH" && isUserPath) {
      unableTo = UNABLE_TO_UPDATE;
    }

    if (request.method === "DELETE" && isUserPath) {
      unableTo = UNABLE_TO_DELETE;
    }

    // No operation matches: the route does not exist.
    if (unableTo === "") {
      response.status(404);
      response.end();
      return;
    }

    response.status(500);
    response.json({ message: unableTo });
  }
}
