# Tareas — clasificador de género

1. Abre `docs/CONSTITUTIONS.md`.
   Añade «Constantes»: un valor fijo va en mayúsculas (`MODEL`).
   Una variable sigue en camelCase.
   La sección se lee en el documento.

2. Abre `docs/specs/classifier/plan.md`, en «IA».
   La respuesta del modelo es JSON, pedida con structured output.
   `logic/` lee ese objeto. El esquema es `{ genders }`.
   Esa frase se lee en el plan.

3. En `docs/CONSTITUTIONS.md`, sección «Un fichero de logic».
   Escribe que la salida del clasificador son `women`, `men` y `genderUndefined`.
   Esa frase se lee en la sección.

4. Abre `logic/users-gender-count.js`.
   La constante `MODEL` vale `llama3.2` una sola vez.
   Los ejemplos, en este orden, son Carmen `women`, Lucia `women`, Javier `men`, Pablo `men` y Kim `undefined`.
   El lote es un mensaje `user` con un nombre por línea. `response_format` es `json_schema`.

5. En ese fichero, lee el JSON.
   `women` y `men` suman en su campo. Cualquier otro valor suma en `genderUndefined`.
   Si no hay mensaje, el JSON no se lee, o `genders` no coincide, ese lote suma en `genderUndefined` y sigue.
   Si la llamada falla, lanza `Could not classify the users`. La función devuelve solo `{ women, men, genderUndefined }`.

6. Pega `clients/terminal/users-gender-count.txt` con el directorio actual en `first-app`.
   La salida es `{ women, men, genderUndefined }`.
   La suma de los tres números es el número de filas de `users`.
   La tabla `users` no tiene columna de género.

7. Para Ollama y pega otra vez el cliente.
   Se ve `Could not classify the users`.
   No se imprime un recuento.
   Vuelve a arrancar Ollama.
