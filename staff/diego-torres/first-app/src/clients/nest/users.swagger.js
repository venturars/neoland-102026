// Lo que explica la página de documentación sobre los datos de la API.
// Swagger no puede deducirlo porque aquí no hay TypeScript.

// Un usuario, tal como lo devuelve la API.
export const USUARIO = {
  type: "object",
  properties: {
    id: { type: "integer", example: 1 },
    name: { type: "string", example: "Ana" },
    email: { type: "string", example: "ana@ejemplo.com" },
    createdAt: { type: "string", example: "2026-11-05 10:00:00" },
    updatedAt: { type: "string", example: "2026-11-05 10:00:00" },
  },
};

// Una lista de usuarios. Puede estar vacía.
export const LISTA_USUARIOS = {
  type: "array",
  items: USUARIO,
};

// Lo que hace falta para crear un usuario.
export const CREAR_USUARIO = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string", example: "Ana" },
    email: { type: "string", example: "ana@ejemplo.com" },
  },
};

// Lo que se puede modificar. Lo que no llega conserva su valor.
export const MODIFICAR_USUARIO = {
  type: "object",
  properties: {
    name: { type: "string", example: "Ana" },
    email: { type: "string", example: "ana@ejemplo.com" },
  },
};

// Cuántos usuarios hay de cada género.
export const RECUENTO = {
  type: "object",
  properties: {
    women: { type: "integer", example: 1 },
    men: { type: "integer", example: 1 },
    genderUndefined: { type: "integer", example: 0 },
  },
};

// La forma de cualquier fallo: solo un mensaje.
const ERROR = {
  type: "object",
  properties: {
    message: { type: "string", example: "User not found" },
  },
};

// Los fallos que puede dar una ruta, listos para usar en el controlador.
export const FALLO_400 = {
  status: 400,
  description: "El dato no vale",
  schema: ERROR,
};
export const FALLO_404 = {
  status: 404,
  description: "El usuario no existe",
  schema: ERROR,
};
export const FALLO_409 = {
  status: 409,
  description: "El email ya está en uso",
  schema: ERROR,
};
export const FALLO_500 = {
  status: 500,
  description: "No se ha podido hacer la acción",
  schema: ERROR,
};
