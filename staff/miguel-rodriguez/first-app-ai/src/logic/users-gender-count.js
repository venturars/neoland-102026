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

  const counts = { women: 0, men: 0, genderUndefined: 0 };
  const userCount = users.length;
  const usersAreEmpty = userCount === 0;
  if (usersAreEmpty) {
    return counts;
  }

  const client = new OpenAI({
    baseURL: "http://127.0.0.1:11434/v1",
    apiKey: "ollama",
  });

  for (let offset = 0; offset < userCount; offset += 6) {
    const batchEnd = offset + 6;
    const batch = users.slice(offset, batchEnd);
    let response;
    try {
      const names = batch.map((user) => user.name);
      const joinedNames = names.join("\n");
      const prompt =
        "Classify the following names in order. Follow the demonstrated labels consistently. Use undefined when a name is ambiguous or you are uncertain. Return one classification per name. Use undefined for names commonly used by more than one gender, including shortened forms shared across genders, even when one association is more common. Do not choose a category merely because it is the most likely.\n\n" +
        joinedNames;
      const request = {
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
          {
            role: "user",
            content: prompt,
          },
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
      };
      const chat = client.chat;
      const completions = chat.completions;
      response = await completions.create(request);
    } catch {
      throw new Error("Could not classify the users");
    }

    let genders;
    try {
      const choices = response?.choices;
      const firstChoice = choices?.[0];
      const message = firstChoice?.message;
      const content = message?.content;
      const parsedResponse = JSON.parse(content);
      genders = parsedResponse?.genders;
    } catch {
      const batchLength = batch.length;
      counts.genderUndefined += batchLength;
      continue;
    }

    const gendersAreArray = Array.isArray(genders);
    if (!gendersAreArray) {
      const batchLength = batch.length;
      counts.genderUndefined += batchLength;
      continue;
    }

    const genderCount = genders.length;
    const batchLength = batch.length;
    const genderCountIsWrong = genderCount !== batchLength;
    if (genderCountIsWrong) {
      counts.genderUndefined += batchLength;
      continue;
    }

    for (const gender of genders) {
      const genderIsWoman = gender === "women";
      if (genderIsWoman) {
        counts.women++;
        continue;
      }

      const genderIsMan = gender === "men";
      if (genderIsMan) {
        counts.men++;
      } else {
        counts.genderUndefined++;
      }
    }
  }

  return counts;
}
