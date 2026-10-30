import OpenAI from "openai";

const MODEL = "llama3.2";
const BATCH_SIZE = 6;
const BASE_URL = "http://127.0.0.1:11434/v1";
const API_KEY = "ollama";

const client = new OpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
});

export async function usersGenderCount(names) {
  let women = 0;
  let men = 0;
  let genderUndefined = 0;

  let namesMissing = false;
  if (!names) {
    namesMissing = true;
  }
  if (names) {
    if (names.length === 0) {
      namesMissing = true;
    }
  }
  if (namesMissing) {
    return { women: 0, men: 0, genderUndefined: 0 };
  }

  for (let start = 0; start < names.length; start = start + BATCH_SIZE) {
    const batch = names.slice(start, start + BATCH_SIZE);
    const namesText = batch.join("\n");
    let answer;

    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Classify the gender of each name. Reply with one word per name, in the same order, one per line: women, men, or undefined.",
          },
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
          { role: "user", content: namesText },
        ],
      });

      const firstChoice = completion.choices[0];
      let message;
      if (firstChoice) {
        message = firstChoice.message;
      }
      let content = "";
      if (message) {
        content = message.content;
      }
      answer = content;
    } catch {
      answer = "";
    }

    let answerText = "";
    if (answer !== undefined) {
      if (answer !== null) {
        answerText = String(answer);
      }
    }
    const trimmedAnswer = answerText.trim();
    const lines = trimmedAnswer.split("\n");

    for (let index = 0; index < batch.length; index = index + 1) {
      const rawLine = lines[index];
      let lineText = "";
      if (rawLine !== undefined) {
        if (rawLine !== null) {
          lineText = String(rawLine);
        }
      }
      const trimmedGender = lineText.trim();
      const gender = trimmedGender.toLowerCase();

      if (gender === "women") {
        women = women + 1;
      } else if (gender === "men") {
        men = men + 1;
      } else {
        genderUndefined = genderUndefined + 1;
      }
    }
  }

  return { women, men, genderUndefined };
}
