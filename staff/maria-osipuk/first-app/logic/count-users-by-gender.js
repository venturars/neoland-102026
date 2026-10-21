import { listUserRows } from "../queries/users.js";

export async function countUsersByGender() {
  // This operation takes no input. It counts the users already stored,
  // one row at a time, using each name exactly as it was saved.
  let rows;

  try {
    rows = listUserRows();
  } catch {
    throw new Error("Unable to list users");
  }

  // An empty table is a valid result. Return the three zeros here,
  // before any call to the model, so Ollama is not contacted at all.
  if (rows.length === 0) {
    return {
      female: 0,
      male: 0,
      undefined: 0,
    };
  }

  // Keep this key order: female, then male, then undefined.
  // Each row adds one to exactly one of these numbers.
  const counts = {
    female: 0,
    male: 0,
    undefined: 0,
  };

  for (const row of rows) {
    // Ask the local model about this row's name only.
    // If that call cannot be read, stop the whole count.
    // A partial object must not be returned to the client.
    const gender = await classifyName(row.name);

    if (gender === "female" || gender === "male") {
      counts[gender] = counts[gender] + 1;
    } else {
      // Any other text is still a successful classification.
      // It is not an error: it belongs in undefined.
      counts.undefined = counts.undefined + 1;
    }
  }

  return counts;
}

async function classifyName(name) {
  // The last line is the stored name. Do not trim it and do not
  // change its letters: the model must see the same text as SQLite.
  const prompt =
    "Classify this person's name into one gender category.\n" +
    "Reply with JSON only. The gender value must be exactly female, male, or undefined.\n" +
    "Use undefined when the name is not clearly female or male.\n" +
    "Do not add any other field.\n" +
    "\n" +
    "Name:\n" +
    name;

  // fetch is built into Node. Ollama listens on this local address.
  // There is no new layer and no new dependency for this call.
  let response;

  try {
    response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma4",
        stream: false,
        format: "json",
        prompt,
      }),
    });
  } catch {
    throw new Error("Unable to classify names");
  }

  // A connection that answers with an error status is the same failure
  // as a connection that never answers. Do not continue the count.
  if (!response.ok) {
    throw new Error("Unable to classify names");
  }

  let body;

  try {
    body = await response.json();
  } catch {
    throw new Error("Unable to classify names");
  }

  // Ollama puts the model's text in response. format "json" means
  // that text should itself be a JSON string, not an object yet.
  if (typeof body.response !== "string") {
    throw new Error("Unable to classify names");
  }

  let classification;

  try {
    classification = JSON.parse(body.response);
  } catch {
    throw new Error("Unable to classify names");
  }

  // gender must be text on a plain object. A missing field, a number,
  // an array, or a value that is not an object stops the count.
  if (
    classification === null ||
    typeof classification !== "object" ||
    Array.isArray(classification) ||
    typeof classification.gender !== "string"
  ) {
    throw new Error("Unable to classify names");
  }

  return classification.gender;
}
