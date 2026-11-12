import { listUsers } from "./list-users.js";

const MODEL = "nimble-v3";

const CRITERIA = {
  women: "The name is usually used for a woman.",
  man: "The name is usually used for a man.",
  undefined: "The name can be used for either, or it is unclear.",
};

function questionsFor(names) {
  const questions = {};

  for (let index = 0; index < names.length; index += 1) {
    questions[`name${index}`] = {
      type: "choice",
      instructions: `Classify the first name on line ${index + 1} of the state.`,
      criteria: CRITERIA,
    };
  }

  return questions;
}

function labelsFor(data, total) {
  const unknown = Array(total).fill("undefined");
  const answers = data?.answers;

  if (!answers || typeof answers !== "object") {
    return unknown;
  }

  return unknown.map((_, index) => {
    const choice = answers[`name${index}`]?.choice;

    if (choice === "women" || choice === "man" || choice === "undefined") {
      return choice;
    }

    return "undefined";
  });
}

/**
 * Counts stored names as women, man, or undefined.
 */
export async function usersGender() {
  let users;

  try {
    users = await listUsers();
  } catch {
    throw new Error("no se han podido clasificar usuarios");
  }

  const counts = { women: 0, man: 0, undefined: 0 };

  if (users.length === 0) {
    return counts;
  }

  for (let start = 0; start < users.length; start += 6) {
    const batch = users.slice(start, start + 6);
    const names = batch.map((user) => user.name);
    let response;

    try {
      response = await fetch("http://127.0.0.1:11434/v1/systemone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          state: names.join("\n"),
          questions: questionsFor(names),
        }),
      });
    } catch {
      throw new Error("no se han podido clasificar usuarios");
    }

    if (!response.ok) {
      throw new Error("no se han podido clasificar usuarios");
    }

    let data;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const labels = labelsFor(data, names.length);

    for (const label of labels) {
      if (label === "women") {
        counts.women += 1;
      } else if (label === "man") {
        counts.man += 1;
      } else {
        counts.undefined += 1;
      }
    }
  }

  return counts;
}
