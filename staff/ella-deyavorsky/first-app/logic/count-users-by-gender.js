import { findAll } from "../queries/users.js";

// Ollama's OpenAI-style endpoint. Only this one accepts `strict: true`.
const ollamaChatUrl = "http://127.0.0.1:11434/v1/chat/completions";
const modelTag = "llama3.2:latest";
const classifierTimeoutMs = 30000;

// How many names go in one request.
const batchSize = 6;

// The examples show the model what each label means.
const classifyPrompt = `Classify each person's name as male, female, or undefined.
Use undefined when you are not sure.
Give one label per name, in the same order as the names.

John: male
Mary: female
Alex: undefined

Names:
`;

// The model must answer { "genders": [...] } and nothing else.
// Each label can only be male, female, or undefined.
const genderSchema = {
  type: "object",
  properties: {
    genders: {
      type: "array",
      items: { type: "string", enum: ["male", "female", "undefined"] },
    },
  },
  required: ["genders"],
  additionalProperties: false,
};

async function askGenders(names) {
  // Number the names so the model keeps the order: "1. John", "2. Mary"...
  const nameList = names
    .map((name, index) => `${index + 1}. ${name}`)
    .join("\n");

  let response;

  try {
    response = await fetch(ollamaChatUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(classifierTimeoutMs),
      body: JSON.stringify({
        model: modelTag,
        stream: false,
        temperature: 0,
        messages: [{ role: "user", content: classifyPrompt + nameList }],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "gender_list",
            strict: true,
            schema: genderSchema,
          },
        },
      }),
    });
  } catch {
    throw new Error("The classifier failed.");
  }

  if (!response.ok) {
    throw new Error("The classifier failed.");
  }

  let body;

  try {
    body = await response.json();
  } catch {
    throw new Error("The classifier failed.");
  }

  if (
    !body.choices ||
    !body.choices[0] ||
    !body.choices[0].message ||
    typeof body.choices[0].message.content !== "string" ||
    body.choices[0].message.content.trim() === ""
  ) {
    throw new Error("The classifier failed.");
  }

  // The answer is JSON text, so we turn it into an object.
  let answer;

  try {
    answer = JSON.parse(body.choices[0].message.content);
  } catch {
    throw new Error("The classifier failed.");
  }

  // One label per name. Anything else would give a wrong count.
  if (
    !Array.isArray(answer.genders) ||
    answer.genders.length !== names.length
  ) {
    throw new Error("The classifier failed.");
  }

  return answer.genders;
}

export async function countUsersByGender() {
  let users;

  try {
    users = findAll();
  } catch {
    throw new Error("The database failed.");
  }

  if (users.length === 0) {
    return { male: 0, female: 0, undefined: 0 };
  }

  const counts = { male: 0, female: 0, undefined: 0 };

  // Take the users 6 at a time. The last group can be smaller.
  for (let start = 0; start < users.length; start += batchSize) {
    const names = users
      .slice(start, start + batchSize)
      .map((user) => user.name);

    const labels = await askGenders(names);

    for (const label of labels) {
      if (label === "male" || label === "female") {
        counts[label] += 1;
      } else {
        counts.undefined += 1;
      }
    }
  }

  return counts;
}
