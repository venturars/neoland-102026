# Estilo

## Idioma
- Código, nombres de ficheros, funciones y variables, y mensajes de error y de salida: en inglés.
- Comentarios en español, solo donde haya algo no evidente, más uno al principio de cada fichero con su responsabilidad.

## Nombres
- Ficheros en kebab-case: `create-user.js`, `create-user.txt`, `create-user.ipynb`.
- Funciones y variables en camelCase: `createUser`, `normalizedEmail`.
- Un valor fijo de la app es una constante en mayúsculas: `MODEL_NAME`.

## Módulos
- Imports ESM con la extensión `.js`.
- Exportaciones con nombre. La única exportación por defecto es la conexión de `db/connection.js`.
- Sin clases.

## Líneas
- Cada línea hace una sola acción: una llamada o una comprobación.
- `email?.trim().toLowerCase()` se escribe en líneas separadas, cada paso con su nombre:

```js
const trimmedEmail = email.trim();
const normalizedEmail = trimmedEmail.toLowerCase();
```

- Un fallo se comprueba con `if` y `throw new Error`, en su propia línea. Los mensajes están en [ERRORS.md](ERRORS.md).
- Sin expresiones condensadas ni trucos de sintaxis: el código se escribe como lo escribiría un junior a mano.

## Formato
- El formato es el estándar de Prettier, sin configuración propia: comillas dobles, punto y coma, coma final, sangría de 2 espacios y ancho de 80.
- Se lanza con `pnpm format`. `pnpm lint` revisa el código con ESLint.

## Plantillas
- Para un fichero de `logic/`: `logic/createUser.js`.
- Para un cliente de terminal: `clients/terminal/createUser.txt`.

## Pendiente
El código de hoy no cumple todavía:
- Los nombres de ficheros: están en camelCase (`createUser.js`).
- Una acción por línea: hay líneas como `email?.trim().toLowerCase()`.
- Los campos que devuelve `logic/`, descritos en [DATABASE.md](DATABASE.md).

Lo alinea la tarea que aplica las guías al código. Hasta entonces, el código nuevo sigue estas reglas.
