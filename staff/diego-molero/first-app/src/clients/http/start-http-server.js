import { app } from "./app.js";

const rawPort = process.env.PORT ?? "3000";
const port = Number(rawPort);
if (!/^\d+$/u.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un entero entre 1 y 65535.");
}

// Escucha solo en el equipo local y requiere preparar la base aparte.
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`Cliente web disponible en http://127.0.0.1:${port}/`);
});
server.on("error", (error) => {
  console.error(error.code === "EADDRINUSE" ? `El puerto ${port} ya está ocupado.` : error);
  process.exitCode = 1;
});
