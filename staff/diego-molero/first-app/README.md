# Gestión de usuarios · primera iteración

Aplicación pequeña de Node.js con JavaScript y SQLite. Permite crear, listar,
actualizar y eliminar usuarios. La lógica recibe el acceso a datos como argumento,
por lo que puede utilizarse desde distintas interfaces sin importar SQLite.

## Ejecutar en PowerShell

Requiere Node.js 24.14 o posterior. No hay dependencias externas ni hace falta
ejecutar `npm install`.

```powershell
cd staff/diego-molero/first-app
npm run demo
npm test
npm run db:init
```

- `demo`: muestra las cuatro operaciones, un correo duplicado y un usuario
  inexistente. Utiliza SQLite en memoria; al terminar desaparecen esos datos.
- `test`: ejecuta las pruebas de negocio y de integración con SQLite.
- `db:init`: crea `db/users.sqlite` y la tabla si no existen. Puede repetirse sin
  borrar usuarios. Este archivo de datos queda excluido de Git.

Node.js 24.14 puede mostrar `ExperimentalWarning` al importar `node:sqlite`.
El aviso corresponde a la API de SQLite de esa versión de Node.

## Cómo está dividido

```text
first-app/
  logic/                   Reglas y operaciones de usuarios
    validate-user.js        Validaciones compartidas
    create-user.js
    list-users.js
    update-user.js
    delete-user.js
  repositories/
    sqlite-user-repository.js  Consultas SQL parametrizadas
  db/
    connection.js          Apertura e inicialización de la base
    schema.sql             Definición de la tabla
  clients/terminal/
    demo.js                Ejemplo de consumo de la aplicación
    init-db.js             Inicialización de la base de archivo
  tests/
    helpers/memory-user-repository.js
    users.test.js          Reglas probadas sin SQLite
    sqlite.test.js         Persistencia y consultas reales
  app.js                   Conecta la lógica con el repositorio SQLite
```

El cliente llama a `app.js`. La aplicación proporciona el repositorio a las
funciones de `logic/`. Estas funciones piden operaciones como `findByEmail` o
`insert`, pero no conocen la conexión, las consultas SQL ni la terminal.

Por ejemplo, `createUser(userRepository, input)`:

1. Valida y normaliza nombre y correo.
2. Pregunta al repositorio si existe ese correo.
3. Devuelve un error si ya está registrado.
4. Pide al repositorio que guarde los datos y devuelve el usuario creado.

Esta es la separación principal respecto al ejemplo de clase: `logic/` no importa
las consultas. Las pruebas de negocio utilizan otro repositorio que guarda datos
en un `Map`, sin necesidad de abrir SQLite.

## Datos y reglas

Un usuario contiene `id`, `name`, `email`, `createdAt` y `updatedAt`.

- El identificador es un entero positivo generado por SQLite.
- El nombre es un texto obligatorio. Se eliminan los espacios de los extremos.
- El correo se recorta y convierte a minúsculas antes de consultar o guardar.
- El correo debe tener un único `@`, contenido a ambos lados y ningún espacio
  interior. Es una validación básica del ejercicio, no una comprobación completa
  de direcciones de correo ni de su existencia.
- Conservamos el máximo de 64 caracteres del ejemplo del profesor como decisión
  de este ejercicio, no como límite universal de los correos electrónicos.
- No se permiten correos repetidos, tampoco al actualizar a otro usuario.
- Se aceptan únicamente los campos `name` y `email` como datos de entrada.
- Una actualización puede enviar uno o ambos campos. Los campos omitidos o con
  valor `undefined` se conservan; `null` no es un valor válido.
- Una actualización sin cambios definidos se rechaza. Reenviar un valor existente
  sí está permitido, incluido el correo propio.
- Eliminar borra definitivamente al usuario.
- Las fechas se generan en SQLite y se expresan en UTC con formato ISO 8601.

## Consumir la aplicación desde JavaScript

Ejemplo para un archivo situado junto a `app.js`:

```js
import { createApp } from "./app.js";

// Sin opciones utiliza el archivo persistente db/users.sqlite.
const app = createApp();

try {
  const result = app.createUser({ name: "Lucía", email: "lucia@example.com" });

  if (result.ok) {
    const id = result.user.id;
    console.log(app.updateUser(id, { name: "Lucía García" }));
    console.log(app.listUsers());
    console.log(app.deleteUser(id));
  } else {
    console.log(result.error);
  }
} finally {
  app.close();
}
```

Para una base desechable: `createApp({ databasePath: ":memory:" })`.
También puede pasarse una ruta de archivo; su carpeta debe existir.
La ruta predeterminada se calcula desde `connection.js`, no desde el directorio
actual de la terminal. Importar `app.js` no abre ni crea una base de datos.

## Resultados

| Operación | Respuesta correcta |
| --- | --- |
| Crear o actualizar | `{ ok: true, user }` |
| Listar | `{ ok: true, users: [...] }` |
| Eliminar | `{ ok: true }` |

Los errores esperados devuelven `{ ok: false, error: "CODIGO" }`:

| Código | Significado |
| --- | --- |
| `INVALID_INPUT` | La entrada no es un objeto válido o tiene campos desconocidos. |
| `INVALID_NAME` | El nombre falta, está vacío o no es texto. |
| `INVALID_EMAIL` | El correo falta, tiene un formato inválido o supera 64 caracteres. |
| `INVALID_ID` | El identificador no es un entero positivo seguro de JavaScript. |
| `EMPTY_CHANGES` | No se ha enviado ningún cambio definido. |
| `EMAIL_ALREADY_USED` | Otro usuario tiene ese correo. |
| `USER_NOT_FOUND` | No existe el usuario que se quiere actualizar o eliminar. |

Los fallos técnicos inesperados, como un archivo inaccesible, lanzan una excepción.
El cliente debe gestionarlos según su interfaz. Las funciones de negocio no
imprimen mensajes ni conocen códigos HTTP.

## Contrato del repositorio

Un repositorio es un objeto con estos métodos síncronos:

| Método | Devuelve |
| --- | --- |
| `findById(id)` | Usuario o `undefined`. |
| `findByEmail(email)` | Usuario o `undefined`; recibe el correo ya normalizado. |
| `findAll()` | Lista de usuarios ordenada por identificador ascendente. |
| `insert({ name, email })` | Usuario creado, con identificador y fechas. |
| `update({ id, name, email })` | Usuario actualizado o `undefined` si ya no existe. |
| `remove(id)` | `true` si eliminó al usuario; `false` si no existía. |

`insert` y `update` deben garantizar la unicidad del correo. Si detectan un
conflicto al guardar, lanzan un error con `code: "EMAIL_ALREADY_USED"`. El adaptador
SQLite traduce su restricción `UNIQUE` a ese código para no filtrar detalles del
motor a la lógica.

Los repositorios devuelven objetos normales con los cinco campos del usuario y no
exponen referencias que permitan modificar los datos guardados directamente.

El contrato es síncrono para mantener sencillo este primer ejercicio. Si se añade
un almacenamiento con API asíncrona, habrá que adaptar las llamadas con
`async`/`await`; separar los módulos no elimina esa diferencia.

## Próximas iteraciones

La primera versión no incluye autenticación, contraseñas, API HTTP ni frontend.
Una futura API podrá llamar a estas operaciones y traducir sus resultados a HTTP.
El frontend JavaScript y un notebook Jupyter con Python podrán consumir esa API,
manteniendo las validaciones en la aplicación Node.

Todos los archivos de texto se guardan en UTF-8 y las funcionalidades incluyen
comentarios cortos sobre su intención.
