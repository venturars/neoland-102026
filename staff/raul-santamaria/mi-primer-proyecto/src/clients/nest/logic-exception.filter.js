import { Catch, HttpException, NotFoundException } from "@nestjs/common";
import {
  COULD_NOT_FIND_THE_USER,
  FALLBACK_BY_HANDLER,
  MESSAGE_STATUS,
} from "./logic-error.constants.js";

@Catch()
class LogicExceptionFilter {
  catch(exception, host) {
    if (exception instanceof NotFoundException) {
      const context = host.switchToHttp();
      const response = context.getResponse();
      response.status(404);
      response.end();
      return;
    }

    if (exception instanceof HttpException) {
      throw exception;
    }

    const context = host.switchToHttp();
    const response = context.getResponse();
    const handler = host.getHandler();
    let handlerName = "";
    if (handler !== null && handler !== undefined) {
      handlerName = handler.name;
    }
    let fallback = FALLBACK_BY_HANDLER[handlerName];
    if (fallback === undefined) {
      fallback = COULD_NOT_FIND_THE_USER;
    }

    let message = fallback;
    let status = 500;

    if (exception instanceof Error) {
      const knownStatus = MESSAGE_STATUS[exception.message];
      if (knownStatus !== undefined) {
        message = exception.message;
        status = knownStatus;
      }
    }

    response.status(status);
    response.json({ message });
  }
}

export { LogicExceptionFilter };
