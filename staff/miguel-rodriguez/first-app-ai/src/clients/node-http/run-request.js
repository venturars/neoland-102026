import { readFileSync } from "node:fs";
import Table from "cli-table3";

const ORIGIN = "http://127.0.0.1:3004";
const inputText = readFileSync(0, "utf8");
const input = JSON.parse(inputText);

try {
  const options = { method: input.method };
  const hasBody = input.body !== undefined;
  if (hasBody) {
    options.headers = { "content-type": "application/json" };
    options.body = JSON.stringify(input.body);
  }
  const url = `${ORIGIN}${input.path}`;
  const response = await fetch(url, options);
  const hasError = !response.ok;
  if (hasError) {
    const text = await response.text();
    let message;
    try {
      const result = JSON.parse(text);
      message = result.message;
    } catch {
      // A response without a JSON message is identified by its status.
    }
    const output = message || `HTTP ${response.status}`;
    console.log(output);
  } else if (response.status === 204) {
    console.log("No devuelve datos.");
  } else {
    const result = await response.json();
    const isList = Array.isArray(result);
    const rows = isList ? result : [result];
    const isEmpty = rows.length === 0;
    if (isEmpty) {
      console.log("No hay filas.");
    } else {
      const fields = ["id", "name", "email", "createdAt", "updatedAt"];
      const table = new Table({ head: fields, style: { head: ["cyan"] } });
      for (const row of rows) {
        const cells = fields.map((field) => row[field]);
        table.push(cells);
      }
      const output = table.toString();
      console.log(output);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
