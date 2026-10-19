export function handleClientError(error) {
  const payload = {
    error: true,
    name: error?.name ?? "Error",
    message: error?.message ?? String(error),
  };

  if (error?.code != null) {
    payload.code = error.code;
  }

  console.log(JSON.stringify(payload));
  process.exitCode = 1;
}
