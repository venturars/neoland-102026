import { AppError, SystemError } from "./errors.js";
import * as users from "../queries/users.js";

const MODEL = "llama3.2";
const AI_URL = "http://127.0.0.1:11434/v1/chat/completions";
const BATCH_SIZE = 6;

const SYSTEM_PROMPT = [
  "You classify first names by gender.",
  "The user sends first names, one per line.",
  "Answer with exactly one word per name, one per line, in the same order:",
  "women if the name is mostly used by women,",
  "men if the name is mostly used by men,",
  "undefined if it is used by both or you are not sure.",
  "Write nothing else.",
].join("\n");

const EXAMPLE_NAMES = ["Carmen", "Javier", "Kim", "Lucia", "Pablo", "Sam"];
const EXAMPLE_GENDERS = [
  "women",
  "men",
  "undefined",
  "women",
  "men",
  "undefined",
];

export async function countUsersByGender() {
  try {
    // 3. Apply: read the names and count them by gender
    const names = users.findAll().map((user) => user.name);
    const count = { women: 0, men: 0, genderUndefined: 0 };

    if (names.length === 0) {
      return count;
    }

    for (let start = 0; start < names.length; start += BATCH_SIZE) {
      const batch = names.slice(start, start + BATCH_SIZE);

      const response = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: EXAMPLE_NAMES.join("\n") },
            { role: "assistant", content: EXAMPLE_GENDERS.join("\n") },
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

      // A body that is not JSON is not a failure: the batch counts as undefined
      const body = await response.json().catch(() => null);
      const content = body?.choices?.[0]?.message?.content;
      const lines =
        typeof content === "string"
          ? content
              .split("\n")
              .map((line) => line.trim().toLowerCase())
              .filter((line) => line !== "")
          : [];

      if (lines.length !== batch.length) {
        count.genderUndefined += batch.length;
        continue;
      }

      for (const line of lines) {
        if (line === "women") {
          count.women += 1;
        } else if (line === "men") {
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
