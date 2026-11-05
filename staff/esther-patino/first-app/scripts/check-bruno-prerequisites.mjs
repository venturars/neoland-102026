const HTTP_ORIGIN = "http://127.0.0.1:3001";
const SQL_ORIGIN = "http://127.0.0.1:3000/execute";

async function checkHttpClient() {
  try {
    const response = await fetch(`${HTTP_ORIGIN}/users`, {
      signal: AbortSignal.timeout(3000),
    });
    if (response.status === 500) {
      console.error(
        "El cliente HTTP responde en 3001 pero la base devuelve 500.",
      );
      console.error(
        "Arranca la base en otra terminal: pnpm server (desde first-app).",
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("No hay cliente HTTP en http://127.0.0.1:3001.");
    console.error("Desde first-app, en otra terminal: pnpm http");
    console.error("Para 01-sql-online también hace falta: pnpm server");
    process.exit(1);
  }
}

async function checkSqlServer() {
  try {
    const response = await fetch(SQL_ORIGIN, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        method: "all",
        sql: "SELECT 1 AS ok",
        params: {},
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) {
      console.error("La base en 3000 no responde bien.");
      console.error("Arranca: pnpm server (desde first-app).");
      process.exit(1);
    }
  } catch (error) {
    console.error("No hay servidor SQL en http://127.0.0.1:3000.");
    console.error("Arranca: pnpm server (desde first-app).");
    process.exit(1);
  }
}

await checkHttpClient();
await checkSqlServer();
