import OpenAI from "openai";
import { list } from "../queries/users.js";

const MODEL = "llama3.2";
const BATCH_SIZE = 6;

export async function usersGenderCount() {
  const client = new OpenAI({
    baseURL: "http://127.0.0.1:11434/v1",
    apiKey: "ollama",
  });

  let users;

  try {
    users = list();
  } catch {
    throw new Error("Could not list the users");
  }

  const result = { women: 0, men: 0, genderUndefined: 0 };

  if (users.length === 0) {
    return result;
  }

  for (let start = 0; start < users.length; start += BATCH_SIZE) {
    const names = [];

    for (
      let index = start;
      index < users.length && index < start + BATCH_SIZE;
      index += 1
    ) {
      names.push(users[index].name);
    }

    let completion;

    try {
      completion = await client.chat.completions.create({
        model: MODEL,
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "Classify each name. Return JSON with genders. One value per name, in the same order. Use women, men, or undefined.",
          },
          { role: "user", content: "Carmen" },
          { role: "assistant", content: '{ "genders": ["women"] }' },
          { role: "user", content: "Lucia" },
          { role: "assistant", content: '{ "genders": ["women"] }' },
          { role: "user", content: "Javier" },
          { role: "assistant", content: '{ "genders": ["men"] }' },
          { role: "user", content: "Pablo" },
          { role: "assistant", content: '{ "genders": ["men"] }' },
          { role: "user", content: "Kim" },
          { role: "assistant", content: '{ "genders": ["undefined"] }' },
          { role: "user", content: names.join("\n") },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "genders",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                genders: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["genders"],
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
      result.genderUndefined += names.length;
      continue;
    }

    const text = choice.message.content;

    let genders;
    try {
      const parsed = JSON.parse(text);
      genders = parsed.genders;
    } catch {
      genders = undefined;
    }

    const gendersIsArray = Array.isArray(genders);
    let sameCount = false;
    if (gendersIsArray) {
      const genderCount = genders.length;
      const batchCount = names.length;
      sameCount = genderCount === batchCount;
    }
    if (!sameCount) {
      result.genderUndefined += names.length;
    } else {
      for (const gender of genders) {
        if (gender === "women") {
          result.women += 1;
        } else if (gender === "men") {
          result.men += 1;
        } else {
          result.genderUndefined += 1;
        }
      }
    }
  }

  return {
    women: result.women,
    men: result.men,
    genderUndefined: result.genderUndefined,
  };
}
