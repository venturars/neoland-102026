# Users gender count

## 1. Añadir openai

En la raíz de `first-app`, ejecutar `pnpm add openai`.
Dejar `openai` en `package.json` y la versión en `pnpm-lock.yaml`.
No crear `package-lock.json`. El cliente apunta a Ollama en local. No hace falta una clave.

## 2. Crear la función

Abrir `logic/count-users-by-gender.js`.
Escribir `countUsersByGender` sin argumentos, como `logic/list-users.js`, con comentarios en inglés.
Pedir las filas con `listUserRows`. Si falla, lanzar `Unable to list users`.
Sin filas, devolver `{ female: 0, male: 0, undefined: 0 }` y no llamar al modelo.

## 3. Clasificar por partes de 6

En el mismo archivo, tomar partes con `rows.slice(inicio, inicio + 6)`, en orden, usando solo `name`.
Cada parte hace la llamada de `docs/specs/classifier/plan.md`: cinco ejemplos fijos y los nombres de esa parte.
Si no se puede leer, o no hay un texto por nombre, lanzar `Unable to classify names` y no devolver un recuento a medias.
Si un texto es exactamente `female` o `male`, sumar ahí; cualquier otro texto suma en `undefined`.

## 4. Dejar el ejemplo de terminal

Abrir `clients/terminal/count-users-by-gender.txt`.
Escribir una sola línea, el caso correcto, con `await` porque la función espera al modelo.
La línea es la de `docs/specs/classifier/plan.md` e imprime el resultado de `countUsersByGender()`.
El archivo queda con esa única línea.

## 5. Comprobar

Revisar la sintaxis del archivo y ejecutar el cliente con usuarios existentes y Ollama en marcha.
Sin filas, ver los tres ceros en el retorno anterior a Ollama, sin vaciar `db/users.sqlite`.
Con un nombre que el modelo no clasifique, ver que suma en `undefined`.
Ver `Unable to list users` si no se leen las filas, y `Unable to classify names` con Ollama parado.

## 6. Actualizar la constitución

Abrir `docs/CONSTITUTION.md`.
Añadir la funcionalidad y los archivos al alcance y al árbol, si todavía no están.
Añadir que esta operación llama a Ollama en local desde `logic/`, modelo `gemma4`, con el paquete `openai` como cliente, en partes de 6.
Dejar el diagrama de SQLite igual. La constitución describe solo lo que ya existe.
