# Plan — clasificador de género

## Ficheros

- Se crea `logic/user-gender-count.js`.
- Se crea `clients/terminal/user-gender-count.txt`.
- En `first-app` se instala el paquete `openai` con `pnpm add openai`. Eso toca `package.json` y `pnpm-lock.yaml`.
- No hay más ficheros. No hay otro paquete.

## Parecido

Se parece a `logic/list-users.js`: no recibe argumentos, lee las filas con `findAll` y, si esa llamada lanza, lanza `DatabaseError`. No escribe.

## Firma

`usersGenderCount()`. Sin parámetros. Es `async` porque el cliente de `openai` devuelve una promesa. Devuelve `{ woman, man, genderUndefined }`, tres números, con las claves en ese orden.

## SQL

No hay SQL nuevo. La lectura es `findAll` de `queries/user.js`, que ya ejecuta `queries/queries/find-all.sql`.

## Llamada

La llamada no es una query y no abre la base. Va en el mismo fichero.

- Cliente: `new OpenAI({ apiKey: "ollama", baseURL: "http://127.0.0.1:11434/v1" })`.
- Modelo: `llama3.2`.
- Temperatura: 0.
- Los datos que retorna la base de datos se parten en lotes de 6, en el orden de la primera aparición. Cada lote es una llamada. El último lote puede traer menos de 6. No se manda la lista entera en una sola llamada.
- Cada llamada lleva los ejemplos y, al final, un mensaje `user` con los nombres de ese lote, uno por línea.

Ejemplos, en este orden:

- `user` Carmen, `assistant` women.
- `user` Lucia, `assistant` women.
- `user` Javier, `assistant` men.
- `user` Pablo, `assistant` men.
- `user` Kim, `assistant` undefined.

## Structured output

`response_format` con `type` `json_schema` y `strict` true.

- La raíz es un objeto con una sola clave, `classifications`, un array.
- Cada elemento tiene `name` (string) y `gender` (`women`, `men` o `undefined`).
- No hay más claves.

## Conteo

- Si no hay filas, se devuelven los tres ceros y no se llama a la IA.
- Si no se puede conectar con Ollama, se lanza `DatabaseError` con `"Could not classify the users"`. No se devuelve el conteo.
- Si un lote no trae respuesta, falta `choices`, `choices` está vacío, no hay `choices[0].message.content`, o ese texto no es el objeto del esquema, los nombres de ese lote cuentan en `genderUndefined`. Los otros lotes se cuentan con lo que sí respondieron. No se lanza error. Ese caso no entra en el `try` de `findAll`.
- Cada clasificación del lote se enlaza solo si `name` coincide con un nombre completo de ese lote (línea entera). Un nombre corto no vale para otro del mismo lote: si van `Ada` y `Ada Lovelace`, la respuesta para `Ada` no se aplica a `Ada Lovelace`.
- Cada fila cuenta una vez. `women` suma en `woman` y `men` suma en `man`. Si el valor es `undefined`, falta el nombre o el valor es otro, cuenta en `genderUndefined`.

## Cliente

El cliente de terminal importa `usersGenderCount`, hace `await`, hace `console.log` del resultado y no captura el error. Si logic lanza, el error sale solo.

## Fallos

- `findAll` lanza: `DatabaseError`, mensaje `"Could not classify the users"`.
- No se puede conectar con Ollama: `DatabaseError`, mensaje `"Could not classify the users"`.
- Un lote no trae respuesta, o el mensaje no trae el género de un nombre de su lote: no es fallo. Esos nombres cuentan en `genderUndefined`.
