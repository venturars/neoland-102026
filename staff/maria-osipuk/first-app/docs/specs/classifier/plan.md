# Users gender count

## Recorrido

Se leen los usuarios que ya existen. No hay SQL nuevo ni cambio de tabla.

- Cliente: `clients/terminal/count-users-by-gender.txt`. Una sola línea, el caso correcto, con `await` porque la función espera al modelo.
- Lógica: `logic/count-users-by-gender.js`. Se parece a `logic/list-users.js`. No recibe argumentos. Llama a `listUserRows()`. Si SQLite falla, el mensaje es `Unable to list users`.
- Consulta reutilizada: `listUserRows()` en `queries/users.js`, con `queries/queries/list.sql`. Solo se usa `name`.
- No se toca `package.json`. La llamada local usa `fetch`, que ya viene con Node.

## Ollama

La llamada sale de `logic/count-users-by-gender.js` hacia el modelo local `gemma4`. No se añade una capa, no se añade SQL y no se añade una dependencia. Se consulta un nombre cada vez, en el orden de las filas.

`POST http://127.0.0.1:11434/api/generate` con cabecera `Content-Type: application/json` y este cuerpo:

```json
{
  "model": "gemma4",
  "stream": false,
  "format": "json",
  "prompt": "Classify this person's name into one gender category.\nReply with JSON only. The gender value must be exactly female, male, or undefined.\nUse undefined when the name is not clearly female or male.\nDo not add any other field.\n\nName:\nAda Lovelace"
}
```

La última línea del prompt es el `name` guardado, sin recortarlo ni cambiarlo. En el ejemplo esa línea es `Ada Lovelace`. `stream: false` hace que Ollama devuelva un solo JSON. `format: "json"` obliga a que el campo `response` sea texto JSON.

Lectura, en este orden:

1. Si `fetch` falla o el estado HTTP no es correcto, lanzar `Unable to classify names`.
2. Leer el cuerpo como JSON. El campo que importa es `response`, una cadena.
3. Interpretar esa cadena. Tiene que ser un objeto con `gender` de tipo texto. Si no se puede leer así, el mismo error y se corta el recuento: no se devuelve un resultado a medias.
4. Si `gender` es exactamente `female` o `male`, sumar ahí. Cualquier otro texto suma en `undefined`.

## Entrada y salida de logic/

`countUsersByGender()` no recibe datos. Es asíncrona porque espera al modelo.

Devuelve `{ female, male, undefined }` con números enteros. Sin usuarios, devuelve ceros y no llama al modelo. Cada fila cuenta una vez.

El cliente de terminal imprime el resultado de `countUsersByGender()` con esta única línea:

```text
node --input-type=module -e "import { countUsersByGender } from './logic/count-users-by-gender.js'; console.log(await countUsersByGender())"
```

## Comprobación

- Revisar la sintaxis.
- Ejecutar el cliente de terminal.
- Ver un recuento con usuarios existentes.
- Ver los tres ceros en el retorno anterior a `fetch` cuando no hay filas. No se vacía ni se sustituye `db/users.sqlite`.
- Ver `undefined` con un nombre que el modelo no clasifique.
- El fallo al no poder leer usuarios es `Unable to list users`.
- El fallo con Ollama parado, o con un puerto distinto, es `Unable to classify names`.
