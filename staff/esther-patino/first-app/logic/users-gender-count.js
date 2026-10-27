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
    return { women: 0, men: 0, undefinedUser: 0 };
  }

  const client = new OpenAI({
    baseURL: "http://127.0.0.1:11434/v1",
    apiKey: "ollama",
  });

  let women = 0;
  let men = 0;
  let undefinedUser = 0;

  for (let start = 0; start < users.length; start += 6) {
    const names = users.slice(start, start + 6).map((user) => user.name);

    let message;

    try {
      const completion = await client.chat.completions.create({
        model: MODEL,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: "Carmen\nLucia\nJavier\nPablo\nKim",
          },
          {
            role: "assistant",
            content: "women\nwomen\nmen\nmen\nundefined",
          },
          { role: "user", content: names.join("\n") },
        ],
      });

      message = completion.choices[0]?.message?.content;
    } catch {
      throw new Error("Could not classify the users");
    }

    if (typeof message !== "string" || message.trim() === "") {
      undefinedUser += names.length;
      continue;
    }

    const lines = message.trim().split("\n");

    if (lines.length !== names.length) {
      undefinedUser += names.length;
      continue;
    }

    for (const line of lines) {
      const value = line.trim();

      if (value === "women") {
        women += 1;
      } else if (value === "men") {
        men += 1;
      } else {
        undefinedUser += 1;
      }
    }
  }

  return { women, men, undefinedUser };
}
