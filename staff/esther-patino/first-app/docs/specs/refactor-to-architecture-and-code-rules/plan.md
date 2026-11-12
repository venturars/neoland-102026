# Plan — el código sigue las guías y la app hace lo mismo

Refactor del código que ya existe. No añade una acción. No cambia una firma. No hay SQL nuevo. No se instala un paquete ni se cambia su versión.

La spec pide que el código siga las reglas de arquitectura y de código ya escritas, y que lo que se ve siga igual. La constitución, `docs/style.md` y `docs/ARCHITECTURE.md` dicen cómo se lee ese código. El código actual hace las mismas acciones, con los mismos mensajes, y en varios sitios no se lee así: hay un helper genérico, hay valores fijos escritos en camelCase, hay líneas que hacen dos cosas y hay `?.` y `??`.

Esas cuatro cosas se reescriben. El resultado de cada acción queda igual.

## Ficheros

Se tocan:

- `logic/shared.js` — las comprobaciones se leen con `if`, una cosa por línea
- `logic/create-user.js` — el dato que llega se lee sin `?.`, y guardar y dejar el usuario plano van en líneas distintas
- `logic/list-users.js` — leer la lista y dejarla plana van en líneas distintas
- `logic/update-user.js` — el nombre y el email que no vienen se copian con `if`, no con `??`
- `logic/users-gender-count.js` — los valores fijos pasan al principio del archivo, y la respuesta de la IA se lee con `if`
- `queries/users.js` — desaparece el helper que lee el SQL; cada consulta lee su archivo y lo ejecuta
- `db/connection.js` — los valores fijos pasan al principio, con el nombre en mayúsculas
- `scripts/jupyter.js` — los valores fijos pasan al principio, y el código de salida vacío se lee con `if`

Se abren y no se reescriben si ya cumplen el orden y una línea hace una sola cosa:

- `logic/find-user-by-email.js`
- `logic/find-user-by-id.js`
- `logic/find-user-by-name.js`
- `logic/delete-user.js`

No se tocan los `.sql`. Ya usan `:id`, `:name` y `:email`.

No se tocan los clientes de `clients/terminal/` ni los de `clients/jupyter/`. Siguen importando los mismos nombres.

No se tocan las guías, `package.json`, `pnpm-lock.yaml`, `eslint.config.js` ni las specs ya escritas.

No se crea ningún archivo.

## Parecido

Cada archivo de `logic/` se parece a sí mismo. No se copia el cuerpo de otro.

Las firmas no cambian:

- `validateName(value)` devuelve el nombre sin espacios de los extremos, o lanza `Name is empty`.
- `validateEmail(value)` devuelve el email en minúsculas, o lanza `Email is invalid`.
- `validateId(value)` devuelve el id, o lanza `Invalid id`.
- `toUser(user)` devuelve el usuario plano.
- `createUser(input)` devuelve el usuario plano.
- `listUsers()` devuelve la lista de usuarios planos. Si no hay filas, devuelve `[]`.
- `findUserByEmail(email)` devuelve el usuario plano, o lanza `User not found`.
- `findUserById(id)` devuelve el usuario plano, o lanza `User not found`.
- `findUserByName(name)` devuelve la lista de usuarios planos, o lanza `Could not find the user` si la lectura falla.
- `updateUser(id, changes)` devuelve el usuario plano. Si no hay nombre ni email nuevos, devuelve el usuario que ya estaba.
- `deleteUser(id)` termina en `removeUser` y no devuelve el usuario.
- `usersGenderCount()` devuelve `{ women, men, undefinedUser }`.

Siguen exportados, porque los clientes ya los llaman así: `insertUser`, `findAll`, `findByEmail`, `findById`, `updateUserQuery` y `removeUser`. Quitarlos cambiaría lo que hacen esos clientes.

`toUser` se queda. `logic/shared.js` es quien deja el usuario plano.

## Qué cambia en la lectura

Un valor que no cambia y no sale de un argumento se escribe al principio del archivo. El nombre va en mayúsculas, con `_` entre palabras. Un valor que sale de un argumento sigue en camelCase, dentro de la función.

En `queries/users.js`, cada función lee su `.sql`, prepara la consulta y la ejecuta. El orden de las funciones no cambia. Los parámetros con nombre no cambian.

En `db/connection.js` se sigue abriendo `db/users.sqlite` y se sigue creando la tabla al abrir. Solo cambia cómo se nombran los valores fijos.

En `users-gender-count.js` se quedan el modelo, la dirección local, los lotes de 6 nombres y el texto de ejemplo. Esos valores pasan al principio. Si no hay usuarios, siguen siendo tres ceros. Si la IA no manda un mensaje o no manda un sexo por nombre, esos nombres siguen contando como `undefinedUser`.

Donde hoy hay `?.` o `??`, se escribe un `if` que deja el mismo valor.

## Errores

Cada fallo de la spec sigue con su frase:

- El nombre no vale: `Name is empty`.
- El email no vale: `Email is invalid`.
- El email ya está en otro usuario: `Email is already used`.
- El id no vale: `Invalid id`.
- No está el usuario al buscar, cambiar o borrar: `User not found`.
- Falla la búsqueda por nombre: `Could not find the user`.
- No se puede hacer el recuento: `Could not classify the users`.

No se añade una frase. No se cambia una frase.

## Comprobación

Las firmas y los clientes se quedan. La comprobación es pegar los `.txt` de `clients/terminal/` desde la raíz del repositorio. El resultado tiene que ser el de antes de este cambio.

Al terminar se lanzan `format` y `lint`.
