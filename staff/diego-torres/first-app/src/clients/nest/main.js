// Nest lo necesita para guardar los datos de los decoradores.
// Tiene que ser el primer import.
import "reflect-metadata";
// Escribe avisos en la terminal.
import console from "node:console";
// Permite marcar que el programa ha terminado con un fallo.
import process from "node:process";
// Crea la app de Nest.
import { NestFactory } from "@nestjs/core";
// Crea la página que explica la API y permite probarla.
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

// El módulo que une las piezas de la API.
import { AppModule } from "./app.module.js";

// Dirección de esta API. Solo escucha en este ordenador.
const HOST = "127.0.0.1";
const PORT = 3003;

// Dirección que el navegador envía desde la página de esta API.
const ORIGEN_API = `http://${HOST}:${PORT}`;

// Comprueba quién hace la petición antes de atenderla.
function comprobarPeticion(request, response, next) {
  // Solo se responde a esta dirección. Protege del DNS rebinding.
  if (request.headers.host !== `${HOST}:${PORT}`) {
    response.status(403).end();
    return;
  }

  // La página de esta API puede hacer peticiones.
  // Cualquier otra web se rechaza. Sin Origin se atiende, como con curl.
  const origen = request.headers.origin;
  if (origen !== undefined && origen !== ORIGEN_API) {
    response.status(403).end();
    return;
  }

  next();
}

// Crea la página de documentación en /docs a partir de las rutas.
function montarDocumentacion(app) {
  const datos = new DocumentBuilder()
    .setTitle("API de usuarios")
    .setDescription("Crea, busca, modifica y borra usuarios.")
    .build();
  const documento = SwaggerModule.createDocument(app, datos);
  SwaggerModule.setup("docs", app, documento);
}

// logger: false quita los avisos de Nest de la terminal.
const app = await NestFactory.create(AppModule, { logger: false });

// La comprobación va primero para que también proteja la página.
app.use(comprobarPeticion);
montarDocumentacion(app);

// Arranca la API y avisa si no ha podido hacerlo.
try {
  await app.listen(PORT, HOST);
  console.log(`API de Nest: http://${HOST}:${PORT}`);
  console.log(`Documentación: http://${HOST}:${PORT}/docs`);
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
