import OpenAI from 'openai';
import { findAll } from '../queries/users.js';

const MODEL = 'llama3.2';

export async function usersGenderCount() {
  let users;
  try {
    users = findAll();
  } catch {
    throw new Error('Could not classify the users');
  }

  const counts = { women: 0, men: 0, genderUndefined: 0 };
  if (users.length === 0) {
    return counts;
  }

  const client = new OpenAI({
    baseURL: 'http://127.0.0.1:11434/v1',
    apiKey: 'ollama',
  });

  for (let offset = 0; offset < users.length; offset += 6) {
    const batch = users.slice(offset, offset + 6);
    let response;
    try {
      response = await client.chat.completions.create({
        model: MODEL,
        temperature: 0,
        messages: [
          { role: 'user', content: 'Carmen' },
          { role: 'assistant', content: 'women' },
          { role: 'user', content: 'Lucia' },
          { role: 'assistant', content: 'women' },
          { role: 'user', content: 'Javier' },
          { role: 'assistant', content: 'men' },
          { role: 'user', content: 'Pablo' },
          { role: 'assistant', content: 'men' },
          { role: 'user', content: 'Kim' },
          { role: 'assistant', content: 'undefined' },
          { role: 'user', content: batch.map(user => user.name).join('\n') },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'genders',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                genders: {
                  type: 'array',
                  items: { type: 'string', enum: ['women', 'men', 'undefined'] },
                },
              },
              required: ['genders'],
              additionalProperties: false,
            },
          },
        },
      });
    } catch {
      throw new Error('Could not classify the users');
    }

    let genders;
    try {
      genders = JSON.parse(response?.choices?.[0]?.message?.content)?.genders;
    } catch {
      counts.genderUndefined += batch.length;
      continue;
    }

    if (!Array.isArray(genders) || genders.length !== batch.length) {
      counts.genderUndefined += batch.length;
      continue;
    }

    for (const gender of genders) {
      if (gender === 'women') {
        counts.women++;
      } else if (gender === 'men') {
        counts.men++;
      } else {
        counts.genderUndefined++;
      }
    }
  }

  return counts;
}
