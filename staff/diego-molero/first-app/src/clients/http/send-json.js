// Mantiene las respuestas JSON con UTF-8 y sin envoltorios de resultado.
export function sendJson(response, status, data) {
  response.statusCode = status;
  if (status === 204) {
    response.end();
    return;
  }
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(data));
}
