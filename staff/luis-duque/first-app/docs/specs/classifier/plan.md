# Plan — clasificador de género por nombre

Cumple `docs/specs/classifier/spec.md`.

## Ficheros

Se crea:

- `logic/users-gender.js`
- `clients/terminal/users-gender.txt`
- `pnpm-lock.yaml`

`users-gender.txt` es una sola línea de cmd, como el resto de `clients/terminal`. `pnpm-lock.yaml` lo genera pnpm en `first-app`, junto a `package.json`. No se escribe a mano.

Se toca `package.json`: la dependencia es `openai` `7.39.0`, instalada con pnpm.

Se tocan, en el mismo cambio que el código:

- `docs/CONSTITUTIONS.MD`
- `AGENTS.MD`

No se tocan `queries/users.js`, los `.sql`, `db/connection.js` ni las operaciones que ya existen.

## Firma

`usersGender()`

Sin parámetros. Es `async`, porque espera a Ollama.

Devuelve solo `{ women, man, undefined }`. Los tres valores son números enteros. Su suma es el número de usuarios leídos.

Si no hay usuarios, devuelve `{ women: 0, man: 0, undefined: 0 }` y no llama a Ollama.

## SQL

No hay SQL nuevo y no hay escrituras. Se reutiliza `listUsers`, que ejecuta `queries/queries/list-users.sql`.

```sql
SELECT *
FROM users;
```

## IA

La llamada sale de `logic/users-gender.js` a `http://127.0.0.1:11434/v1/systemone`. `nimble-v3` no acepta chat. El nombre del modelo vive una sola vez, en la constante `MODEL`. Es un modelo que Ollama ya tiene en el equipo. La aplicación no lo descarga y no usa otro servicio.

Los nombres se envían de seis en seis. El último grupo puede traer menos de seis. Cada grupo es una sola llamada. En `state` solo van los nombres de ese grupo, uno por línea. Cada nombre es una pregunta `choice`, en el mismo orden, con las respuestas `women`, `man` y `undefined`. La respuesta se lee en `answers` y el valor elegido está en `choice`.

Ejemplo de cinco nombres. No están guardados en la base.

| Nombre | Respuesta   |
| ------ | ----------- |
| Carmen | women       |
| Lucia  | women       |
| Javier | man         |
| Pablo  | man         |
| Kim    | undefined   |

## Recuento y terminal

Por cada nombre, en orden:

- `women` suma 1 a `women`
- `man` suma 1 a `man`
- `undefined`, u otra respuesta, suma 1 a `undefined`

La lógica no escribe una línea por nombre. El objeto que devuelve la función es solo `{ women, man, undefined }`, y es lo único que muestra la terminal.

## Errores

| Fallo                                        | Error                                  |
| -------------------------------------------- | -------------------------------------- |
| La llamada a Ollama falla                    | `no se han podido clasificar usuarios` |
| SQLite falla al listar                       | `no se han podido clasificar usuarios` |
| No hay mensaje                               | `undefined`                            |
| No se ha podido leer el JSON                 | `undefined`                            |
| El grupo no trae una línea por nombre        | `undefined`                            |
| Un valor no es `women`, `man` ni `undefined` | `undefined`                            |

## Cliente

El txt se crea en `clients/terminal/users-gender.txt`. Es una sola línea de cmd, como el resto de clientes. Importa `usersGender` y hace `console.log` del recuento. No lleva argumentos, no valida y no abre la base.

Se tira desde cmd, en la raíz del repositorio, porque Node resuelve el `import` desde la carpeta de trabajo.
