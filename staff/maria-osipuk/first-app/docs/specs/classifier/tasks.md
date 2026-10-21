# Users gender count

## 1. Crear la función

Abrir `logic/count-users-by-gender.js`.
Escribir `countUsersByGender` sin argumentos, como `logic/list-users.js`, con comentarios en inglés.
Pedir las filas con `listUserRows`. Si falla, lanzar `Unable to list users`.
Sin filas, devolver `{ female: 0, male: 0, undefined: 0 }` y no llamar al modelo.

## 2. Clasificar cada nombre

En el mismo archivo, recorrer las filas en orden y usar solo `name`.
Por cada nombre, hacer la llamada de `docs/specs/classifier/plan.md`, con los cinco ejemplos fijos del prompt.
Si no se puede leer, lanzar `Unable to classify names` y no devolver un recuento a medias.
Si `gender` es exactamente `female` o `male`, sumar ahí; cualquier otro texto suma en `undefined`.

## 3. Dejar el ejemplo de terminal

Abrir `clients/terminal/count-users-by-gender.txt`.
Escribir una sola línea, el caso correcto, con `await` porque la función espera al modelo.
La línea es la de `docs/specs/plan.md` e imprime el resultado de `countUsersByGender()`.
El archivo queda con esa única línea.

## 4. Comprobar

Revisar la sintaxis del archivo nuevo y ejecutar el cliente con usuarios existentes.
Sin filas, ver los tres ceros en el retorno anterior a `fetch`, sin vaciar `db/users.sqlite`.
Con un nombre que el modelo no clasifique, ver que suma en `undefined`.
Ver `Unable to list users` si no se leen las filas, y `Unable to classify names` con Ollama parado.

## 5. Actualizar la constitución

Abrir `docs/CONSTITUTION.md`.
Añadir la funcionalidad y los dos archivos nuevos al alcance y al árbol.
Añadir que esta operación llama a Ollama en local desde `logic/`, modelo `gemma4`, sin capa nueva.
Dejar el diagrama de SQLite igual. La constitución describe solo lo que ya existe.
