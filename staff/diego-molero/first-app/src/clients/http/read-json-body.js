const MAX_BODY_BYTES = 1024 * 1024;

// Acumula como máximo 1 MiB y valida que el cuerpo sea JSON en UTF-8.
export function readJsonBody(request) {
  const contentType = request.headers["content-type"] ?? "";
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/iu.test(contentType)) {
    request.resume();
    throw new Error("Se necesita JSON.");
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;
    let tooLarge = false;
    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      if (!tooLarge) {
        chunks.push(chunk);
      }
    });
    request.on("error", reject);
    request.on("end", () => {
      if (tooLarge) {
        reject(new Error("El cuerpo es demasiado grande."));
        return;
      }
      try {
        const text = new TextDecoder("utf-8", { fatal: true }).decode(
          Buffer.concat(chunks),
        );
        if (text.trim() === "") {
          throw new Error("JSON no válido.");
        }
        resolve(JSON.parse(text));
      } catch {
        reject(new Error("JSON no válido."));
      }
    });
  });
}
