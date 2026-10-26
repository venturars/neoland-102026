# Plan

Lotes de 6 nombres con la librería `openai`. `MODEL` es la constante del modelo. `women` y `men` suman. Si la llamada falla, no hay recuento.

## Encaja

- El único paquete es `openai`.
- El cliente usa `http://127.0.0.1:11434/v1` y la clave `ollama`. No se llama a una IA de pago.
- Sin SQL nuevo y sin escrituras. Se lee con `list()` y `queries/queries/list-users.sql`.
- `logic/users-gender-count.js` es nuevo. Alta, consulta, modificación y baja no se tocan.
- El cliente va en `clients/terminal/users-gender-count.txt`.

Ollama en marcha y `llama3.2` descargado. El proyecto no los instala.

## Dónde

- Arriba de `logic/users-gender-count.js`: `const MODEL = "llama3.2"`. Cambiar de modelo es cambiar esa constante. Importa `list` como `logic/list-users.js`.
- `clients/terminal/users-gender-count.txt` muestra los tres números.

## Función

`usersGenderCount()`
Entrada: ninguna.
Salida: `{ women, men, genderUndefined }`.
Es `async`.

## IA

La respuesta es JSON, pedida con structured output. `logic/` lee ese objeto. El esquema es `{ genders }`. Cada valor es `women`, `men` o `undefined`.

## Reglas

1. Leer con `list()`. Si no hay usuarios, devolver `{ women: 0, men: 0, genderUndefined: 0 }` y no llamar a la IA.
2. Partir los nombres en lotes de 6, en el orden de `list()`. El último lote puede traer menos.
3. Cada lote es un `chat.completions.create` con `MODEL`, `temperature` 0 y `response_format` `json_schema`. Mensajes:
   - system: un valor de `genders` por nombre, el mismo orden. `women`, `men` o `undefined`. Solo el nombre.
   - user `Carmen` / assistant `{ "genders": ["women"] }`
   - user `Lucia` / assistant `{ "genders": ["women"] }`
   - user `Javier` / assistant `{ "genders": ["men"] }`
   - user `Pablo` / assistant `{ "genders": ["men"] }`
   - user `Kim` / assistant `{ "genders": ["undefined"] }`
   - user: los nombres del lote, uno por línea
4. `women` suma en `women`. `men` suma en `men`. `undefined` y cualquier otro valor suman en `genderUndefined`. Si no hay mensaje, el JSON no se lee o no hay un valor por nombre, los nombres de ese lote suman en `genderUndefined` y se sigue.
5. No se escribe en la base. No se devuelve la lista ni el género de cada persona.

## Errores

- Si `list()` falla: `Could not list the users`.
- Si la llamada falla: `Could not classify the users`. No sale el recuento.

## SQL

Ninguno nuevo. Se reutiliza `list-users.sql` a través de `list()`.

## Cliente

`users-gender-count.txt` importa `usersGenderCount`, hace `await` y `console.log` del objeto. Se ven `women`, `men` y `genderUndefined`.
