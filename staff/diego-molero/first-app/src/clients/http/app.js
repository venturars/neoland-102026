import express from "express";
import { registerUserRoutes } from "./handle-users.js";
import { registerNoteRoutes } from "./handle-notes.js";
import { servePublicFile } from "./serve-public-file.js";
import { sendHttpError } from "./send-http-error.js";

// La web y la API comparten origen; Express transporta datos hacia las capas existentes.
export const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(servePublicFile);
registerUserRoutes(app);
registerNoteRoutes(app);
app.use((_request, response) => response.status(404).json({ message: "Página no encontrada." }));
app.use(sendHttpError);
