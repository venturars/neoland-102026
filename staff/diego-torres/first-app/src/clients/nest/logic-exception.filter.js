// Herramientas de Nest para capturar los fallos.
import { Catch, HttpException } from "@nestjs/common";

// Estado HTTP de cada error de las reglas.
const ESTADOS = {
  "Name is empty": 400,
  "Email is invalid": 400,
  "Email is already used": 409,
  "User not found": 404,
};

// Mensaje de fallo de cada acción, según el método de la petición.
const FALLOS = {
  POST: "Could not create the user",
  PATCH: "Could not update the user",
  DELETE: "Could not delete the user",
};

// Elige el mensaje de fallo de la acción que se estaba haciendo.
function elegirFallo(request) {
  // Con GET, la ruta dice si se pedía la lista o un solo usuario.
  if (request.method === "GET" && request.params?.id === undefined) {
    return "Could not list the users";
  }
  if (request.method === "GET") {
    return "Could not find the user";
  }
  return FALLOS[request.method];
}

// Busca el estado de un error que viene de la propia petición.
// Por ejemplo: una ruta que no existe o un JSON mal escrito.
function buscarEstadoDePeticion(error) {
  if (error instanceof HttpException) {
    return error.getStatus();
  }

  // El lector de JSON avisa de sus errores con un estado 4xx.
  if (error?.status >= 400 && error?.status < 500) {
    return error.status;
  }
  return undefined;
}

// Catch() sin nada dentro significa: captura cualquier fallo.
@Catch()
export class LogicExceptionFilter {
  catch(error, host) {
    const http = host.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    // Si es un error de las reglas, se responde su estado y su mensaje.
    const estado = ESTADOS[error?.message];
    if (estado !== undefined) {
      response.status(estado).json({ message: error.message });
      return;
    }

    // Si el problema es la petición, se responde su estado, sin cuerpo.
    const estadoDePeticion = buscarEstadoDePeticion(error);
    if (estadoDePeticion !== undefined) {
      response.status(estadoDePeticion).end();
      return;
    }

    // Si no conocemos el error, respondemos que la acción ha fallado.
    const message = elegirFallo(request);
    response.status(500).json({ message });
  }
}
