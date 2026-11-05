// Nest lo necesita para guardar los datos de los decoradores.
// Tiene que ser el primer import.
import "reflect-metadata";
// Escribe avisos en la terminal.
import console from "node:console";
// Permite marcar que el programa ha terminado con un fallo.
import process from "node:process";
// Crea la app de Nest.
import { NestFactory } from "@nestjs/core";

// El módulo que une las piezas de la API.
import { AppModule } from "./app.module.js";

// Dirección de esta API. Solo escucha en este ordenador.
const HOST = "127.0.0.1";
const PORT = 3003;

// Comprueba quién hace la petición antes de atenderla.
function comprobarPeticion(request, response, next) {
  // Solo se responde a esta dirección. Protege del DNS rebinding.
  if (request.headers.host !== `${HOST}:${PORT}`) {
    response.status(403).end();
    return;
  }

  // Una web lleva su Origin y se rechaza: esta API no tiene página.
  if (request.headers.origin !== undefined) {
    response.status(403).end();
    return;
  }

  next();
}

// logger: false quita los avisos de Nest de la terminal.
const app = await NestFactory.create(AppModule, { logger: false });
app.use(comprobarPeticion);

// Arranca la API y avisa si no ha podido hacerlo.
try {
  await app.listen(PORT, HOST);
  console.log(`API de Nest: http://${HOST}:${PORT}`);
} catch (motivo) {
  if (motivo.code === "EADDRINUSE") {
    console.error(
      `El puerto ${PORT} ya está ocupado. Cierra la otra API (Ctrl+C en su terminal) y vuelve a intentarlo.`,
    );
  } else {
    console.error(`No se ha podido iniciar la API en el puerto ${PORT}.`);
  }
  process.exitCode = 1;
}
