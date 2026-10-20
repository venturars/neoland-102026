# Plan — clasificador de género

Funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No guarda datos. No toca el resto de funcionalidades.

## Ficheros

Se crean:

- `logic/users-gender-count.js`
- `clients/terminal/users-gender-count.txt`
- `pnpm-lock.yaml`

Se tocan:

- `package.json` — dependencia `openai`, instalada con `pnpm add openai`
- `docs/CONSTITUTIONS.md`

En «Errores», paso 3, está `Could not classify the users`.

En «Un fichero de logic», la salida del clasificador son `women`, `men` y `genderUndefined`.

En el árbol, `logic/` incluye `users-gender-count.js`.

## Firma

`usersGenderCount()`

Sin parámetros.

Devuelve solo `{ women, men, genderUndefined }`. Los tres valores son números enteros. Su suma es el número de usuarios leídos.

Si no hay usuarios, devuelve `{ women: 0, men: 0, genderUndefined: 0 }` y no llama a la IA.

## SQL

No hay SQL nuevo. No hay escrituras. Se reutiliza `findAll()` de `queries/users.js`.

## IA

El modelo es `llama3.2`. Su nombre vive en la constante `MODEL`, dentro de `logic/users-gender-count.js`. La función no vuelve a escribir el nombre.

[llama3.2](https://ollama.com/library/llama3.2) admite chat. Corre en local, sin coste. Hace falta Ollama en marcha y el modelo ya descargado.

El cliente es `OpenAI` de la librería `openai`:

- `baseURL`: `http://127.0.0.1:11434/v1`
- `apiKey`: `ollama`

La librería exige `apiKey`. Ollama lo ignora. No es una clave de pago. La llamada es `chat.completions.create` con `temperature` `0`, por la [API compatible](https://docs.ollama.com/api/openai-compatibility).

Los nombres salen de `findAll()`, en ese orden, y se envían de 6 en 6. El último lote puede traer menos de 6. Cada lote es una llamada. En la llamada solo van nombres, nunca el email.

Cada llamada lleva un solo mensaje `user`. Su contenido es la lista de nombres del lote, un nombre por línea.

| user   | assistant |
| ------ | --------- |
| Carmen | women     |
| Lucia  | women     |
| Javier | men       |
| Pablo  | men       |
| Kim    | undefined |

Esos nombres no están en la base.

El mensaje real del lote es un nombre por línea, en el orden leído.

La respuesta válida es el mismo número de líneas. Cada línea es `women`, `men` o `undefined`.

- `women` suma 1 a `women`
- `men` suma 1 a `men`
- `undefined`, u otro valor, suma 1 a `genderUndefined`

Si no hay mensaje, el JSON no se puede leer, o `genders` no trae un valor por nombre, cada nombre de ese lote suma 1 a `genderUndefined` y se sigue con el lote siguiente.

## Errores

| Fallo de la spec                         | Mensaje                                                     |
| ---------------------------------------- | ----------------------------------------------------------- |
| SQLite falla al leer                     | `Could not classify the users`                              |
| El modelo no responde o la llamada falla | `Could not classify the users`                              |
| No hay mensaje                           | no es un fallo: el lote suma a `genderUndefined` y se sigue |
| El JSON no se puede leer                 | no es un fallo: el lote suma a `genderUndefined` y se sigue |
| `genders` no trae un valor por nombre    | no es un fallo: el lote suma a `genderUndefined` y se sigue |
| Un valor no es `women` ni `men`          | no es un fallo: ese valor suma a `genderUndefined`          |

Si la llamada falla, no se devuelve un recuento parcial.

## Cliente

`clients/terminal/users-gender-count.txt` importa `usersGenderCount` y hace `console.log` del resultado. El directorio actual es `first-app`.
