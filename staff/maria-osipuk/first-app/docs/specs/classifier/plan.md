# Users gender count

## Recorrido

Se leen los usuarios que ya existen. No hay SQL nuevo ni cambio de tabla.

- Cliente: `clients/terminal/count-users-by-gender.txt`. Una sola línea, el caso correcto, con `await` porque la función espera al modelo.
- Lógica: `logic/count-users-by-gender.js`. Se parece a `logic/list-users.js`. No recibe argumentos. Llama a `listUserRows()`. Si SQLite falla, el mensaje es `Unable to list users`.
- Consulta reutilizada: `listUserRows()` en `queries/users.js`, con `queries/queries/list.sql`. Solo se usa `name`.
- Dependencia: `openai`, añadida con `pnpm add openai` en la raíz de `first-app`. La versión queda en `package.json` y en `pnpm-lock.yaml`. No se crea `package-lock.json`.

## Ollama

La llamada sale de `logic/count-users-by-gender.js` con el paquete `openai`, usado solo como cliente. `baseURL` es `http://127.0.0.1:11434/v1`, el punto compatible de Ollama en local. No se llama al servicio de OpenAI. No se añade una capa y no se añade SQL. El modelo es `gemma4`.

El paquete exige `apiKey`. Ollama no la lee. El valor fijo es `ollama`: no es una clave ni un secreto.

Los nombres se envían en partes de 6, en el orden de las filas. Cada parte es `rows.slice(inicio, inicio + 6)`. `slice` no borra filas de la lista. La última parte puede tener menos de 6. Sin filas no hay llamada.

Si Ollama está parado, o el puerto es otro, o la llamada falla, el mensaje es `Unable to classify names`.

Cada parte usa `client.chat.completions.create` con este cuerpo:

```json
{
  "model": "gemma4",
  "temperature": 0,
  "response_format": { "type": "json_object" },
  "messages": [
    {
      "role": "user",
      "content": "Classify each person's name into one gender category.\nReply with JSON only. The object must have one field, genders.\ngenders is an array of strings, one value per name, in the same order.\nEach value must be exactly female, male, or undefined.\nUse undefined when the name is not clearly female or male.\nDo not add any other field.\n\nFollow these examples. Each example is a name and the gender word.\nThese examples are not the names to classify.\n\nName:\nAda Lovelace\nfemale\n\nName:\nGrace Hopper\nfemale\n\nName:\nAlan Turing\nmale\n\nName:\nCharles Babbage\nmale\n\nName:\nJordan\nundefined\n\nNames:\nElena Navarro\nKenji Mori\nAlex Quinn\nSam Rivera\nNora Diaz\nLuis Ortega\n"
    }
  ]
}
```

El prompt lleva cinco ejemplos fijos antes de los nombres de la parte: dos female, dos male y uno undefined. No salen de la base: son texto escrito en la llamada.

- `Ada Lovelace` enseña `female`.
- `Grace Hopper` enseña `female`.
- `Alan Turing` enseña `male`.
- `Charles Babbage` enseña `male`.
- `Jordan` enseña `undefined`, porque el nombre no es claramente female ni male.

Esos cinco bloques enseñan las tres palabras exactas. No son los nombres que hay que clasificar. El bloque `Names:` es la parte actual, un nombre guardado por línea, sin recortarlo ni cambiarlo. En el ejemplo esa parte tiene seis nombres. `temperature: 0` pide la misma clasificación si el texto no cambia. `response_format` `json_object` obliga a que el texto de la respuesta sea JSON.

La respuesta esperada de esa parte es un objeto con un solo campo, un texto por nombre y en el mismo orden:

```json
{ "genders": ["female", "male", "undefined", "undefined", "female", "male"] }
```

Lectura, en este orden:

1. Si `chat.completions.create` falla, lanzar `Unable to classify names`.
2. Leer `choices[0].message.content`. Tiene que ser una cadena.
3. Interpretar esa cadena. Tiene que ser un objeto con `genders`: un array de textos, de la misma longitud que la parte. Si no se puede leer así, el mismo error y se corta el recuento: no se devuelve un resultado a medias.
4. Si un texto es exactamente `female` o `male`, sumar ahí. Cualquier otro texto suma en `undefined`.

## Entrada y salida de logic/

`countUsersByGender()` no recibe datos. Es asíncrona porque espera al modelo.

Devuelve `{ female, male, undefined }` con números enteros. Sin usuarios, devuelve ceros y no llama al modelo. Cada fila cuenta una vez.

El cliente de terminal imprime el resultado de `countUsersByGender()` con esta única línea:

```text
node --input-type=module -e "import { countUsersByGender } from './logic/count-users-by-gender.js'; console.log(await countUsersByGender())"
```

## Comprobación

- Revisar la sintaxis.
- `package.json` declara `openai` y existe `pnpm-lock.yaml`. No existe `package-lock.json`.
- Cada parte sale de `rows.slice(inicio, inicio + 6)` y trae como mucho 6 nombres. La última puede traer menos.
- El prompt de cada llamada incluye, antes de esos nombres, los cinco ejemplos fijos: Ada Lovelace y Grace Hopper como female, Alan Turing y Charles Babbage como male, y Jordan como undefined.
- Ejecutar el cliente de terminal con Ollama en marcha y el modelo `gemma4`.
- Ver un recuento con usuarios existentes.
- Ver los tres ceros en el retorno anterior a Ollama cuando no hay filas. No se vacía ni se sustituye `db/users.sqlite`.
- Ver `undefined` con un nombre que el modelo no clasifique.
- El fallo al no poder leer usuarios es `Unable to list users`.
- El fallo con Ollama parado, o con un puerto distinto, es `Unable to classify names`.
