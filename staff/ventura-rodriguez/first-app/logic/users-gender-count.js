import OpenAI from "openai";
import { findAll } from "../queries/users.js";

const MODEL = "llama3.2";

export async function usersGenderCount() {
  let users;
  try {
    users = findAll();
  } catch {
    throw new Error("Could not classify the users");
  }

  if (users.length === 0) {
    return { women: 0, men: 0, genderUndefined: 0 };
  }

  const openai = new OpenAI({
    baseURL: "http://127.0.0.1:11434/v1",
    apiKey: "ollama",
  });

  let women = 0;
  let men = 0;
  let genderUndefined = 0;

  for (let start = 0; start < users.length; start += 6) {
    const batch = users.slice(start, start + 6);
    const nameList = batch.map((user) => user.name);
    const names = nameList.join("\n");

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: MODEL,
        temperature: 0,
        messages: [
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
          { role: "user", content: names },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "genders",
            strict: true,
            schema: {
              type: "object",
              properties: {
                genders: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["women", "men", "undefined"],
                  },
                },
              },
              required: ["genders"],
              additionalProperties: false,
            },
          },
        },
      });
    } catch {
      throw new Error("Could not classify the users");
    }

    const choice = completion.choices[0];

    let missingMessage = false;
    if (!choice) {
      missingMessage = true;
    }
    if (choice) {
      if (!choice.message) {
        missingMessage = true;
      }
    }
    if (missingMessage) {
      genderUndefined += batch.length;
      continue;
    }

    const text = choice.message.content;

    let emptyText = false;
    if (typeof text !== "string") {
      emptyText = true;
    }
    if (typeof text === "string") {
      const trimmedText = text.trim();
      if (trimmedText === "") {
        emptyText = true;
      }
    }
    if (emptyText) {
      genderUndefined += batch.length;
      continue;
    }

    let genders;
    try {
      const parsed = JSON.parse(text);
      genders = parsed.genders;
    } catch {
      genderUndefined += batch.length;
      continue;
    }

    const gendersIsArray = Array.isArray(genders);
    let sameCount = false;
    if (gendersIsArray) {
      const genderCount = genders.length;
      const batchCount = batch.length;
      sameCount = genderCount === batchCount;
    }
    if (!sameCount) {
      genderUndefined += batch.length;
      continue;
    }

    for (const word of genders) {
      if (word === "women") {
        women += 1;
      } else if (word === "men") {
        men += 1;
      } else {
        genderUndefined += 1;
      }
    }
  }

  return { women, men, genderUndefined };
}
