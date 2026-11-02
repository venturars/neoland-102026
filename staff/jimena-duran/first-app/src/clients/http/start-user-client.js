import { access } from "node:fs/promises";

await access(new URL("../../db/users.sqlite", import.meta.url));
const { createUserClientServer } =
  await import("./create-user-client-server.js");
const server = createUserClientServer();
server.listen(3000, "127.0.0.1", () => {
  console.log("Cliente de usuarios: http://127.0.0.1:3000");
});
