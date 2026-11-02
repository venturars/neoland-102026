import { createUsersTable } from "../../queries/users.js";
import { createWebServer } from "./server.js";

const PORT = Number(process.env.WEB_PORT ?? 8080);
const portIsValid = Number.isInteger(PORT) && PORT >= 0 && PORT <= 65535;
if (!portIsValid) {
  console.error("WEB_PORT must be an integer between 0 and 65535");
  process.exitCode = 1;
} else {
  try {
    createUsersTable();
    const server = createWebServer();
    server.on("error", (error) => {
      console.error(
        `Could not start web client: ${error.code ?? "server error"}`,
      );
      process.exitCode = 1;
    });
    server.listen(PORT, "127.0.0.1", () => {
      const address = server.address();
      console.log(`Web client: http://127.0.0.1:${address.port}`);
    });
  } catch {
    console.error("Could not initialize the users table");
    process.exitCode = 1;
  }
}
