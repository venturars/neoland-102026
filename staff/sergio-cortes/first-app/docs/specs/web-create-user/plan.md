# Plan — alta de usuario en el cliente de navegador

Issue: #962.

No es una funcionalidad nueva de negocio. No hay fichero nuevo en `src/logic/`, ni firma nueva ni SQL nuevo ni mensaje nuevo ni paquete de Node. El cliente de navegador llama a `createUser`, que ya existe, igual que llama a `listUsers` y a `updateUser`.

El código actual, la constitución y la spec coinciden. `createUser` solo habla con la base por HTTP, como `listUsers`. No usa `openai`.

Se tocan solo los tres ficheros de `src/clients/web/`. El de escritorio, Chrome, HTTP, terminal y Jupyter no se tocan. No se copia el cambio a esas carpetas.

El recuadro de alta va dentro de `#selection-screen`, después del formulario de lista y antes de cerrar la sección. Es un `div` con título, descripción y un formulario de nombre y email. Los textos visibles van en español. Un fallo muestra el mensaje que ya lanza `src/logic/`, sin traducirlo.

El formulario se parece al de edición: mismos campos nombre y email. Los `id` no se reutilizan (`create-user-name`, `create-user-email`). El recuadro tiene borde y queda aparte del desplegable.

Tras un alta correcta, se vacían los campos y se vuelve a pedir la lista para que el nuevo salga en el desplegable.

## Ficheros

Se crean: ninguno fuera de esta carpeta de spec.

Se tocan en la implementación (`tasks.md`):

- `src/clients/web/index.html`
- `src/clients/web/styles.css`
- `src/clients/web/app.js`
- `docs/ARCHITECTURE.md`

No se tocan `src/logic/`, `src/queries/`, `src/db/`, `package.json` ni los otros clientes. No hay cliente `.txt` nuevo: ya existe `create-user.txt`.

En la arquitectura, `src/clients/web/index.html` y `app.js` pasan a describir el recuadro de alta en la pantalla de selección. `docs/TREE.md` no cambia: siguen tres ficheros en `web/`.

## Llamadas

No hay función nueva. Firmas reales de `src/logic/`:

| Recuadro      | Llamada                       |
| ------------- | ----------------------------- |
| Listar (ya)   | `listUsers()`                 |
| Crear usuario | `createUser({ name, email })` |

`createUser` se parece a `updateUser` en `app.js`: lee nombre y email, `await`, muestra el mensaje de `src/logic/` si falla.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                    | Mensaje                     |
| ----------------------------------- | --------------------------- |
| El nombre queda vacío               | `Name is empty`             |
| El email no vale                    | `Email is invalid`          |
| El email es el de otro usuario      | `Email is already used`     |
| No se puede guardar el usuario      | `Could not create the user` |

La lista vacía no es un fallo.

## Arranque

Siguen `pnpm server` y `pnpm web`. No hay script nuevo.
