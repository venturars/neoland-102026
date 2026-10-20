import { findAll } from "../queries/users.js";

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

  const model = process.env.OLLAMA_MODEL || "nimble-v3";
  let women = 0;
  let men = 0;
  let genderUndefined = 0;

  for (let start = 0; start < users.length; start += 6) {
    const batch = users.slice(start, start + 6);
    const names = batch.map((user) => user.name);
    const questions = {};
    for (let index = 0; index < names.length; index += 1) {
      questions[`name${index}`] = {
        type: "choice",
        instructions:
          `Classify the first name in state.names[${index}]. ` +
          "Examples: Carmen is women, Lucia is women, Javier is men, " +
          "Pablo is men, Kim is undefined. " +
          "Reply with only women, men, or undefined.",
        criteria: {
          women: "usually a woman's name",
          men: "usually a man's name",
          undefined: "unclear or unisex",
        },
      };
    }

    let response;
    try {
      response = await fetch("http://127.0.0.1:11434/v1/systemone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          state: { names },
          questions,
        }),
      });
    } catch {
      throw new Error("Could not classify the users");
    }

    if (!response.ok) {
      throw new Error("Could not classify the users");
    }

    let data;
    try {
      data = await response.json();
    } catch {
      genderUndefined += batch.length;
      continue;
    }

    const answers = data?.answers;
    const choices = [];
    let missing = !answers || typeof answers !== "object";
    if (!missing) {
      for (let index = 0; index < names.length; index += 1) {
        const choice = answers[`name${index}`]?.choice;
        if (typeof choice !== "string" || choice.trim() === "") {
          missing = true;
          break;
        }
        choices.push(choice);
      }
    }

    if (missing || choices.length !== batch.length) {
      genderUndefined += batch.length;
      continue;
    }

    for (const word of choices) {
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
