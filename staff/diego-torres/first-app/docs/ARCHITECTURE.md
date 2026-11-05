# Arquitectura

La app tiene cuatro capas. Cada una solo habla con la de debajo.

1. `src/clients/` — muestra datos y pide acciones. Llama a `src/logic/`.
2. `src/logic/` — las reglas. Se ejecuta en el cliente: navegador, ventana de Electron, API de la extensión de Chrome, extensión de VS Code, API de Nest, terminal o Jupyter. Llama a `src/queries/`.
3. `src/queries/` — el texto SQL y su envío al servidor. No tiene reglas.
4. `src/db/` — el servidor que abre la base y ejecuta el SQL. Solo datos: no sirve la web. No tiene reglas.

Ningún cliente funciona sin el servidor en marcha (`pnpm start`). La web no la sirve nadie: se abre como fichero local con `pnpm browser`.

## Quién sabe qué

| Carpeta o fichero | Qué sabe |
| --- | --- |
| `src/db/server.js` | Todo `src/db/`: abre `src/db/users.sqlite`, crea la tabla al empezar y atiende `/execute` en `127.0.0.1:3000` |
| `src/queries/queries/*.js` | Una frase SQL por fichero, exportada como constante |
| `src/queries/users.js` | Envía cada frase al servidor con `fetch` y devuelve las filas |
| `src/logic/shared.js` | Qué es un nombre y un email válidos, y la copia de salida de un usuario |
| `src/logic/<operación>.js` | Una operación por fichero: crear, modificar, borrar, listar y las tres búsquedas |
| `src/logic/users-gender-count.js` | Cuenta usuarios por el género del nombre. No guarda nada |
| `src/logic/index.js` | Reexporta las operaciones |
| `src/clients/web/*` | Cliente de navegador en HTML, CSS y JS vanilla. Se abre como fichero e importa `src/logic/` con rutas relativas |
| `scripts/browser.js` | Abre `src/clients/web/index.html` en Chrome, con un perfil aparte y `--allow-file-access-from-files` |
| `src/clients/electron/*` | Cliente de escritorio con ventana propia, abierto con `pnpm electron`. `main.js` abre la ventana y la página importa `src/logic/` con rutas relativas. No reutiliza `src/clients/web/` |
| `src/clients/chrome/server.js` | API de la extensión, con Fastify, en `127.0.0.1:3002`. La lanza `pnpm chrome`. Llama a `src/logic/`, no tiene reglas y comprueba `Host` y `Origin` |
| `src/clients/chrome/*` | Extensión de Chrome: `manifest.json`, `index.html`, `popup.js` y `styles.css`. Solo llama a su API, porque una extensión no carga ficheros de fuera de su carpeta |
| `src/clients/vscode/*` | Extensión de VS Code con una vista lateral. `extension.js` corre en Node y llama a `src/logic/`. `panel.js` solo habla con `extension.js` y pinta las respuestas |
| `scripts/vscode.js` | Abre el editor en modo desarrollo con la extensión de `src/clients/vscode/` |
| `src/clients/nest/*` | API de usuarios con Nest, en `127.0.0.1:3003`. La lanza `pnpm nest`. Llama a `src/logic/`, no tiene reglas y comprueba `Host` y `Origin` |
| `scripts/nest.js` | Traduce los decoradores con Babel a `dist/`, que no está en git, y arranca la API. La configuración está en `babel.config.json` |
| `src/clients/terminal/*.txt` | Un cliente por operación, para pegar en la terminal |
| `src/clients/jupyter/*.ipynb` | Un cuaderno por operación, que abre `pnpm run jupyter` |

## Usuario

Un usuario es `{ id, name, email, createdAt, updatedAt }`, tal como lo guarda SQLite. `id` es un número.

Para crearlo hacen falta el nombre y el email. El nombre se recorta y no puede quedar vacío. El email se recorta, pasa a minúsculas y tiene la forma texto, una `@` y un punto en el dominio, sin espacios y con 64 caracteres como mucho.

Para modificarlo puede llegar el nombre, el email o los dos. Lo que no llega se queda como estaba. Lo que llega se valida igual que al crear.

El email es único. Lo decide `logic` buscando el email en la base. El `UNIQUE` de la tabla es la última defensa, no la regla.

## Operaciones

| Firma | Salida |
| --- | --- |
| `createUser({ name, email })` | usuario |
| `updateUser(id, { name, email })` | usuario |
| `deleteUser(id)` | usuario borrado |
| `findUserById(id)` | usuario |
| `findUserByEmail(email)` | usuario |
| `findUserByName(name)` | array de usuarios |
| `listUsers()` | array de usuarios |
| `usersGenderCount()` | `{ women, men, genderUndefined }` |

Todas son `async`. El orden interno es siempre el mismo: primero lo que se decide con los datos en la mano, después lo que mira la base, después guardar o borrar y al final la copia de salida.

`usersGenderCount` usa la IA local `llama3.2` por Ollama. Si no hay usuarios, devuelve tres ceros y no llama a la IA.
