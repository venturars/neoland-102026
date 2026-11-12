Issue: #1160

# API con el HTTP de Node documentada en Jupyter

Quien prueba la app en su ordenador tiene una API de usuarios en `http://127.0.0.1:3004`, hecha solo con lo que trae Node, sin ningún framework. Cada ruta tiene un cuaderno de Jupyter que explica qué hace y permite lanzarla y ver su respuesta.

Sirve para ver qué hace un framework por debajo: esta API responde igual que la de Express, pero aquí se ve cómo se lee una petición y cómo se escribe su respuesta.

No hay contraseña ni login. La API escucha solo en este ordenador. La base tiene que estar en marcha, igual que para los demás clientes.

## Qué entra y qué sale

La API no añade operaciones. Ofrece las mismas ocho que la API de Express:

- **Crear:** entran el nombre y el email. Sale el usuario, con estado 201.
- **Listar:** no entra nada. Sale la lista de usuarios.
- **Buscar por email:** entra el email. Sale el usuario.
- **Buscar por nombre:** entra el nombre. Sale la lista de usuarios con ese nombre. Sin coincidencias, la lista está vacía.
- **Contar por género:** no entra nada. Salen los tres recuentos. Necesita Ollama con `llama3.2`, salvo si no hay usuarios.
- **Ver:** entra el id. Sale el usuario.
- **Modificar:** entran el id y el nombre, el email o los dos. Lo que no entra conserva su valor. Sale el usuario con los datos nuevos.
- **Borrar:** entra el id. No sale nada, con estado 204.

## Los cuadernos

Hay un cuaderno por ruta. Se abren con el Jupyter de la app, con un comando propio. El comando que abre los cuadernos que ya existen sigue igual.

Cada cuaderno cuenta, en castellano, qué hace la ruta, qué petición lanza, qué pasa en la base, qué respuestas puede dar y qué hay que tener en marcha. Debajo está la llamada, que se puede ejecutar y cambiar.

Si la respuesta trae datos, salen en una tabla. Si falla, se ven su estado y su mensaje, y no sale la tabla.

## Ejemplo

Con la base y la API en marcha, el cuaderno de crear lanza esta petición:

```json
{ "name": "Ada", "email": "ada@example.com" }
```

La respuesta tiene estado 201 y la tabla muestra estos datos:

```json
{
  "id": 1,
  "name": "Ada",
  "email": "ada@example.com",
  "createdAt": "2026-11-06 10:00:00",
  "updatedAt": "2026-11-06 10:00:00"
}
```

Ada sale en la lista y se encuentra por su id, su email y su nombre. Se cambia el nombre a Ada Lovelace y el email sigue igual. Se borra y ya no se encuentra.

Si se vuelve a ejecutar el cuaderno de crear sin haber borrado a Ada, se ve el estado 409 y `Email is already used`.

## Qué fallo se ve

| Mensaje | Estado |
| --- | --- |
| `Name is empty` | 400 |
| `Email is invalid` | 400 |
| `Email is already used` | 409 |
| `User not found` | 404 |
| `Could not create the user`, `Could not update the user`, `Could not delete the user`, `Could not list the users`, `Could not find the user`, `Could not classify the users` | 500 |

Estos casos no llevan mensaje:

- Una ruta que no existe responde 404.
- Un cuerpo que no es JSON válido responde 400.
- Un id mal codificado en la dirección responde 400.
- Un cuerpo de más de 100 KB responde 500, igual que la API de Express.
- Una dirección distinta de `127.0.0.1:3004`, también `localhost`, responde 403.
- Una petición que llega desde una página web responde 403.

## Fuera de esto

La contraseña, el login, los permisos, abrir la API a otros ordenadores, una operación nueva, una regla de usuarios nueva, un mensaje de error nuevo, un paquete nuevo y cambiar lo que ya hacen las reglas de usuarios, las consultas, la base y los demás clientes. Tampoco entran una colección de Bruno ni una página de Swagger para esta API: su documentación son los cuadernos.
