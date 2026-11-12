Issue: #1153

# API de Express con colección de Bruno

Quien prueba la app en su ordenador tiene una API de usuarios en `http://127.0.0.1:3001` y una colección de Bruno que la prueba. La colección se abre en la app de Bruno o se lanza desde la terminal, sin escribir cada petición a mano.

No hay contraseña ni login. La API escucha solo en este ordenador. La base tiene que estar en marcha, igual que para los demás clientes.

## Qué entra y qué sale

La API no añade operaciones. Ofrece estas ocho, las mismas que las APIs de Chrome y de Nest:

- **Crear:** entran el nombre y el email. Sale el usuario, con estado 201.
- **Listar:** no entra nada. Sale la lista de usuarios.
- **Buscar por email:** entra el email. Sale el usuario.
- **Buscar por nombre:** entra el nombre. Sale la lista de usuarios con ese nombre. Sin coincidencias, la lista está vacía.
- **Contar por género:** no entra nada. Salen los tres recuentos. Necesita Ollama con `llama3.2`, salvo si no hay usuarios.
- **Ver:** entra el id. Sale el usuario.
- **Modificar:** entran el id y el nombre, el email o los dos. Lo que no entra conserva su valor. Sale el usuario con los datos nuevos.
- **Borrar:** entra el id. No sale nada, con estado 204.

## La colección

Tiene tres grupos de peticiones. Cada uno se lanza por separado y comprueba el estado y el contenido de cada respuesta.

- **Con la base en marcha:** las operaciones y sus fallos, salvo contar por género. Sirve con una base que ya tenga usuarios. Borra lo que crea y se puede repetir, también después de una ejecución que se quedó a medias.
- **Con la base parada:** una petición por operación, cada una con su fallo. La API sigue en marcha.
- **Con la IA:** contar por género.

## Ejemplo

Con la base y la API en marcha, se lanza `pnpm bruno`. La colección crea a Ada con un email que no existe todavía:

```json
{ "name": "Ada", "email": "ada-1793954473000@example.com" }
```

La respuesta tiene estado 201:

```json
{
  "id": 1,
  "name": "Ada",
  "email": "ada-1793954473000@example.com",
  "createdAt": "2026-11-06 10:00:00",
  "updatedAt": "2026-11-06 10:00:00"
}
```

Ada sale en la lista y se encuentra por su id, su email y su nombre. Se cambia el nombre a Ada Lovelace y el email sigue igual. Se borra y ya no se encuentra. La terminal muestra el resultado de cada comprobación, y `pnpm bruno` termina con error si alguna falla.

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
- Una dirección distinta de `127.0.0.1:3001`, también `localhost`, responde 403.
- Una petición que llega desde una página web responde 403.

## Fuera de esto

La contraseña, el login, los permisos, abrir la API a otros ordenadores, una operación nueva, una regla de usuarios nueva, un mensaje de error nuevo y cambiar lo que ya hacen las reglas de usuarios, las consultas, la base y los demás clientes. Tampoco entra lanzar la colección contra otra API que no sea esta, como la de Nest.
