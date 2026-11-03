export function sendHtml(response, statusCode, html) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(html);
}

export function redirectTo(response, location) {
  response.statusCode = 302;
  response.setHeader("Location", location);
  response.setHeader("Cache-Control", "no-store");
  response.end();
}
