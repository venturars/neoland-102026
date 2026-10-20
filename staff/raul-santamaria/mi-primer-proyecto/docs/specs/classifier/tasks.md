# Tareas — clasificador de género

Un paso. Quien lo revisa marca `- [x]`. Los ficheros ya están. Cada paso los abre y mira.

- [ ] 1. Abrir `docs/CONSTITUTIONS.md`. En el árbol, `package.json` dice que el único paquete es `openai`.
  - [ ] 1.1 Leer el subapartado «Constantes», dentro de «Paquetes». Un dato que no cambia va en mayúsculas, como `MODEL`. Una variable sigue en camelCase.

- [ ] 2. Abrir «Funciones de logic». `usersGenderCount()` no tiene entrada. La salida que se lee es `women`, `men` y `genderUndefined`.

- [ ] 3. Abrir `docs/specs/classifier/plan.md`. Se leen `logic/users-gender-count.js`, `usersGenderCount` y `clients/terminal/users-gender-count.txt`. En «IA», la respuesta es JSON con structured output, el esquema es `{ genders }` y cada valor es `women`, `men` o `undefined`.

- [ ] 4. Abrir `logic/users-gender-count.js` en `mi-primer-proyecto`. Hay una sola función, `usersGenderCount`.
  - [ ] 4.1 `MODEL` vale `llama3.2` una sola vez.
  - [ ] 4.2 El cliente de `openai` se crea dentro de la función, en cada llamada. La dirección es `http://127.0.0.1:11434/v1` y la clave es `ollama`.
  - [ ] 4.3 La llamada usa `MODEL` y temperatura 0. `response_format` es `json_schema`.
  - [ ] 4.4 Importa `list`. No hay escrituras en la base.
  - [ ] 4.5 Los ejemplos van en este orden: Carmen `{ "genders": ["women"] }`, Lucia `{ "genders": ["women"] }`, Javier `{ "genders": ["men"] }`, Pablo `{ "genders": ["men"] }`, Kim `{ "genders": ["undefined"] }`.
  - [ ] 4.6 `BATCH_SIZE` vale 6. El lote viaja en un mensaje `user`, un nombre por línea.

- [ ] 5. En `usersGenderCount`, leer `genders`.
  - [ ] 5.1 `women` y `men` suman en su campo. `undefined` y cualquier otro valor suman en `genderUndefined`.
  - [ ] 5.2 Si no hay mensaje, el JSON no se lee o no hay un valor por nombre, los nombres de ese lote suman en `genderUndefined` y se sigue.
  - [ ] 5.3 Si la llamada falla, se ve `Could not classify the users`.
  - [ ] 5.4 Sin usuarios, la salida es `{ women: 0, men: 0, genderUndefined: 0 }`.
  - [ ] 5.5 La función devuelve solo `{ women, men, genderUndefined }`.

- [ ] 6. Abrir `clients/terminal/users-gender-count.txt`. Al pegarlo con el directorio actual en `mi-primer-proyecto`, se ve `{ women, men, genderUndefined }`.

- [ ] 7. Comprobar que la suma de `women`, `men` y `genderUndefined` es el número de filas de `users`.

- [ ] 8. Abrir `queries/queries/create-users-table.sql`. La tabla no tiene columna de género.

- [ ] 9. Parar Ollama y pegar otra vez el cliente. Se ve `Could not classify the users` y no se imprime un recuento. Volver a arrancar Ollama.
