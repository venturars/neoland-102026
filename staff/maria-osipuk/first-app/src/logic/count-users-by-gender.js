import OpenAI from "openai";
import { listUserRows } from "../queries/users.js";

export async function countUsersByGender() {
  // This operation takes no input. It counts the users already stored,
  // using each name exactly as it was saved.
  let rows;

  try {
    rows = listUserRows();
  } catch {
    throw new Error("Unable to list users");
  }

  // An empty table is a valid result. Return the three zeros here,
  // before any call to the model, so Ollama is not contacted at all.
  if (rows.length === 0) {
    return {
      female: 0,
      male: 0,
      undefined: 0,
    };
  }

  // The openai package is only the client. baseURL points it at the
  // local Ollama server instead of the OpenAI service.
  // The package requires apiKey, but Ollama does not read it.
  // "ollama" is a fixed placeholder, not a secret.
  const client = new OpenAI({
    baseURL: "http://127.0.0.1:11434/v1",
    apiKey: "ollama",
  });

  // Keep this key order: female, then male, then undefined.
  // Each row adds one to exactly one of these numbers.
  const counts = {
    female: 0,
    male: 0,
    undefined: 0,
  };

  // Send the stored names in parts of 6. slice copies the next part
  // and leaves the full list in place. The last part can be shorter.
  const BATCH_SIZE = 6;

  for (let start = 0; start < rows.length; start = start + BATCH_SIZE) {
    const batch = rows.slice(start, start + BATCH_SIZE);
    const names = [];

    for (const row of batch) {
      names.push(row.name);
    }

    // Ask the local model about this part only. If that call cannot
    // be read, stop the whole count. A partial object must not be returned.
    const genders = await classifyNames(client, names);

    for (const gender of genders) {
      let isFemaleOrMale = false;

      if (gender === "female") {
        isFemaleOrMale = true;
      }

      if (gender === "male") {
        isFemaleOrMale = true;
      }

      if (isFemaleOrMale) {
        counts[gender] = counts[gender] + 1;
      } else {
        // Any other text is still a successful classification.
        // It is not an error: it belongs in undefined.
        counts.undefined = counts.undefined + 1;
      }
    }
  }

  return counts;
}

async function classifyNames(client, names) {
  // These five examples are fixed text. They are not rows from SQLite.
  // Two show female, two show male, and one shows undefined.
  // The Names block is this part of stored names. Do not trim a name
  // and do not change its letters: the model must see the SQLite text.
  let prompt =
    "Classify each person's name into one gender category.\n" +
    "Reply with JSON only. The object must have one field, genders.\n" +
    "genders is an array of strings, one value per name, in the same order.\n" +
    "Each value must be exactly female, male, or undefined.\n" +
    "Use undefined when the name is not clearly female or male.\n" +
    "Do not add any other field.\n" +
    "\n" +
    "Follow these examples. Each example is a name and the gender word.\n" +
    "These examples are not the names to classify.\n" +
    "\n" +
    "Name:\n" +
    "Ada Lovelace\n" +
    "female\n" +
    "\n" +
    "Name:\n" +
    "Grace Hopper\n" +
    "female\n" +
    "\n" +
    "Name:\n" +
    "Alan Turing\n" +
    "male\n" +
    "\n" +
    "Name:\n" +
    "Charles Babbage\n" +
    "male\n" +
    "\n" +
    "Name:\n" +
    "Jordan\n" +
    "undefined\n" +
    "\n" +
    "Names:\n";

  for (const name of names) {
    prompt = prompt + name + "\n";
  }

  let completion;

  try {
    completion = await client.chat.completions.create({
      model: "gemma4",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  } catch {
    throw new Error("Unable to classify names");
  }

  // The package puts the model's text on the first choice.
  // response_format json_object means that text should be JSON.
  // The flag turns on only when the choice, its message and its text
  // all exist, so no property is read from something that is missing.
  const choice = completion.choices[0];
  let hasText = false;

  if (choice) {
    if (choice.message) {
      if (typeof choice.message.content === "string") {
        hasText = true;
      }
    }
  }

  if (!hasText) {
    throw new Error("Unable to classify names");
  }

  const text = choice.message.content;
  let classification;

  try {
    classification = JSON.parse(text);
  } catch {
    throw new Error("Unable to classify names");
  }

  // genders must be one string per name in this part, in the same order.
  // A missing field, a wrong length, or a value that is not text stops
  // the count, because those strings could not be lined up with the rows.
  // Each step only runs when the previous one passed. The flag turns
  // on at the end, so a null, an array or a wrong length never reaches
  // a property that does not exist.
  let hasValidGenders = false;
  const isObject = typeof classification === "object";

  if (classification !== null) {
    if (isObject) {
      const isList = Array.isArray(classification);

      if (!isList) {
        const gendersIsList = Array.isArray(classification.genders);

        if (gendersIsList) {
          const gendersCount = classification.genders.length;
          const namesCount = names.length;

          if (gendersCount === namesCount) {
            hasValidGenders = true;
          }
        }
      }
    }
  }

  if (!hasValidGenders) {
    throw new Error("Unable to classify names");
  }

  for (const gender of classification.genders) {
    if (typeof gender !== "string") {
      throw new Error("Unable to classify names");
    }
  }

  return classification.genders;
}
