Issue: #1009

# Cliente de escritorio para usuarios

## Qué se pide y por qué

Quien prueba la app quiere gestionar usuarios desde una aplicación de escritorio con su propia ventana, sin abrir el navegador, la terminal, Jupyter ni el cliente REST.

Es un cliente nuevo e independiente: se puede usar, cambiar o quitar sin afectar a los demás, y los demás siguen funcionando sin él. Ofrece **crear, listar, ver, modificar y borrar** usuarios, con las mismas reglas y los mismos datos que el resto de clientes. No hay contraseña: elegir un usuario no acredita quién es.

## Cómo se arranca

La aplicación necesita el servidor de datos en marcha en el equipo local. No necesita ningún otro cliente arrancado y no abre ningún puerto propio.

Se abre con su propio comando desde la carpeta de la app. El primer arranque necesita conexión a internet y tarda más, porque descarga la aplicación de escritorio.

Cerrar la ventana cierra la aplicación, también en macOS.

## Qué se ve en la ventana

Hay una sola ventana con dos zonas a la vez, sin cambiar de pantalla. Todos los textos, también los errores, están en español.

1. **Lista, a la izquierda:** cada usuario con su id, nombre y email, y un botón **Actualizar** para volver a cargarla. Si no hay usuarios, lo dice. Encima hay un botón **Nuevo usuario**.
2. **Panel, a la derecha:** muestra una de estas dos cosas.
   - **Alta:** un formulario con nombre y email. Es lo que se ve al abrir la aplicación y al pulsar «Nuevo usuario». Crear bien un usuario lo añade a la lista y vacía el formulario.
   - **Detalle:** se abre al elegir un usuario de la lista, sin escribir su id a mano. Muestra los datos guardados en ese momento: id, nombre, email y las dos fechas. Tiene el nombre y el email ya escritos para **guardar los cambios**, y un botón para **borrar**.

Se puede cambiar el nombre, el email o los dos: lo que no se toca conserva su valor. Después de guardar se ven los datos nuevos, la fecha de modificación actualizada y la lista al día.

Antes de borrar, el sistema operativo muestra un diálogo de confirmación. Cancelar conserva el usuario y sigue en el detalle. Confirmar lo borra, vuelve al alta y el usuario ya no sale en la lista.

Elegir otro usuario o pulsar «Nuevo usuario» descarta lo escrito sin guardar. Lo que otro cliente cambie mientras tanto se ve al pulsar «Actualizar» o al elegir de nuevo el usuario. Si «Actualizar» ya no encuentra al usuario abierto, el panel vuelve al alta.

## Reglas

No cambian. El nombre no puede estar vacío y el email tiene que ser válido, de hasta 64 caracteres, y no puede estar usado por otro usuario. Si crear o guardar falla, se ve el mensaje y lo escrito se conserva para corregirlo.

## Mensajes

| Situación                         | Se ve                                                                                  |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| El nombre está vacío              | Introduce un nombre.                                                                   |
| El email no vale                  | Introduce un email válido de hasta 64 caracteres.                                      |
| El email es de otro usuario       | Ya existe un usuario con ese email.                                                    |
| El usuario ya no existe           | No se ha encontrado ese usuario. Actualiza la lista.                                   |
| Sin servidor de datos, al listar  | No se ha podido cargar la lista. Comprueba que el servidor de datos está arrancado.    |
| Sin servidor de datos, al ver     | No se ha podido obtener el usuario. Comprueba que el servidor de datos está arrancado. |
| Sin servidor de datos, al crear   | No se ha podido crear el usuario. Comprueba que el servidor de datos está arrancado.   |
| Sin servidor de datos, al guardar | No se ha podido guardar el usuario. Comprueba que el servidor de datos está arrancado. |
| Sin servidor de datos, al borrar  | No se ha podido obtener el usuario. Comprueba que el servidor de datos está arrancado. |
| Cualquier otro fallo              | No se ha podido completar la operación.                                                |

Nunca se ven detalles internos de la base. Una lista vacía solo se muestra después de una carga correcta sin usuarios.

## Casos observables

### Caso correcto

Con el servidor de datos arrancado y los demás clientes parados:

1. Se abre la aplicación con una base sin usuarios. Se ve una ventana propia, la lista dice que no hay usuarios y el panel muestra el alta.
2. Se crea a Ada con ada@example.com. Aparece en la lista con su id y el formulario queda vacío.
3. Se elige a Ada. Se ven su id, su nombre, su email y las dos fechas.
4. Se cambia el nombre a Ada Lovelace y se guarda. Se ven el mismo id, el nombre nuevo y el mismo email, también en la lista.
5. Se pide el borrado y se cancela en el diálogo. Ada sigue ahí.
6. Se pide el borrado y se confirma. Vuelve el alta y Ada ya no sale en la lista.
7. Se cierra la ventana. La aplicación termina.

**Base compartida:** un usuario creado en la aplicación aparece en la web y en el cliente REST. Un usuario modificado en la web se ve con los datos nuevos al elegirlo en la aplicación.

### Casos que deben fallar

- Crear con el nombre vacío, con un email inválido o con el email de otro usuario muestra su mensaje, no crea a nadie y conserva lo escrito.
- Guardar un nombre vacío, un email inválido o el email de otro usuario muestra su mensaje y no cambia lo guardado.
- Con el detalle abierto, si el usuario se borra desde otro cliente, guardar o borrar muestra que no se ha encontrado.
- Con el servidor de datos parado, cada acción muestra su mensaje. No aparece una lista vacía ni un detalle de la base.
- Un nombre guardado con caracteres HTML, como `<b>Ada</b>`, se ve como texto y no se interpreta.

## Cómo se reconoce que está terminado

- Los casos anteriores se cumplen en la ventana, en macOS.
- La aplicación funciona con los demás clientes parados, y los demás clientes funcionan con la aplicación cerrada.
- Quitar este cliente no obliga a cambiar ningún otro.
- Las comprobaciones usan datos de prueba y no modifican la base real.

## Fuera del pedido

Cambiar las reglas de usuarios, el esquema de la tabla o los demás clientes. Contraseñas, autenticación y permisos. Notas, buscar por email, buscar por id escribiéndolo a mano y el recuento por género. Generar instaladores, firmar o distribuir la aplicación. Comprobar el funcionamiento en Windows y Linux. Sustituir el servidor de datos o el cliente REST.
