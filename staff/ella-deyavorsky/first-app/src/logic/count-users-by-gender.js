import OpenAI from "openai";
import { findAll } from "../queries/users.js";

// Ollama's OpenAI-style endpoint. Only this one accepts `strict: true`.
// Ollama ignores the API key, but the library needs one.
const client = new OpenAI({
  baseURL: "http://127.0.0.1:11434/v1",
  apiKey: "ollama",
  timeout: 30000,
  maxRetries: 0,
});
const modelTag = "llama3.2:latest";

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
  const numberedNames = names.map((name, index) => `${index + 1}. ${name}`);
  const nameList = numberedNames.join("\n");

  let completion;

  try {
    completion = await client.chat.completions.create({
      model: modelTag,
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
    });
  } catch {
    throw new Error("The classifier failed.");
  }

  // From here on, Ollama did answer. A bad answer returns null:
  // the caller counts that group as undefined and goes on.
  const firstChoice = completion.choices[0];
  let message;
  if (firstChoice !== undefined) {
    if (firstChoice !== null) {
      message = firstChoice.message;
    }
  }
  let content;
  if (message !== undefined) {
    if (message !== null) {
      content = message.content;
    }
  }

  const contentIsText = typeof content === "string";
  if (contentIsText === false) {
    return null;
  }
  const trimmedContent = content.trim();
  if (trimmedContent === "") {
    return null;
  }

  // The answer is JSON text, so we turn it into an object.
  let answer;

  try {
    answer = JSON.parse(content);
  } catch {
    return null;
  }

  // One label per name. Anything else would give a wrong count.
  const genders = answer.genders;
  const gendersIsList = Array.isArray(genders);
  if (gendersIsList === false) {
    return null;
  }
  const sameLength = genders.length === names.length;
  if (sameLength === false) {
    return null;
  }

  return genders;
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
    const group = users.slice(start, start + batchSize);
    const names = group.map((user) => user.name);

    const labels = await askGenders(names);

    // A bad answer: every name of this group counts as undefined.
    if (labels === null) {
      counts.undefined += names.length;
      continue;
    }

    for (const label of labels) {
      let isKnownLabel = false;
      if (label === "male") {
        isKnownLabel = true;
      }
      if (label === "female") {
        isKnownLabel = true;
      }
      if (isKnownLabel) {
        counts[label] += 1;
      } else {
        counts.undefined += 1;
      }
    }
  }

  return counts;
}
