import { createServer } from "node:http";

import { handleRequest } from "./handle-request.js";

export function createHttpServer() {
  // Keep creation separate from listening so a test can choose a free port.
  return createServer(handleRequest);
}
