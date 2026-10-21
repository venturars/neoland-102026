import { findAll } from "../queries/users.js";

const ollamaChatUrl = "http://127.0.0.1:11434/api/chat";
const modelTag = "llama3.2:latest";
const classifierTimeoutMs = 30000;

// The examples keep the reply to one word.
const classifyPrompt = `Classify this person's name as male or female.
Reply with one word: male, female, or undefined.
Use undefined when you are not sure.

John: male
Mary: female
Alex: undefined

Name: `;

function labelFromReply(content) {
  const firstWord = content.trim().toLowerCase().split(/\s+/)[0];
  const word = firstWord.replace(/[^a-z]/g, "");

  if (word === "male" || word === "female") {
    return word;
  }

  // Any other word means the model is not sure.
  return "undefined";
}

async function askGender(name) {
  let response;

  try {
    response = await fetch(ollamaChatUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(classifierTimeoutMs),
      body: JSON.stringify({
        model: modelTag,
        stream: false,
        options: { temperature: 0 },
        messages: [{ role: "user", content: classifyPrompt + name }],
      }),
    });
  } catch {
    throw new Error("The classifier failed.");
  }

  if (!response.ok) {
    throw new Error("The classifier failed.");
  }

  let body;

  try {
    body = await response.json();
  } catch {
    throw new Error("The classifier failed.");
  }

  if (
    !body.message ||
    typeof body.message.content !== "string" ||
    body.message.content.trim() === ""
  ) {
    throw new Error("The classifier failed.");
  }

  return labelFromReply(body.message.content);
}

export async function countUsersByGender() {
  let users;

  try {
    users = findAll();
  } catch {
    throw new Error("The database failed.");
  }

  if (users.length === 0) {
    return { male: 0, female: 0, undefined: 0 };
  }

  const counts = { male: 0, female: 0, undefined: 0 };

  for (const user of users) {
    const label = await askGender(user.name);
    counts[label] += 1;
  }

  return counts;
}
