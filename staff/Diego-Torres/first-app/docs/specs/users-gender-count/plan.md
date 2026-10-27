# Plan — clasificador de género

Funcionalidad nueva. No reemplaza los ficheros de operaciones de `logic/`. No guarda datos. No toca el resto de funcionalidades.

## Ficheros

Se crean:

- `logic/users-gender-count.js`
- la prueba nueva dentro de `test/users.test.js`

Se tocan, al implementar:

- `docs/CONSTITUCION.md`
- `AGENTS.md`
- `package.json` — dependencia `openai`, instalada con `pnpm add openai`
- `ejemplo.js` — para ver el resultado a mano

No se crea `clients/terminal/`.

## Firma

`usersGenderCount(store)`

El almacén entra como primer argumento, igual que el resto de operaciones. La función llama a `findAll`. No importa `db` ni `queries`.

Devuelve solo `{ women, men, genderUndefined }`. Los tres valores son números enteros. Su suma es el número de usuarios leídos.

Si no hay usuarios, devuelve `{ women: 0, men: 0, genderUndefined: 0 }` y no llama a la IA.

## SQL

No hay SQL nuevo. No hay escrituras. Los nombres salen de `findAll()`.

## IA

El nombre del modelo vive en una sola constante, `MODEL`, dentro de `logic/users-gender-count.js`. Hoy vale `llama3.2`. Cambiar de modelo es cambiar esa constante. La función no vuelve a escribir el nombre.

llama3.2 admite chat. Corre en local, sin coste. Hace falta Ollama en marcha y el modelo ya descargado.

El cliente es `OpenAI` de la librería `openai`:

- `baseURL`: `http://127.0.0.1:11434/v1`
- `apiKey`: `ollama`

La librería exige `apiKey`. Ollama lo ignora. No es una clave de pago. La llamada es `chat.completions.create` con `temperature` `0`, por la API compatible. La respuesta es JSON, pedida con structured output. `logic/` lee ese objeto. El esquema es `{ genders }`.

Los nombres salen de `findAll()`, en ese orden, y se envían de 6 en 6. El último lote puede traer menos de 6. Cada lote es una llamada. En la llamada solo van nombres, nunca el email.

Cada llamada lleva un solo mensaje `user`. Su contenido es la lista de nombres del lote, un nombre por línea.

| user | assistant |
| --- | --- |
| Carmen | women |
| Lucia | women |
| Javier | men |
| Pablo | men |
| Kim | undefined |

Esos nombres no están en la base.

El mensaje real del lote es un nombre por línea, en el orden leído.

La respuesta válida es el mismo número de líneas leídas como `genders`. Cada valor es `women`, `men` o `undefined`.

- `women` suma 1 a `women`
- `men` suma 1 a `men`
- `undefined`, u otro valor, suma 1 a `genderUndefined`

Si no hay mensaje, el JSON no se puede leer, o `genders` no trae un valor por nombre, cada nombre de ese lote suma 1 a `genderUndefined` y se sigue con el lote siguiente.

## Errores

El mensaje nuevo es `No se han podido clasificar los usuarios`. Es `throw new Error`. No es uno de los mensajes de `logic/shared.js`.

| Fallo de la spec | Mensaje |
| --- | --- |
| El almacén falla al leer | `No se han podido clasificar los usuarios` |
| El modelo no responde o la llamada falla | `No se han podido clasificar los usuarios` |
| No hay mensaje | no es un fallo: el lote suma a `genderUndefined` y se sigue |
| El JSON no se puede leer | no es un fallo: el lote suma a `genderUndefined` y se sigue |
| `genders` no trae un valor por nombre | no es un fallo: el lote suma a `genderUndefined` y se sigue |
| Un valor no es `women` ni `men` | no es un fallo: ese valor suma a `genderUndefined` |

Si la llamada falla, no se devuelve un recuento parcial.

## Comprobación

La prueba va en `test/users.test.js`. Para verlo a mano, `ejemplo.js` importa `usersGenderCount`, le pasa el almacén SQLite y hace `console.log` del resultado. Se lanza con `pnpm run ejemplo`.

## Antes de escribir el código

Hoy la constitución y `AGENTS.md` no admiten esta funcionalidad. Al implementar hay que ampliarlos, y solo entonces escribir el código:

- En `docs/CONSTITUCION.md`, la tabla de quién sabe qué incluye `logic/users-gender-count.js`. La operación `usersGenderCount(store)` queda aparte de las seis operaciones, una por fichero. El mensaje `No se han podido clasificar los usuarios` queda escrito, y se dice que lo lanza `logic/users-gender-count.js` con `throw new Error`.
- En `AGENTS.md`, los scripts siguen con pnpm. Se admite la dependencia `openai`.
