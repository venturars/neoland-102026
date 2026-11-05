Issue: #1001

# Cliente de extensión de Chrome para usuarios

## Qué se pide y por qué

Quien prueba la app quiere gestionar usuarios desde una extensión de Chrome, siempre a mano en la barra del navegador, sin abrir la web, la terminal, Jupyter ni el cliente REST.

Es un cliente nuevo e independiente: se puede usar, cambiar o quitar sin afectar a los demás, y los demás siguen funcionando sin él. Ofrece **crear, listar, ver, modificar y borrar** usuarios, con las mismas reglas y los mismos datos que el resto de clientes. No hay contraseña: elegir un usuario no acredita quién es.

## Cómo se arranca

La extensión necesita dos procesos en marcha en el equipo local: el servidor de datos, que ya existe, y la API de este cliente, con su propio comando. El cliente REST no hace falta.

La extensión se carga una vez en Chrome, desde la página de extensiones y en modo desarrollador. Después se abre con su icono en la barra del navegador.

## Qué se ve en la extensión

Los textos de la pantalla están en español y los errores se ven siempre en inglés. Hay dos pantallas.

1. **Lista:** es lo primero que se ve. Muestra cada usuario con su id, nombre y email. Si no hay usuarios, lo dice. En la misma pantalla hay un formulario para **crear** un usuario con nombre y email. Crear bien un usuario lo añade a la lista y vacía el formulario.
2. **Detalle:** se abre al elegir un usuario de la lista, sin escribir su id a mano. Muestra los datos guardados en ese momento: id, nombre, email y las dos fechas. Tiene un formulario con el nombre y el email ya escritos para **guardar los cambios**, un botón para volver a la lista sin guardar y un botón para **borrar**.

Se puede cambiar el nombre, el email o los dos: lo que no se toca conserva su valor. Después de guardar se ven los datos nuevos y la fecha de modificación actualizada.

Antes de borrar se pide confirmación dentro de la propia extensión. Cancelar conserva el usuario y sigue en el detalle. Confirmar lo borra y vuelve a la lista, donde ya no sale.

Chrome cierra la ventana de la extensión al pulsar fuera de ella. Lo guardado se conserva. Lo escrito sin guardar se pierde y, al volver a abrirla, se empieza por la lista.

## Reglas

No cambian. El nombre no puede estar vacío y el email tiene que ser válido, de hasta 64 caracteres, y no puede estar usado por otro usuario. Si crear o guardar falla, se ve el mensaje y lo escrito se conserva para corregirlo.

## Mensajes

Los errores se ven en inglés, tal como los da la aplicación, sin traducirlos.

| Situación                                | Se ve                              |
| ---------------------------------------- | ---------------------------------- |
| El nombre está vacío                     | `User name is required`            |
| El email no vale                         | `User email is invalid`            |
| El email es de otro usuario              | `User email is already registered` |
| El usuario ya no existe                  | `User does not exist`              |
| Sin servidor de datos, al listar         | `Unable to list users`             |
| Sin servidor de datos, al ver            | `Unable to find user`              |
| Sin servidor de datos, al crear          | `Unable to create user`            |
| Sin servidor de datos, al guardar        | `Unable to update user`            |
| Sin servidor de datos, al borrar         | `Unable to delete user`            |
| La API de este cliente no está arrancada | `Unable to reach the API`          |
| Cualquier otro fallo                     | `Unable to complete the operation` |

Nunca se ven detalles internos de la base. Una lista vacía solo se muestra después de una carga correcta sin usuarios.

## Casos observables

### Caso correcto

Con el servidor de datos y la API arrancados, y el cliente REST parado:

1. Se abre la extensión con una base sin usuarios. Dice que no hay usuarios.
2. Se crea a Ada con ada@example.com. Aparece en la lista con su id.
3. Se elige a Ada. Se ven su id, su nombre, su email y las dos fechas.
4. Se cambia el nombre a Ada Lovelace y se guarda. Se ven el mismo id, el nombre nuevo y el mismo email.
5. Se pide el borrado y se cancela. Ada sigue ahí.
6. Se pide el borrado y se confirma. Vuelve la lista y Ada ya no sale.

**Base compartida:** un usuario creado en la extensión aparece en la web y en el cliente REST. Un usuario modificado en la web se ve con los datos nuevos al abrirlo en la extensión.

### Casos que deben fallar

- Crear con el nombre vacío, con un email inválido o con el email de otro usuario muestra su mensaje, no crea a nadie y conserva lo escrito.
- Guardar un nombre vacío, un email inválido o el email de otro usuario muestra su mensaje y no cambia lo guardado.
- Con el detalle abierto, si el usuario se borra desde otro cliente, guardar o borrar muestra `User does not exist`.
- Con el servidor de datos parado, cada acción muestra su mensaje. No aparece una lista vacía ni un detalle de la base.
- Con la API parada, la extensión muestra `Unable to reach the API`.
- Una página web cualquiera abierta en Chrome no puede leer ni cambiar usuarios a través de la API de este cliente.

## Cómo se reconoce que está terminado

- Los casos anteriores se cumplen en Chrome.
- La extensión funciona con el cliente REST parado, y el cliente REST, la web, la terminal y Jupyter funcionan con la API de este cliente parada.
- Quitar este cliente no obliga a cambiar ningún otro.
- Las comprobaciones usan datos de prueba y no modifican la base real.

## Fuera del pedido

Cambiar las reglas de usuarios, el esquema de la tabla o los demás clientes. Contraseñas, autenticación y permisos. Notas, buscar por email, buscar por id escribiéndolo a mano y el recuento por género. Publicar la extensión en la Chrome Web Store. Sustituir el servidor de datos o el cliente REST.
