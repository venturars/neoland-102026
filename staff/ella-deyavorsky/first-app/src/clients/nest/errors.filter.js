/* global console */
import { Catch, HttpException } from "@nestjs/common";

// Each sentence of logic/ that the person can fix, with its status. The rest answer 500.
const STATUS_BY_SENTENCE = new Map([
  ["The name is missing.", 400],
  ["The email is not valid.", 400],
  ["There is nothing to update.", 400],
  ["No user was found.", 404],
  ["This email is already used.", 409],
]);

// Turns everything that is thrown into an HTTP answer. logic/ throws a plain Error and knows nothing about HTTP.
@Catch()
export class ErrorsFilter {
  constructor(httpAdapter) {
    this.httpAdapter = httpAdapter;
  }

  catch(error, host) {
    const http = host.switchToHttp();
    const response = http.getResponse();

    const status = STATUS_BY_SENTENCE.get(error.message);
    if (status !== undefined) {
      this.httpAdapter.reply(response, { error: error.message }, status);
      return;
    }

    if (error instanceof HttpException) {
      const httpStatus = error.getStatus();

      // Nest throws this for a route it does not know. "No user was found." never gets here.
      if (httpStatus === 404) {
        this.httpAdapter.reply(response, undefined, 404);
        return;
      }

      // Broken JSON, a body too large, or a shape check of the controller.
      if (httpStatus >= 400 && httpStatus < 500) {
        this.httpAdapter.reply(
          response,
          { error: "The request is not valid." },
          400,
        );
        return;
      }
    }

    if (error.message !== "The database failed.") {
      // Not a sentence of the app: a real bug, so it is shown in the terminal.
      console.error(error);
    }
    this.httpAdapter.reply(response, { error: "The database failed." }, 500);
  }
}
