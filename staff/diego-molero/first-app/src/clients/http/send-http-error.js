const validationMessages = new Map([
  ["User ID is invalid", "El identificador de usuario no es válido."],
  ["Note ID is invalid", "El identificador de nota no es válido."],
  ["Input is invalid", "Los datos enviados no son válidos."],
  ["No changes provided", "Indica algún cambio antes de guardar."],
  ["Name is invalid", "Escribe un nombre válido."],
  ["Email is invalid", "Escribe un correo válido."],
  ["Note title is invalid", "Escribe un título para la nota."],
  ["Note content is invalid", "El contenido de la nota debe ser texto."],
]);

// Traduce errores conocidos sin exponer detalles internos del servidor.
export function sendHttpError(error, _request, response, next) {
  if (response.headersSent) {
    return next(error);
  }
  if (error.type === "entity.too.large") return response.status(413).json({ message: "El cuerpo es demasiado grande." });
  if (error instanceof SyntaxError && error.status === 400) return response.status(400).json({ message: "JSON no válido." });
  if (validationMessages.has(error.message)) {
    return response.status(400).json({ message: validationMessages.get(error.message) });
  }
  if (error.message === "User not found") {
    return response.status(404).json({ message: "El usuario ya no existe. Vuelve a elegirlo." });
  }
  if (error.message === "Note not found") {
    return response.status(404).json({ message: "La nota ya no existe. Vuelve al listado." });
  }
  if (error.message === "Email is already used") {
    return response.status(409).json({ message: "Ese correo ya pertenece a otro usuario." });
  }
  if (error.message === "JSON no válido.") {
    return response.status(400).json({ message: error.message });
  }
  if (error.message === "Se necesita JSON.") {
    return response.status(415).json({ message: error.message });
  }
  if (error.message === "El cuerpo es demasiado grande.") {
    return response.status(413).json({ message: error.message });
  }
  console.error(error);
  return response.status(500).json({ message: "No se pudo completar la operación." });
}
