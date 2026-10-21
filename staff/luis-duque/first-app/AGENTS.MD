# Instrucciones del agente

Trabajas en `staff/luis-duque/first-app`. Estas instrucciones son para ti. Léelas antes de cambiar código y síguelas. Una persona también tiene que poder leerlas. No uses el nombre de nadie: escribe en general.

El proyecto gestiona usuarios: crear, actualizar y eliminar. No hagas otra operación salvo que te la pidan.

Si el código y este archivo no coinciden, no cambies el estilo por tu cuenta. Pregunta.

## Alcance

No añadas pantalla, servidor ni framework.

No crees una carpeta `business` ni un `README`. La explicación para personas está en `docs/CONSTITUTIONS.MD`.

No crees clases de error. Usa `Error`.

No recuperes `user.js`, `user-repository.js` ni `sqlite-user-repository.js`.

No crees consultas ni funciones que no te hayan pedido. No existen `findById` ni `findByEmail`. Las únicas operaciones son crear, actualizar y eliminar.

No uses `try/catch` en `queries/users.js`. Si SQLite rechaza un email repetido, deja salir ese error.

No separes otra vez la lógica de la base de datos. `logic` llama a `queries`. `queries` usa la conexión de `BD`.

## Dónde va cada cosa

Pon la conexión y el esquema SQLite en `BD`: `connection.js`, `users.sqlite` y, cuando se abra la base, `users.db`.

Pon la validación y las operaciones en `logic`: `shared.js`, `create-user.js`, `update-user.js` y `delete-user.js`. `shared.js` va dentro de `logic`, no en la raíz.

Pon la ejecución del SQL en `queries/users.js`. Pon el texto de cada consulta en `queries/queries`, en `create-user.sql`, `update-user.sql` y `delete-user.sql`.

Pon la explicación general del proyecto en `docs/CONSTITUTIONS.MD`.

## Cómo nombrar

Escribe los nombres de archivo en inglés.

Usa un archivo por acción, con la forma `accion-user`. En `logic` no termines un nombre en `query`.

Nombra cada `.sql` igual que su acción: `create-user.sql`, `update-user.sql`, `delete-user.sql`.

Llama al esquema `users.sqlite`. No uses `users.sql` ni `schema.sql`.

Llama `users.db` al archivo que crea SQLite.

En `logic/shared.js` llama a las validaciones `validateNombre`, `validateEmail` y `validateId`. La del nombre lleva `Nombre`.

## Cómo escribir el código

Usa módulos de JavaScript: `import` y `export`. `package.json` ya tiene `"type": "module"`.

Deja la conexión solo en `BD/connection.js`. Mantenla corta: abre `users.db`, aplica `users.sqlite` y exporta `database`. No abras la base en ningún otro archivo.

Haz que `queries/users.js` sea el único archivo que lee los `.sql` y los ejecuta.

No escribas SQL en `logic` y no abras SQLite desde ahí. Valida y llama a `insertUser`, `saveUser` o `removeUser`.

No valides dentro de `queries`. Ejecuta la consulta que corresponde.

## Datos

Un usuario tiene `id`, `name` y `email`.

Haz que `validateNombre` exija un texto, le quite los espacios de los extremos y rechace más de 100 caracteres.

Haz que `validateEmail` exija un texto, le quite los espacios, lo pase a minúsculas y compruebe que tenga forma de email.

Haz que `validateId` acepte un entero positivo. Un texto numérico como `"3"` vale y se convierte a número.

Deja que SQLite asigne el `id` al crear. No lo generes en la lógica.

Mantén el email único en la tabla. No añadas una consulta previa para comprobarlo.

Al actualizar, acepta solo el nombre, solo el email o los dos. Conserva el campo que no llega. Exige al menos uno. Si el `id` no existe, ninguna fila cambia y `logic` lanza un `Error`.

Al eliminar, si el `id` no existe, ninguna fila se borra y `logic` lanza un `Error`.

## Qué documentos mantienes

Mantén los dos documentos en el mismo cambio que provoque la novedad.

`docs/CONSTITUTIONS.MD` es para una persona. Déjalo con una explicación corta de la app, el árbol de carpetas, una explicación general de cada componente y los pasos de crear, actualizar y eliminar. No lo conviertas en un recorrido archivo por archivo. Actualízalo cuando cambie el comportamiento, la estructura o el papel de un componente. Tiene que coincidir con el código.

Este archivo, `AGENTS.MD`, es tu información de agente. Actualízalo cuando te den una regla, un estilo, un nombre o algo que haya que hacer o dejar de hacer. Sigue siendo concreto y legible. Conserva las reglas que sigan en vigor. Si una instrucción nueva anula otra, quédate solo con la nueva. No pongas nombres de personas.

## Git

`.cursor/` está en el `.gitignore` de la raíz del repositorio. No lo quites de ahí y no lo subas.
