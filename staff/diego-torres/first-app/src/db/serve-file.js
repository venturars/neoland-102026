import { readFile } from "node:fs/promises";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..");

// Del prefijo más largo al más corto. src/db/ no está, así que nunca se sirve.
const CARPETAS = [
  ["/logic/", join(SRC, "logic")],
  ["/queries/", join(SRC, "queries")],
  ["/", join(SRC, "clients", "web")],
];

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function noEncontrado(response) {
  response.writeHead(404);
  response.end();
}

export async function serveFile(response, pathname) {
  let ruta;
  try {
    ruta = decodeURIComponent(pathname);
  } catch {
    noEncontrado(response);
    return;
  }

  if (ruta === "/") {
    ruta = "/index.html";
  }

  const entrada = CARPETAS.find(([prefijo]) => ruta.startsWith(prefijo));
  const [prefijo, carpeta] = entrada;
  const fichero = resolve(carpeta, ruta.slice(prefijo.length));
  const tipo = TIPOS[extname(fichero)];

  // La ruta resuelta tiene que quedar dentro de su carpeta: así ../ no sale.
  if (!fichero.startsWith(carpeta + sep) || tipo === undefined) {
    noEncontrado(response);
    return;
  }

  let contenido;
  try {
    contenido = await readFile(fichero);
  } catch {
    noEncontrado(response);
    return;
  }

  response.writeHead(200, { "Content-Type": tipo });
  response.end(contenido);
}
