# Plan: Cliente API REST

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md) y sus guías. Añade un paquete, `express`, validado con Socket más abajo (principio 8). Sin cambios en la tabla.

## Dónde encaja
La API es un cliente: llama a `logic/` como la terminal y responde por HTTP.

```
petición HTTP → src/clients/rest/server.js (Express, 127.0.0.1:3000)
                   │ import
                   ▼
                src/logic/*  →  src/queries/users.js  →  servidor de la base (4000)
```

No valida nada ni decide mensajes: el resultado y el mensaje del error salen de `logic` tal cual. Lo único suyo es elegir el código HTTP según el mensaje.

## Ficheros
```
src/clients/rest/server.js   NUEVO: las rutas de la API
package.json                 express 5.3.0, el script api y format de la carpeta nueva
pnpm-lock.yaml               lo actualiza pnpm
docs/ARCHITECTURE.md, docs/TREE.md, AGENTS.md
```
No se tocan `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Paquete | `express` 5.3.0, la última, con versión exacta en `dependencies` (`pnpm add express@5.3.0 --save-exact`) | Lo pide la issue. Las demás dependencias del proyecto también van con versión exacta |
| Dirección | `127.0.0.1:3000`. `HOST` y `PORT` son constantes | Solo este equipo. El 3000 está libre desde que el navegador se abre desde el disco |
| Arranque | `pnpm api`, que lanza `node --no-warnings src/clients/rest/server.js` y escribe `REST API: http://127.0.0.1:3000` | Igual que `pnpm db` |
| Rutas | Las de la tabla de la spec. Cada una es una función con nombre que lee la petición, llama a una función de `logic/` con `await` y responde | Una ruta por operación, como un `.txt` por operación |
| Buscar | `GET /users` lista; con `?name=` busca por nombre. El email va en `GET /users/email/<email>` | Buscar por nombre devuelve una lista, como filtrar la colección. Buscar por email devuelve uno o da 404 |
| Modificar | `PATCH /users/<id>`. Pasa `body.name` y `body.email` a `updateUser` sin tocarlos | `updateUser` ya trata lo que no es texto, o está vacío, como «no cambiar». `PATCH` es cambiar una parte |
| Ids | El `<id>` llega como texto y lo valida `logic`, como desde la terminal | Sin validar en el cliente |
| Errores | Un solo manejador de errores de Express al final. Elige el código mirando cómo empieza el mensaje, con la tabla de abajo. Responde `{ "error": error.message }` | Express 5 lleva ahí los errores de las funciones `async`. Los mensajes no cambian: [ERRORS.md](../../ERRORS.md) |
| Ruta desconocida | Lo último antes del manejador de errores: 404 y `{ "error": "Not found." }` | Las mismas palabras que el servidor de la base |
| Cuerpo que no es JSON | `express.json()` lo rechaza. El manejador lo reconoce por `error.type === "entity.parse.failed"` y responde 400 y `Invalid request.` | Las mismas palabras que el servidor de la base |
| Llamadas desde una web | Sin permiso para navegadores (sin `Access-Control-Allow-Origin`) | Queda fuera de alcance. `PATCH`, `DELETE` y `POST` con JSON necesitan ese permiso, así que una web no puede cambiar ni borrar usuarios |
| Estilo | El de [STYLE.md](../../STYLE.md): funciones con nombre, una acción por línea, sin `?.` | Igual que el resto del código |

## Del mensaje al código HTTP
| El mensaje empieza por | Código |
|---|---|
| `Name is required.`, `Email is required.`, `Invalid email:`, `Invalid id:`, `Provide a new name, a new email, or both.` | 400 |
| `User not found:` | 404 |
| `Email already exists:` | 409 |
| `Users could not be classified:` | 502 |
| `Database is not running.` | 503 |
| Cualquier otro | 500 |

La lista de prefijos es una constante del fichero. `classifyGender` envuelve también el de base parada, así que con la base parada `GET /users/genders` da 502 con el mensaje envuelto.

## `server.js`
1. Comentario inicial con su responsabilidad.
2. Imports: `express` y las siete funciones de `logic/`.
3. `HOST`, `PORT` y las listas de prefijos de cada código.
4. `getStatus(message)`: devuelve el código según la tabla.
5. Una función por ruta: `listOrFindByName`, `findByEmail`, `create`, `update`, `remove` y `countGenders`.
6. `handleNotFound` y `handleError(error, request, response, next)`.
7. `app.use(express.json())`, las rutas, `handleNotFound`, `handleError` y `app.listen(PORT, HOST)`.

## Validación con Socket
Paquete nuevo: `express@5.3.0`. Sus dependencias, sacadas de `npm view` y de un `package-lock` de prueba fuera del proyecto, son 53 paquetes hasta la capa 3: 28 en la 1, 18 en la 2 y 7 en la 3. Revisado el 2026-11-04.

- **Puntuaciones (`depscore`)**: los 54 contestan. Ninguna puntuación baja de 50. Las más bajas:
  - `safer-buffer@2.1.2`: mantenimiento 50 y cadena de suministro 67.
  - `es-define-property@1.0.1` y `side-channel@1.1.1`: mantenimiento 53 y cadena de suministro 66.
  - `express@5.3.0`: licencia 100, mantenimiento 92, calidad 100, cadena de suministro 97 y vulnerabilidades 100.
- **Alertas (`alerts`)**, con la organización `sergiomoras`: la lista está vacía. Es la lista de alertas de la organización, no dice que estas versiones no tengan alertas.
- **Campañas (`threat_feed`)**: responde `403 threat_feed_not_entitled`. La cuenta no tiene esa fuente.

Quien acepta el plan acepta estas puntuaciones.

## Cómo se prueba
- Con `pnpm db` y `pnpm api` en marcha, `curl` contra cada ruta con un usuario temporal `tmp-877-1`: crear, listar, buscar por email y por nombre, modificar el nombre, el email y los dos, y borrar.
- Los errores de la spec, cada uno con su código: datos que faltan, email inválido o repetido, modificar sin nada, id inexistente y no numérico, ruta y método que no existen, y un cuerpo que no es JSON.
- `GET /users/genders` con Ollama.
- Con la base parada, 503.
- Al terminar no queda ningún `tmp-877-*` y `list-users.txt` da lo mismo que al empezar.
- `pnpm format` y `pnpm lint` sin errores.
