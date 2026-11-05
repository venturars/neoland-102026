Issue: #1138

# Página de documentación de la API de Nest

Quien prueba la app en su ordenador abre una página en `http://127.0.0.1:3003/docs`. Ahí ve todas las rutas de usuarios, qué pide cada una y qué responde. También puede probarlas desde esa misma página, sin curl y sin otro cliente.

No hay contraseña ni login. La API sigue escuchando solo en este ordenador. La base tiene que estar en marcha, igual que para usar la API.

## Qué entra y qué sale

La página no añade operaciones. Explica estas ocho y permite lanzarlas:

- **Crear:** entran el nombre y el email. Sale el usuario.
- **Listar:** no entra nada. Sale la lista de usuarios.
- **Buscar por email:** entra el email. Sale el usuario.
- **Buscar por nombre:** entra el nombre. Sale la lista de usuarios con ese nombre.
- **Contar por género:** no entra nada. Salen los tres recuentos.
- **Ver:** entra el id. Sale el usuario.
- **Modificar:** entran el id y el nombre, el email o los dos. Sale el usuario con los datos nuevos.
- **Borrar:** entra el id. No sale nada.

## Ejemplo

Se abre la página y se elige crear un usuario. Se escribe este cuerpo:

```json
{ "name": "Ana", "email": "ana@ejemplo.com" }
```

La página muestra la respuesta, con estado 201:

```json
{
  "id": 1,
  "name": "Ana",
  "email": "ana@ejemplo.com",
  "createdAt": "2026-11-05 10:00:00",
  "updatedAt": "2026-11-05 10:00:00"
}
```

## Qué fallo se ve

La página documenta y muestra los mismos fallos que ya da la API, con su estado y su mensaje:

| Mensaje | Estado |
| --- | --- |
| `Name is empty` | 400 |
| `Email is invalid` | 400 |
| `Email is already used` | 409 |
| `User not found` | 404 |
| `Could not create the user`, `Could not update the user`, `Could not delete the user`, `Could not list the users`, `Could not find the user`, `Could not classify the users` | 500 |

La página se abre con `127.0.0.1`. Con cualquier otra dirección, también `localhost`, la API responde 403.

## Quién puede usar la API

Cambia una regla de la spec `nest-client`: antes, ninguna página web podía usar esta API. Ahora puede usarla su propia página de documentación. Cualquier otra web se sigue rechazando con 403. Los programas de este ordenador, como curl, siguen funcionando igual.

## Fuera de esto

La contraseña, el login, los permisos, abrir la API a otros ordenadores, una operación nueva, una regla nueva, un mensaje de error nuevo y cambiar lo que ya hacen las reglas, las consultas, la base y los demás clientes.
