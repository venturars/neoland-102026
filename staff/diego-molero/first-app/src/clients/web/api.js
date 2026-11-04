// El navegador habla JSON con las rutas HTTP locales y conserva el estado del error.
export async function api(path, method = "GET", body) {
  let response;
  try {
    response = await fetch(path, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("No se pudo conectar. Comprueba que el servidor sigue abierto.");
  }
  if (response.status === 204) return null;
  let data;
  try { data = await response.json(); } catch { throw new Error("El servidor devolvió una respuesta no válida."); }
  if (!response.ok) {
    const error = new Error(data.message || "No se pudo completar la operación.");
    error.status = response.status;
    throw error;
  }
  return data;
}
