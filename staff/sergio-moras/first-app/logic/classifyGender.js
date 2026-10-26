// Cuenta cuántos usuarios parecen hombres, mujeres o de género no definido.
// Solo mira el nombre de cada usuario y se lo pregunta a un modelo de IA local (Ollama).
// Uso desde la terminal: node logic/classifyGender.js

import { pathToFileURL } from 'node:url';
import { selectAllUsers } from '../queries/users.js';

const OLLAMA_URL = 'http://localhost:11434/v1/systemone';
const MODEL_NAME = 'nimble-v3:latest';
const REQUEST_TIMEOUT_MS = 60000;
// Cuántos nombres se envían al modelo en cada petición.
const BATCH_SIZE = 6;

const ALLOWED_GENDERS = ['male', 'female', 'undefined'];

// Opciones de respuesta de cada pregunta. La opción "undefined" es la salida
// para cuando el modelo no está seguro.
const GENDER_CRITERIA = {
  male: "Typically a man's name",
  female: "Typically a woman's name",
  undefined: 'Neutral, ambiguous or unrecognized name',
};

// Ejemplos que se le dan al modelo para que sepa cuándo responder "undefined".
const FEW_SHOT_EXAMPLES = [
  { name: 'Ricardo', gender: 'male' },
  { name: 'Eduardo', gender: 'male' },
  { name: 'Gabriela', gender: 'female' },
  { name: 'Verónica', gender: 'female' },
  { name: 'Casey', gender: 'undefined' },
  { name: 'Frankie', gender: 'undefined' },
  { name: 'Brzzk', gender: 'undefined' },
];

// Texto que describe la tarea al modelo, con los ejemplos incluidos.
function buildState() {
  const examples = FEW_SHOT_EXAMPLES.map((example) => `${example.name} -> ${example.gender}`);
  return `Classify the most likely gender of each first name. Examples: ${examples.join('; ')}.`;
}

// Pregunta al modelo por una lista de nombres (una sola petición).
// Devuelve una lista del mismo tamaño y orden que names, con 'male', 'female' o 'undefined'.
// Si el modelo no responde, lanza un Error. Si responde algo no válido,
// los nombres afectados se devuelven como 'undefined'.
async function askModelForGenders(names) {
  // Cada nombre es una pregunta con su propia clave (q1, q2...), así cada
  // respuesta queda ligada a su nombre sin depender del orden.
  const questions = {};
  names.forEach((name, index) => {
    questions[`q${index + 1}`] = {
      type: 'choice',
      instructions: `Is the first name '${name}' most likely male or female?`,
      criteria: GENDER_CRITERIA,
    };
  });

  const requestBody = {
    model: MODEL_NAME,
    state: buildState(),
    questions,
  };

  let response;
  try {
    response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(`the model did not respond (${error.message})`);
  }

  if (!response.ok) {
    throw new Error(`the model did not respond (HTTP ${response.status})`);
  }

  // A partir de aquí el modelo sí ha respondido: cualquier problema es una respuesta no válida.
  let answers;
  try {
    const data = await response.json();
    answers = data.answers;
  } catch (error) {
    answers = undefined;
  }

  const genders = [];
  names.forEach((name, index) => {
    const answer = answers?.[`q${index + 1}`];
    if (answer && ALLOWED_GENDERS.includes(answer.choice)) {
      genders.push(answer.choice);
    } else {
      genders.push('undefined');
    }
  });

  return genders;
}

// Cuenta hombres, mujeres y género no definido de una lista de usuarios.
// Si la lista está vacía no se llama al modelo.
// Si el modelo no responde, lanza un Error y no devuelve ningún conteo parcial.
export async function countGenders(users) {
  const counts = { men: 0, women: 0, undefinedGender: 0 };

  if (users.length === 0) {
    return counts;
  }

  // Se procesa de BATCH_SIZE en BATCH_SIZE usuarios, una petición por grupo y en secuencia.
  for (let start = 0; start < users.length; start += BATCH_SIZE) {
    const group = users.slice(start, start + BATCH_SIZE);
    const names = group.map((user) => user.name);

    const genders = await askModelForGenders(names);

    for (const gender of genders) {
      if (gender === 'male') {
        counts.men += 1;
      } else if (gender === 'female') {
        counts.women += 1;
      } else {
        counts.undefinedGender += 1;
      }
    }
  }

  return counts;
}

// Lee los usuarios de la base de datos y los clasifica por género.
// Lanza un Error si no se puede leer la base de datos o el modelo no responde.
export async function classifyGender() {
  try {
    const users = selectAllUsers();
    return await countGenders(users);
  } catch (error) {
    throw new Error(`Users could not be classified: ${error.message}`);
  }
}

// Este bloque solo se ejecuta cuando el archivo se lanza directamente con node,
// no cuando otro archivo lo importa.
const isRunFromTerminal = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isRunFromTerminal) {
  try {
    const counts = await classifyGender();
    console.log(`Men: ${counts.men}`);
    console.log(`Women: ${counts.women}`);
    console.log(`Undefined: ${counts.undefinedGender}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Código 1 = el comando terminó con error.
    process.exit(1);
  }
}
