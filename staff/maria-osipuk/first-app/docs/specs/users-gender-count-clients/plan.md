Issue: #1127

# Plan del recuento de usuarios por género en los clientes

## Enfoque

`src/logic/count-users-by-gender.js` ya existe y devuelve `{ female, male, undefined }`. No se toca. Tampoco `src/queries/`, `src/db/server.js`, la terminal, Jupyter, el cliente web ni el cliente `node:http`. No hay dependencias nuevas, así que no hace falta revisión con Socket.

Cada cliente añade una operación que llama a esa función y la presenta. El recorrido es el de las demás operaciones: cliente → lógica → consultas → servidor de datos → SQLite, con una llamada más al clasificador local desde la lógica.

## Entradas y salidas de la lógica

| Operación            | Entrada | Salida                        | Error de la lógica                                 |
| -------------------- | ------- | ----------------------------- | -------------------------------------------------- |
| `countUsersByGender` | ninguna | `{ female, male, undefined }` | `Unable to list users`, `Unable to classify names` |

La salida se expone con esas mismas tres claves y en ese orden. Una tabla vacía devuelve ceros sin llamar al clasificador.

## Cambios por cliente

### Tres clientes con petición

- **Cliente HTTP (`src/clients/http/app.js`, puerto 3001):** ruta `GET /users/gender-count`, declarada antes de `/users/:id` para que `gender-count` no se tome por un id. Responde `200` con el objeto.
- **API de Chrome (`src/clients/chrome/api.js`, puerto 3002):** la misma ruta, con el mismo orden y la misma respuesta.
- **Cliente Nest:** `users.service.js` añade `countByGender()`, que llama a la lógica; `users.controller.js` declara `@Get("users/gender-count")` antes de `users/:id`; el filtro de errores decide el estado. La ruta se describe también en la página Swagger.

### Tres clientes con pestaña

- **Ventana de escritorio:** `user-actions.js` añade `countUsersAction()`, que devuelve `{ data }` o `{ error }` como las demás; `main.js` registra el canal `users:count`; `preload.cjs` publica `window.users.count()`. La página añade las dos pestañas, la de Recuento con su botón y los tres números. La política de seguridad de la página no cambia: sigue sin red.
- **Panel de VS Code:** `user-actions.js` añade `countUsersAction()`; `extension.js` añade la acción `"count"` al mensaje; `view.js` y `index.html` añaden las pestañas y el panel de Recuento. La política de seguridad no cambia.
- **Extensión de Chrome:** `popup.html`, `popup.js` y `styles.css` añaden las pestañas; `popup.js` hace `fetch` a `GET /users/gender-count` de la API y muestra los números. `manifest.json` no cambia: `host_permissions` ya cubre esa dirección.

Las tres páginas escriben los números con `textContent`. La pestaña de usuarios conserva la selección y los formularios al cambiar de pestaña.

## Errores

La frase `Could not classify the users.` no existe hoy en `src/logic/`, que lanza `Unable to classify names` y `Unable to list users`, y esos textos los usan la terminal y Jupyter, que no cambian. Por eso la frase nace en cada cliente, como `Request JSON is invalid`, y la lógica no se modifica:

- **Clasificador:** los tres clientes con petición responden `500` con `{ message: "Could not classify the users." }` ante `Unable to classify names`. Las tres páginas con pestaña convierten ese mismo error en esa frase, en inglés tal cual, también en VS Code y en escritorio, sin pasar por su tabla `MESSAGES` en español.
- **Usuarios no legibles:** `Unable to list users` conserva su tratamiento de siempre. Los tres clientes con petición responden `500` con ese mensaje, como en el listado. Chrome lo muestra tal cual y VS Code y escritorio usan la frase en español que su tabla `MESSAGES` ya tiene.
- **Error desconocido:** los tres clientes con petición responden `500` con `Could not classify the users.`, nunca otro texto. Las páginas con pestaña de VS Code y escritorio muestran su frase genérica de siempre.
- Sin usuarios no hay error, y no se contacta con el clasificador.
- Si la API de Chrome está parada, la extensión sigue mostrando `Unable to reach the API`, como en el resto de operaciones.

## Colección de Bruno

Se añaden dos peticiones a `src/clients/http/bruno/`, con el estilo de las existentes:

- `01-sql-online/14-count-empty.bru`: `GET {{baseUrl}}/users/gender-count` al final de la carpeta, cuando Ada ya está borrada y la base vuelve a estar vacía. Comprueba estado `200` y el cuerpo `{ female: 0, male: 0, undefined: 0 }`, sin necesitar la IA local.
- `02-sql-offline/20-count-sql-offline.bru`: con el servidor de datos parado, comprueba estado `500` y `{ message: "Unable to list users" }`.

Para dejar el orden, las cinco peticiones de `02-sql-offline` pasan de 14-18 a 15-19, con su `seq`. `README.md` pasa a 14 y 6 peticiones, y `docs/TREE.md` recoge los archivos nuevos. Con la base real y usuarios guardados, la petición del recuento no se lanza: la colección sigue pidiendo una base temporal.

## Pruebas

- Las dos peticiones de Bruno se lanzan a mano con una base temporal, como el resto de la colección.
- Una prueba por cliente que se puede lanzar con Node (HTTP, API de Chrome, Nest, y `user-actions.js` de escritorio y de VS Code) con base temporal y datos ficticios: tabla vacía devuelve tres ceros, y el orden de las claves es el pedido.
- El fallo con usuarios y sin IA local se prueba solo si nada escucha en el puerto del clasificador; si lo hay, la prueba se omite y se comprueba a mano.
- El caso correcto con IA real y la comprobación visual de las pestañas se hacen a mano, en los cinco clientes, con datos ficticios en una base temporal. Se comprueba que los cinco dan los mismos números.
- `pnpm test`, `pnpm lint` y `pnpm format` limitado a los archivos del pedido.

## Documentos que se actualizan al implementar

- `README.md`: la sección de Bruno (14 y 6 peticiones) y cómo pedir el recuento en cada cliente y qué se ve en Recuento.
- `docs/ARCHITECTURE.md` y `docs/TREE.md`: la operación nueva en cada cliente y los archivos de prueba que se añadan.
- `docs/ERRORS.md`: la frase nueva y dónde nace.
- `docs/CONSTITUTION.md`: se amplía el apartado 1 con el recuento en los cinco clientes (enmienda autorizada).
- `docs/STYLE.md`, `docs/DATABASE.md` y `AGENTS.md` no cambian.

## Decisiones tomadas

1. Con usuarios no legibles se ve el `Unable to list users` de siempre.
2. En VS Code y escritorio, la frase del clasificador va en inglés.
3. Se enmienda la constitución: se amplía su apartado 1 y se autoriza esa enmienda.
4. La ruta HTTP es `GET /users/gender-count`.
5. Bruno entra, con las dos peticiones de arriba.
