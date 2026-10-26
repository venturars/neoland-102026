# Tareas — clasificador de género

1. Abre `package.json` en `first-app`.
   La dependencia queda en `openai` `7.39.0`, instalada con pnpm.
   pnpm escribe `pnpm-lock.yaml` al lado. No se escribe a mano.
   Ese lock se puede abrir y leer.

2. Crea `logic/users-gender.js`.
   `usersGender()` no recibe datos y es `async`.
   Si no hay usuarios, devuelve `{ women: 0, man: 0, undefined: 0 }` y no llama a Ollama.
   Llama a `listUsers`. No toca `queries`, los `.sql`, `db/connection.js` ni las operaciones ya hechas.

3. En ese fichero, la constante `MODEL` aparece una sola vez. Es un modelo que Ollama ya tiene.
   La llamada es `POST http://127.0.0.1:11434/v1/systemone`. No lo descarga y no usa otro servicio.
   Cada grupo de seis, o los que queden, manda solo esos nombres en `state`.
   Cada nombre es una pregunta `choice`, en el mismo orden: `women`, `man` o `undefined`.

4. Por cada nombre, en orden, suma 1 en `women`, `man` o `undefined`.
   Otra respuesta suma 1 en `undefined`.
   No escribe el contador de cada nombre.
   La función devuelve solo `{ women, man, undefined }`. La suma es el número de usuarios leídos.

5. Si la llamada a Ollama falla, o SQLite falla al listar, lanza `no se han podido clasificar usuarios` y se detiene.
   Si no hay mensaje, o no se ha podido leer el JSON, ese caso es `undefined`.
   Si faltan líneas o un valor no es `women`, `man` ni `undefined`, ese caso también es `undefined`.
   No se inventan géneros ni se modifican los usuarios.

6. Crea `clients/terminal/users-gender.txt`.
   Es una sola línea de cmd, como el resto de `clients/terminal`.
   Importa `usersGender` y hace `console.log` del recuento.
   No lleva argumentos, no valida y no abre la base.

7. En el mismo cambio, abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
   Dejan escrito el clasificador: `usersGender`, `users-gender.txt` y el error `no se han podido clasificar usuarios`.
   No cambian las operaciones que ya existen.
   Los dos se leen y coinciden con el código.

8. Tira esa línea desde cmd, en la raíz del repositorio.
   No sale una línea por nombre.
   Se ve solo el recuento completo `{ women, man, undefined }`.
   La suma de los tres números es el número de usuarios leídos.

9. Detén Ollama y tira otra vez esa línea.
   El recorrido se detiene.
   Se ve `no se han podido clasificar usuarios`.
   No se inventan géneros.
