export async function readJsonBody(request) {
  let text = "";
  for await (const chunk of request) {
    text += chunk;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Body is not valid JSON");
  }
}
