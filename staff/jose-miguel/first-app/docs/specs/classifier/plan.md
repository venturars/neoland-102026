# Plan técnico

Firma: `usersGenderCount(names)`. El fichero es `logic/users-gender-count.js`. No se reemplaza ningún fichero de `logic/` ya creado.

La prueba pasa la lista de nombres. No lee los usuarios guardados. No hay SQL nuevo. `logic/` no abre la base de datos.

El tamaño de tanda es la constante `BATCH_SIZE`, con valor 6. Una llamada de chat por tanda. La última tanda puede traer menos de 6.

Si no hay nombres, el resultado es `{ women: 0, men: 0, genderUndefined: 0 }`.

## IA

El modelo es llama3.2. Su nombre vive en la constante `MODEL`, dentro de `logic/users-gender-count.js`. La función no vuelve a escribir el nombre.

llama3.2 admite chat. Corre en local, sin coste. Hace falta Ollama en marcha y el modelo ya descargado.

El cliente es `OpenAI` de la librería `openai`, instalada con pnpm. `baseURL` es `http://127.0.0.1:11434/v1`. `apiKey` es `ollama`.

Cada tanda se envía en un chat. La respuesta que cuenta es `women`, `men` o `undefined`, una palabra por nombre y en el mismo orden.

Los ejemplos van en ese chat, como muestra. No se entrena el modelo. Carmen es women, Lucia es women, Javier es men, Pablo es men, Kim es undefined.

Si no hay mensaje, o la respuesta no es una de esas tres palabras, ese usuario suma un no definido.

El cliente se crea una vez y se reutiliza. No se guarda la respuesta.

Antes de escribir código, la constitución tiene que permitir que este fichero use la librería `openai`, porque hoy `logic/` solo puede llamar a `queries/users.js`.

La salida es `{ women: 0, men: 0, genderUndefined: 0 }`. No se guarda.

El cliente es `clients/terminal/users-gender-count.txt`. Importa `usersGenderCount` y hace `console.log` del resultado.

## Ficheros

Se crean:

- `logic/users-gender-count.js`
- `clients/terminal/users-gender-count.txt`

Se editan:

- `docs/CONSTITUTIONS.md`, para permitir la librería `openai` y añadir el mensaje de error.

Se eliminan:

- Ninguno.
