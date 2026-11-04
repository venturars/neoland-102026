# Plan — alta y conteo por género en el cliente de navegador

Issue: #962.

No es una funcionalidad nueva de negocio. No hay fichero nuevo en `src/logic/`, ni firma nueva ni SQL nuevo ni mensaje nuevo ni paquete de Node. El cliente de navegador llama a funciones que ya existen, como ahora.

El código actual, la constitución y la spec coinciden para el alta. Para el conteo hay una pregunta al final: el navegador no puede cargar `openai`, y `usersGenderCount()` lo usa.

Se tocan solo los tres ficheros de `src/clients/web/`. El de escritorio, Chrome, HTTP, terminal y Jupyter no se tocan. No se copia el cambio a esas carpetas.

Los recuadros nuevos van dentro de `#selection-screen`, después del formulario de lista y antes de cerrar la sección. Cada uno es un `div` con título y descripción. El de alta lleva nombre, email y un botón para crear. El de conteo muestra mujer, hombre e indefinido. Los textos visibles van en español. Un fallo muestra el mensaje que ya lanza `src/logic/`, sin traducirlo.

El recuadro de alta se parece al formulario de edición: mismos campos nombre y email. El recuadro de conteo se parece al resumen del menú: un bloque con borde, aparte del desplegable.

## Ficheros

Se crean: ninguno fuera de esta carpeta de spec.

Se tocan en la implementación (`tasks.md`):

- `src/clients/web/index.html`
- `src/clients/web/styles.css`
- `src/clients/web/app.js`
- `docs/ARCHITECTURE.md`

No se tocan `src/logic/`, `src/queries/`, `src/db/`, `package.json` ni los otros clientes. No hay cliente `.txt` nuevo: ya existen `create-user.txt` y `user-gender-count.txt`.

En la arquitectura, `src/clients/web/index.html` y `app.js` pasan a describir los dos recuadros de la pantalla de selección. `docs/TREE.md` no cambia: siguen tres ficheros en `web/`.

## Llamadas

No hay función nueva. Firmas reales de `src/logic/`:

| Recuadro        | Llamada                           |
| --------------- | --------------------------------- |
| Listar (ya)     | `listUsers()`                     |
| Crear usuario   | `createUser({ name, email })`     |
| Conteo          | `usersGenderCount()`              |

Tras un alta correcta, se vuelve a pedir la lista para que el nuevo salga en el desplegable, y se vuelve a pedir el conteo.

`createUser` se parece a `updateUser` en `app.js`: lee nombre y email, `await`, muestra el mensaje de `src/logic/` si falla.

`usersGenderCount` no tiene parangón en `app.js`. El único cliente que ya la llama es el `.txt` de terminal.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                          | Mensaje                       |
| ----------------------------------------- | ----------------------------- |
| El nombre queda vacío                     | `Name is empty`               |
| El email no vale                          | `Email is invalid`            |
| El email es el de otro usuario            | `Email is already used`       |
| No se puede guardar el usuario            | `Could not create the user`   |
| No se puede clasificar                    | `Could not classify the users` |

La lista vacía y el conteo a cero no son un fallo.

## Arranque

Siguen `pnpm server` y `pnpm web`. Ollama tiene que estar en marcha para el conteo. No hay script nuevo.

## Pregunta

`src/clients/web/app.js` importa `src/logic/` y se abre como archivo local en Brave. `createUser` solo habla con la base por HTTP, igual que `listUsers`: cabe igual.

`usersGenderCount` importa el paquete `openai` y habla con Ollama. El navegador no resuelve ese paquete. Importarlo en `app.js` como las demás funciones no corre en Brave.

¿Qué camino se sigue para el conteo?

1. Importar `usersGenderCount` en `app.js` igual que `listUsers`, y aceptar que hay que cambiar cómo se abre el cliente web para que Node cargue `openai`.
2. El recuadro de conteo pide el resultado a un cliente HTTP de este equipo (Express en 3001 o Fastify en 3002), sin importar `user-gender-count.js` en el navegador. Eso se aparta de «el cliente web llama a `src/logic/`».
3. Otro camino, que hay que decir antes de `tasks.md`.

No hay `tasks.md` hasta que una persona revise este plan y la spec, y responda esta pregunta.
