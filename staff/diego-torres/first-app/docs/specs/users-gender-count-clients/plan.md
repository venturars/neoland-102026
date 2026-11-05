# Plan — contar por género desde Chrome, VS Code y la API de Nest

Issue: #1058

Funcionalidad nueva, solo en `src/clients/chrome/`, `src/clients/vscode/` y `src/clients/nest/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje de error nuevo. No hay paquetes nuevos, así que no hay comprobación de Socket: `openai` ya está instalado en la misma versión.

Los tres clientes llaman a `usersGenderCount()` de `src/logic/users-gender-count.js`, sin cambiarla.

## Ficheros

Se tocan:

- `src/clients/chrome/server.js` — la ruta nueva.
- `src/clients/chrome/index.html` — el botón y la línea del resultado.
- `src/clients/chrome/popup.js` — pide el recuento y lo muestra.
- `src/clients/vscode/extension.js` — la acción nueva en `runAction`.
- `src/clients/vscode/index.html` — el botón y la línea del resultado.
- `src/clients/vscode/panel.js` — envía la acción y muestra el resultado.
- `src/clients/nest/users.service.js` y `users.controller.js` — la ruta nueva.
- `src/clients/nest/logic-exception.filter.js` — el mensaje nuevo en la tabla y su caso en `elegirFallo`.
- `AGENTS.md` — este recuento necesita Ollama con `llama3.2`, y `openai` también lo usan estos tres clientes.
- `docs/ARCHITECTURE.md` — los tres clientes también cuentan por género.

No se crea ningún fichero de código. El resultado reutiliza las clases de estilo que ya usa el usuario visto, así que `styles.css` no cambia.

## API

| Método y ruta | Operación | Respuesta buena |
| --- | --- | --- |
| `GET /users/gender-count` | `usersGenderCount()` | 200, `{ women, men, genderUndefined }` |

Vale para Chrome (3002) y Nest (3003). La comprobación de `Host` y `Origin` de cada API ya cubre todas sus rutas, también esta.

- **Nest:** `@Get("gender-count")` va **antes** de `@Get(":id")`, porque gana la primera ruta que coincide. Si no, `gender-count` se tomaría por un id y saldría `User not found`.
- **Fastify:** elige la ruta fija antes que `:id` sin importar el orden. Se escribe también antes, para que se lea igual que en Nest.

## Ventana de Chrome

Un botón `gender-count` de tipo `button`, que no es un formulario porque no entra ningún dato. Al pulsarlo:

1. Vacía los mensajes, desactiva el botón y muestra «Contando…» con `showMessage`.
2. Llama a `callApi("GET", "/users/gender-count", undefined, "Could not classify the users")`.
3. Si sale bien, quita el aviso y escribe la línea con `textContent`. Si falla, muestra el error.
4. Al terminar, en los dos casos, vuelve a activar el botón.

El botón desactivado evita pedir dos recuentos a la vez.

## Vista de VS Code

- `extension.js`: `action === "gender-count"` devuelve `{ genderCount: await usersGenderCount() }`. No entra en `CAMBIAN_DATOS`, porque no cambia nada.
- `panel.js`: los mismos pasos que en Chrome. `handleReply` escribe la línea, quita «Contando…» y vuelve a activar el botón, también si llega un error.

La línea es igual en las dos extensiones:

`Mujeres: ${women} · Hombres: ${men} · No definidos: ${genderUndefined}`

## Firma

No hay función nueva en `src/logic/`.

## SQL

No hay SQL.

## Errores

| Fallo de la spec | Mensaje de `docs/ERRORS.md` | Estado |
| --- | --- | --- |
| No se llega a la base o la IA no responde | `Could not classify the users` | 500 |
| La API de Chrome está parada | `Could not classify the users`, lo pone `popup.js` | sin estado |

- **Chrome:** `responderError(reply, error, "Could not classify the users")`.
- **Nest:** `"Could not classify the users": 500` entra en `ESTADOS`. `elegirFallo` devuelve ese mensaje si `request.path` es `/users/gender-count`. Sin este caso, un error desconocido saldría como `Could not list the users`, porque la ruta no lleva id.
- **VS Code:** el mensaje llega a la vista tal como sale de la lógica, como en el resto de acciones.

`docs/specs/users-gender-count/` dice que el mensaje es `No se han podido clasificar los usuarios`. Esa spec es antigua. `docs/ERRORS.md`, `docs/specs/sql-server-client-logic/` y el código dicen `Could not classify the users`, y es el que vale. No se cambia.

## Comentarios

Líneas cortas y comentarios por bloques en castellano, también en los imports. Cada comentario es una frase sencilla, que dice qué hace el bloque y, si no es obvio, por qué, sin palabras técnicas sin explicar. Por ejemplo:

- `// Va antes que /users/:id. Si no, "gender-count" se tomaría por un id.`
- `// Desactiva el botón para no pedir dos recuentos a la vez.`

Antes de cada commit se releen los comentarios nuevos con esta regla.

## Lo que ya se ha comprobado

Se llamó a `usersGenderCount()` desde Node con la base y Ollama reales, con 8 usuarios: `{ women: 5, men: 3, genderUndefined: 0 }`. Tardó 22 s la primera vez, con el modelo cargándose, y 3 s la segunda. Por eso la pantalla avisa con «Contando…».

Cargar `users-gender-count.js` hace que `chrome/server.js`, `extension.js` y la API de Nest carguen `openai` al arrancar. Hasta ahora, Chrome lo evitaba importando fichero a fichero. Se sigue importando así, pero este fichero sí lo necesita. Falta comprobar que `openai` carga dentro de la extensión de VS Code: los pasos lo prueban.

## Pruebas

No hay tests en el proyecto. Con `pnpm start`, Ollama, `pnpm chrome` y `pnpm nest` en marcha:

1. `GET /users/gender-count` en 3002 y 3003: 200, y los tres números suman el total de usuarios.
2. Con Ollama parado: 500 con `Could not classify the users`.
3. Con el servidor de datos parado de verdad: 500 con el mismo mensaje. Se avisa a Diego antes de pararlo si lo tiene en marcha.
4. Sin usuarios: tres ceros. **No se prueba en la base real**, porque habría que borrar a todos los usuarios. Se comprueba leyendo el código, que devuelve los ceros antes de llamar a la IA.
5. `Host` ajeno y `Origin` no permitido: 403 en la ruta nueva.
6. `GET /users/1`, `GET /users` y las demás rutas responden como antes.
7. Diego prueba las dos ventanas a mano: el botón, «Contando…», el resultado, y el error con Ollama parado. En VS Code, esto comprueba además que `openai` carga.
8. `pnpm format` y `pnpm lint` pasan. Los saltos de línea que `format` cambia en ficheros ajenos se restauran y no entran en la PR.
