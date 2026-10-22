import OpenAI, { APIConnectionError } from "openai";
import { DatabaseError } from "./errors.js";
import { findAll } from "../queries/user.js";

const MODEL = "llama3.2";
const BATCH_SIZE = 6;

const EXAMPLES = [
  { role: "user", content: "Carmen" },
  { role: "assistant", content: "women" },
  { role: "user", content: "Lucia" },
  { role: "assistant", content: "women" },
  { role: "user", content: "Javier" },
  { role: "assistant", content: "men" },
  { role: "user", content: "Pablo" },
  { role: "assistant", content: "men" },
  { role: "user", content: "Kim" },
  { role: "assistant", content: "undefined" },
];

const RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "gender_classifications",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["classifications"],
      properties: {
        classifications: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["name", "gender"],
            properties: {
              name: { type: "string" },
              gender: { type: "string", enum: ["women", "men", "undefined"] },
            },
          },
        },
      },
    },
  },
};

export async function usersGenderCount() {
  let rows;

  try {
    rows = findAll();
  } catch (error) {
    throw new DatabaseError("Could not classify the users");
  }

  if (rows.length === 0) {
    return { woman: 0, man: 0, genderUndefined: 0 };
  }

  const names = [];

  for (const user of rows) {
    if (!names.includes(user.name)) {
      names.push(user.name);
    }
  }

  const openai = new OpenAI({
    apiKey: "ollama",
    baseURL: "http://127.0.0.1:11434/v1",
  });

  const genders = new Map();

  for (let index = 0; index < names.length; index += BATCH_SIZE) {
    const batch = names.slice(index, index + BATCH_SIZE).join("\n");
    console.log('batch', batch);
    const messages = [
      ...EXAMPLES,
      { role: "user", content: batch },
    ];

    let completion;

    try {
      completion = await openai.chat.completions.create({
        model: MODEL,
        temperature: 0,
        messages,
        response_format: RESPONSE_FORMAT,
      });
    } catch (error) {
      if (error instanceof APIConnectionError) {
        throw new DatabaseError("Could not classify the users");
      }

      continue;
    }

    const choice = completion.choices[0];
    let message;

    if (
      choice !== undefined &&
      choice.message !== undefined &&
      choice.message !== null
    ) {
      message = choice.message.content;
    }

    console.log('message', message);

    if (typeof message !== "string" || message === "") {
      continue;
    }

    let parsed;

    try {
      parsed = JSON.parse(message);
    } catch (error) {
      continue;
    }

    if (
      parsed === null ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.classifications)
    ) {
      continue;
    }

    for (const item of parsed.classifications) {
      if (item === null || typeof item !== "object") {
        continue;
      }

      if (
        item.gender !== "women" &&
        item.gender !== "men" &&
        item.gender !== "undefined"
      ) {
        continue;
      }

      if (typeof item.name !== "string" || !batch.includes(item.name)) {
        continue;
      }

      genders.set(item.name, item.gender);
    }
  }

  const count = { woman: 0, man: 0, genderUndefined: 0 };

  for (const user of rows) {
    const gender = genders.get(user.name);

    if (gender === "women") {
      count.woman += 1;
    } else if (gender === "men") {
      count.man += 1;
    } else {
      count.genderUndefined += 1;
    }
  }

  return count;
}
