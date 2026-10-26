# Tareas — clasificador de sexo

1. Abre `docs/CONSTITUTIONS.md`, en el árbol.
   Añade `logic/users-gender-count.js`, `clients/terminal/users-gender-count.txt` y `pnpm-lock.yaml`.
   El resto del árbol no cambia.
   Esas líneas se leen en el árbol.

2. Abre `docs/CONSTITUTIONS.md`, sección 6, fila `Could not classify the users`.
   El cuándo incluye que la IA no responde y que SQLite falla al leer los usuarios.
   El resto de la tabla no cambia.
   Esa frase se lee en la tabla.

3. En `first-app`, ejecuta `pnpm add openai`.
   `package.json` lista la dependencia `openai`.
   Se crea `pnpm-lock.yaml`.
   No hay otra dependencia nueva.

4. Abre `logic/users-gender-count.js`.
   Exporta `async function usersGenderCount()`.
   Si `findAll()` no trae filas, devuelve `{ women: 0, men: 0, undefinedUser: 0 }` y no llama a la IA.
   El fichero se lee.

5. En `usersGenderCount`, `MODEL` es `llama3.2`.
   El cliente `OpenAI` usa `baseURL` `http://127.0.0.1:11434/v1` y `apiKey` `ollama`.
   Los nombres van de 6 en 6, un nombre por línea, con `temperature` 0. Si la llamada falla, lanza `Could not classify the users`.
   Esa llamada se lee en la función.

6. En `usersGenderCount`, lee las líneas de cada respuesta, en el orden de los nombres.
   `women` suma a `women`, `men` suma a `men` y el resto suma a `undefinedUser`.
   Si no hay mensaje o no hay una línea por nombre, esos nombres suman a `undefinedUser` y se sigue el lote.
   La función devuelve solo `{ women, men, undefinedUser }`.

7. Abre `clients/terminal/users-gender-count.txt`.
   El comentario dice que se pega con el directorio actual en `first-app`.
   Importa `usersGenderCount` desde `./logic/users-gender-count.js` y hace `console.log` de `await usersGenderCount()`.
   El fichero se lee.

8. Pega `clients/terminal/users-gender-count.txt` con el directorio actual en `first-app`.
   La salida es `{ women, men, undefinedUser }`.
   Los tres son enteros y su suma es el número de usuarios ya guardados.
   No se sustituye `db/users.sqlite`.

9. Con llama3.2 sin responder y al menos un usuario, pega otra vez el cliente.
   Se ve `Could not classify the users`.
   No se imprime un recuento a medias.
   El fichero del cliente no cambia.
