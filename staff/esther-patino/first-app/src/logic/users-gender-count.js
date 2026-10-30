import OpenAI from "openai";
import { findAll } from "../queries/users.js";

const MODEL = "llama3.2";
const BASE_URL = "http://127.0.0.1:11434/v1";
const API_KEY = "ollama";
const TEMPERATURE = 0;
const BATCH_SIZE = 6;
const USER_ROLE = "user";
const ASSISTANT_ROLE = "assistant";
const EXAMPLE_NAMES = "Carmen\nLucia\nJavier\nPablo\nKim";
const EXAMPLE_GENDERS = "women\nwomen\nmen\nmen\nundefined";
const WOMEN = "women";
const MEN = "men";

export async function usersGenderCount() {
  let users;

  try {
    users = findAll();
  } catch {
    throw new Error("Could not classify the users");
  }

  if (users.length === 0) {
    return { women: 0, men: 0, undefinedUser: 0 };
  }

  const client = new OpenAI({
    baseURL: BASE_URL,
    apiKey: API_KEY,
  });

  let women = 0;
  let men = 0;
  let undefinedUser = 0;

  for (let start = 0; start < users.length; start += BATCH_SIZE) {
    const batch = users.slice(start, start + BATCH_SIZE);
    const names = batch.map((user) => user.name);

    let message;

    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        temperature: TEMPERATURE,
        messages: [
          {
            role: USER_ROLE,
            content: EXAMPLE_NAMES,
          },
          {
            role: ASSISTANT_ROLE,
            content: EXAMPLE_GENDERS,
          },
          { role: USER_ROLE, content: names.join("\n") },
        ],
      });

      const firstChoice = completion.choices[0];
      if (firstChoice === undefined || firstChoice === null) {
        message = undefined;
      } else if (
        firstChoice.message === undefined ||
        firstChoice.message === null
      ) {
        message = undefined;
      } else {
        message = firstChoice.message.content;
      }
    } catch {
      throw new Error("Could not classify the users");
    }

    if (typeof message !== "string") {
      undefinedUser += names.length;
      continue;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage === "") {
      undefinedUser += names.length;
      continue;
    }

    const lines = trimmedMessage.split("\n");

    if (lines.length !== names.length) {
      undefinedUser += names.length;
      continue;
    }

    for (const line of lines) {
      const value = line.trim();

      if (value === WOMEN) {
        women += 1;
      } else if (value === MEN) {
        men += 1;
      } else {
        undefinedUser += 1;
      }
    }
  }

  return { women, men, undefinedUser };
}
