import { createServer } from "node:http";
import { handleRequest } from "./handle-request.js";

const rawPort = process.env.PORT ?? "3000";
const port = Number(rawPort);
if (!/^\d+$/u.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un entero entre 1 y 65535.");
}

// El servidor escucha solo en el equipo local y requiere preparar la base aparte.
const server = createServer(handleRequest);
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`El puerto ${port} ya está ocupado.`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Cliente web disponible en http://127.0.0.1:${port}/`);
});
