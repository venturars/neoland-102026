import OpenAI from "openai";

const MODEL = "llama3.2";

export async function usersGenderCount(store) {
  let usuarios;
  try {
    usuarios = await store.findAll();
  } catch {
    throw new Error("No se han podido clasificar los usuarios");
  }

  if (usuarios.length === 0) {
    return { women: 0, men: 0, genderUndefined: 0 };
  }

  const openai = new OpenAI({
    baseURL: "http://127.0.0.1:11434/v1",
    apiKey: "ollama",
  });

  let women = 0;
  let men = 0;
  let genderUndefined = 0;

  for (let inicio = 0; inicio < usuarios.length; inicio += 6) {
    const lote = usuarios.slice(inicio, inicio + 6);
    const nombres = lote.map((usuario) => usuario.nombre).join("\n");

    let completion;
    try {
      completion = await openai.chat.completions.create({
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
          { role: "user", content: nombres },
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
      });
    } catch {
      throw new Error("No se han podido clasificar los usuarios");
    }

    const choice = completion.choices[0];
    if (!choice || !choice.message) {
      genderUndefined += lote.length;
      continue;
    }

    const text = choice.message.content;
    if (typeof text !== "string" || text.trim() === "") {
      genderUndefined += lote.length;
      continue;
    }

    let genders;
    try {
      genders = JSON.parse(text).genders;
    } catch {
      genderUndefined += lote.length;
      continue;
    }

    if (!Array.isArray(genders) || genders.length !== lote.length) {
      genderUndefined += lote.length;
      continue;
    }

    for (const word of genders) {
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
