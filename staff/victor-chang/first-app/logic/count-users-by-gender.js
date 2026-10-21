import { AppError, SystemError } from "./errors.js";
import * as users from "../queries/users.js";

const MODEL = "llama3.2";
const AI_URL = "http://127.0.0.1:11434/v1/chat/completions";
const BATCH_SIZE = 6;

const SYSTEM_PROMPT = [
  "The user sends first names, one per line.",
  "Answer genders with one value per name, in the same order.",
  "Each value is women, men or undefined.",
  "Judge only by the name.",
].join("\n");

const EXAMPLES = [
  { name: "Carmen", gender: "women" },
  { name: "Lucia", gender: "women" },
  { name: "Javier", gender: "men" },
  { name: "Pablo", gender: "men" },
  { name: "Kim", gender: "undefined" },
];

const RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "genders",
    strict: true,
    schema: {
      type: "object",
      properties: {
        genders: {
          type: "array",
          items: { type: "string", enum: ["women", "men", "undefined"] },
        },
      },
      required: ["genders"],
      additionalProperties: false,
    },
  },
};

export async function countUsersByGender() {
  try {
    // 3. Apply: read the names and count them by gender
    const names = users.findAll().map((user) => user.name);
    const count = { women: 0, men: 0, genderUndefined: 0 };

    if (names.length === 0) {
      return count;
    }

    const exampleMessages = EXAMPLES.flatMap((example) => [
      { role: "user", content: example.name },
      {
        role: "assistant",
        content: JSON.stringify({ genders: [example.gender] }),
      },
    ]);

    for (let start = 0; start < names.length; start += BATCH_SIZE) {
      const batch = names.slice(start, start + BATCH_SIZE);

      const response = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0,
          response_format: RESPONSE_FORMAT,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...exampleMessages,
            { role: "user", content: batch.join("\n") },
          ],
        }),
      });
      if (!response.ok) {
        throw new SystemError(
          "Could not classify the users",
          {},
          { cause: `AI answered with status ${response.status}` },
        );
      }

      // An answer that cannot be read is not a failure: the batch counts as undefined
      const genders = await readGenders(response);

      if (!Array.isArray(genders) || genders.length !== batch.length) {
        count.genderUndefined += batch.length;
        continue;
      }

      for (const gender of genders) {
        if (gender === "women") {
          count.women += 1;
        } else if (gender === "men") {
          count.men += 1;
        } else {
          count.genderUndefined += 1;
        }
      }
    }

    // 4. Return the three numbers
    return count;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new SystemError("Could not classify the users", {}, { cause: error });
  }
}

async function readGenders(response) {
  try {
    const body = await response.json();
    const content = body.choices[0].message.content;
    return JSON.parse(content).genders;
  } catch {
    return null;
  }
}
