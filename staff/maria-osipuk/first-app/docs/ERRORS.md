# Errores

Los errores se gestionan en `src/logic/`, cerca de la regla de negocio que puede fallar.

Cuando una entrada o una regla de negocio no es válida, la función lanza un `Error` con un mensaje claro en inglés:

```js
throw new Error("User email is invalid");
```

El mensaje explica el problema de forma comprensible. No se utilizan códigos opacos, clases de error propias ni objetos genéricos como `{ ok: false, error }`.

Mensajes de referencia para esta aplicación:

- `User id must be a positive integer`;
- `User name is required`;
- `User email is invalid`;
- `User email is already registered`;
- `User does not exist`.

Los errores internos de SQLite nunca llegan directamente al cliente. El servidor de datos responde `500` sin cuerpo, `src/queries/users.js` lanza `Query failed` y `src/logic/` lo captura y lanza un nuevo error que identifica la operación que no pudo completarse. Lo mismo ocurre si el servidor de datos no está arrancado: `fetch` falla y el cliente recibe el error de la operación.

Mensajes de referencia para errores de operación:

- `Unable to create user`;
- `Unable to update user`;
- `Unable to delete user`;
- `Unable to list users`;
- `Unable to find user`.

Ejemplo:

```js
let user;

try {
  user = await findUserByEmail(email);
} catch {
  throw new Error("Unable to find user");
}
```

## Traducción en cada cliente

Cada cliente tiene su propia copia de las frases en español, para que pueda cambiarse o quitarse sin afectar a los demás. Un mensaje desconocido muestra una frase genérica, nunca el texto original.

La excepción es el cliente REST, que no presenta frases a una persona: responde con el mensaje en inglés de `src/logic/`.

## Navegador

`src/clients/web/app.js` captura el error de la función de `src/logic/` y lo traduce con su tabla `MESSAGES`. Los errores de operación añaden que se compruebe que el servidor de datos está arrancado. Conserva los campos escritos cuando falla un alta o un guardado. Una lista vacía solo se muestra después de una carga correcta sin usuarios.

## Cliente REST

`src/clients/http/app.js` captura el error en cada ruta y responde JSON con la clave `message` y el estado que corresponde: `400` si la entrada no es válida, `404` si el usuario no existe y `409` si el email ya está registrado. Un error de operación o un mensaje desconocido responde `500` con el `Unable to` de esa ruta, nunca con otro texto.

`Request JSON is invalid` es el único mensaje propio del cliente, porque un cuerpo que no se puede leer falla antes de llegar a `src/logic/`. Responde `400`, sin la página de error de Express.

## Jupyter

`src/clients/jupyter/run_logic.py` traduce con su tabla `MESSAGES` y deja el detalle técnico en `jupyter-client.log`.
