import { listUsers } from "./list-users.js";

const LABELS = new Set(["women", "men", "undefined"]);

function parseLabel(text) {
  const word = String(text ?? "")
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase();
  if (LABELS.has(word)) {
    return word;
  }
  return "undefined";
}

async function decideName(name) {
  const model = process.env.OLLAMA_MODEL || "nimble-v3";
  let response;
  try {
    response = await fetch("http://127.0.0.1:11434/v1/systemone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        state: { name },
        questions: {
          gender: {
            type: "choice",
            instructions:
              "Classify this first name. Examples: Ada is women, Juan is men, Alex is undefined, María is women.",
            criteria: {
              women: "usually a woman's name",
              men: "usually a man's name",
              undefined: "unclear or unisex",
            },
          },
        },
      }),
    });
  } catch {
    throw new Error("Could not classify the user");
  }
  if (!response.ok) {
    throw new Error("Could not classify the user");
  }
  const data = await response.json();
  return parseLabel(data.answers?.gender?.choice);
}

export async function listGenderGuesses({ decide = decideName } = {}) {
  const users = listUsers();
  const rows = [];
  for (const user of users) {
    let gender;
    try {
      gender = parseLabel(await decide(user.name));
    } catch {
      throw new Error("Could not classify the user");
    }
    rows.push({ name: user.name, gender });
  }
  return rows;
}

export async function countUsersByGender({ decide } = {}) {
  const rows = await listGenderGuesses({ decide });
  const counts = { women: 0, men: 0, undefined: 0 };
  for (const row of rows) {
    counts[row.gender] += 1;
  }
  return counts;
}
