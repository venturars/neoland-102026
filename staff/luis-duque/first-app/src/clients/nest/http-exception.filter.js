import { Catch, HttpException } from "@nestjs/common";

const NAME_IS_REQUIRED = "Name is required";
const NAME_IS_TOO_LONG = "Name must be at most 100 characters";
const EMAIL_IS_REQUIRED = "Email is required";
const EMAIL_IS_NOT_VALID = "Email is not valid";
const ID_IS_INVALID = "User id must be a positive integer";
const UPDATE_NEEDS_A_FIELD = "Provide a name or an email to update";
const WAS_NOT_FOUND = "was not found";
const UNIQUE_CONSTRAINT = "UNIQUE constraint";

function statusFor(error) {
  if (!(error instanceof Error)) {
    return 500;
  }

  if (error instanceof SyntaxError) {
    return 400;
  }

  const message = error.message;

  if (
    message === NAME_IS_REQUIRED ||
    message === NAME_IS_TOO_LONG ||
    message === EMAIL_IS_REQUIRED ||
    message === EMAIL_IS_NOT_VALID ||
    message === ID_IS_INVALID ||
    message === UPDATE_NEEDS_A_FIELD
  ) {
    return 400;
  }

  if (message.endsWith(WAS_NOT_FOUND)) {
    return 404;
  }

  if (message.includes(UNIQUE_CONSTRAINT)) {
    return 409;
  }

  return 500;
}

function messageFor(error) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

@Catch()
export class HttpExceptionFilter {
  catch(exception, host) {
    const http = host.switchToHttp();
    const response = http.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      if (status === 404) {
        response.status(404);
        response.end();
        return;
      }

      if (status === 400) {
        response.status(400);
        response.json({ message: exception.message });
        return;
      }
    }

    const status = statusFor(exception);
    const message = messageFor(exception);
    response.status(status);
    response.json({ message });
  }
}
