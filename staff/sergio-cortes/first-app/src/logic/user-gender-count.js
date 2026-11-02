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
  } catch {
    throw new DatabaseError("Could not classify the users");
  }

  if (rows.length === 0) {
    return { woman: 0, man: 0, genderUndefined: 0 };
  }

  const names = [];

  for (const user of rows) {
    const alreadyListed = names.includes(user.name);

    if (!alreadyListed) {
      names.push(user.name);
    }
  }

  const openai = new OpenAI({
    apiKey: "ollama",
    baseURL: "http://127.0.0.1:11434/v1",
  });

  const genders = new Map();

  for (let index = 0; index < names.length; index += BATCH_SIZE) {
    const batchNames = names.slice(index, index + BATCH_SIZE);
    const batch = batchNames.join("\n");
    const batchNameSet = new Set(batchNames);
    const messages = [...EXAMPLES, { role: "user", content: batch }];

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

    const choices = completion?.choices;

    const choicesIsArray = Array.isArray(choices);
    let missingChoices = false;

    if (!choicesIsArray) {
      missingChoices = true;
    }

    if (choicesIsArray) {
      const choiceCount = choices.length;

      if (choiceCount === 0) {
        missingChoices = true;
      }
    }

    if (missingChoices) {
      continue;
    }

    const choice = choices[0];
    let message;

    let missingMessage = false;

    if (choice === undefined) {
      missingMessage = true;
    }

    if (choice !== undefined) {
      const choiceMessage = choice.message;

      if (choiceMessage === undefined) {
        missingMessage = true;
      }

      if (choiceMessage !== undefined) {
        if (choiceMessage === null) {
          missingMessage = true;
        }

        if (choiceMessage !== null) {
          message = choiceMessage.content;
        }
      }
    }

    if (missingMessage) {
      continue;
    }

    let emptyMessage = false;

    if (typeof message !== "string") {
      emptyMessage = true;
    }

    if (typeof message === "string") {
      if (message === "") {
        emptyMessage = true;
      }
    }

    if (emptyMessage) {
      continue;
    }

    let parsed;

    try {
      parsed = JSON.parse(message);
    } catch {
      continue;
    }

    let invalidParsed = false;

    if (parsed === null) {
      invalidParsed = true;
    }

    if (parsed !== null) {
      const parsedType = typeof parsed;

      if (parsedType !== "object") {
        invalidParsed = true;
      }
    }

    if (parsed !== null) {
      const classifications = parsed.classifications;
      const classificationsIsArray = Array.isArray(classifications);

      if (!classificationsIsArray) {
        invalidParsed = true;
      }
    }

    if (invalidParsed) {
      continue;
    }

    for (const item of parsed.classifications) {
      let invalidItem = false;

      if (item === null) {
        invalidItem = true;
      }

      if (item !== null) {
        const itemType = typeof item;

        if (itemType !== "object") {
          invalidItem = true;
        }
      }

      if (invalidItem) {
        continue;
      }

      let invalidGender = false;

      if (item.gender !== "women") {
        if (item.gender !== "men") {
          if (item.gender !== "undefined") {
            invalidGender = true;
          }
        }
      }

      if (invalidGender) {
        continue;
      }

      let invalidName = false;

      if (typeof item.name !== "string") {
        invalidName = true;
      }

      if (typeof item.name === "string") {
        const nameInBatch = batchNameSet.has(item.name);

        if (!nameInBatch) {
          invalidName = true;
        }
      }

      if (invalidName) {
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
