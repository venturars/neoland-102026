Issue: #1007

# Cliente de extensión de VS Code para usuarios

## Qué se pide y por qué

Quien prueba la app quiere gestionar usuarios sin salir del editor, sin abrir la web, la terminal, Jupyter ni el cliente REST.

Es un cliente nuevo e independiente: se puede usar, cambiar o quitar sin afectar a los demás, y los demás siguen funcionando sin él. Ofrece **crear, listar, ver, modificar y borrar** usuarios, con las mismas reglas y los mismos datos que el resto de clientes. No hay contraseña: elegir un usuario no acredita quién es.

## Cómo se arranca

La extensión solo necesita el servidor de datos, que ya existe. El cliente REST no hace falta.

Con el servidor de datos arrancado, el comando `vscode` de la app abre una ventana de desarrollo de VS Code con la extensión cargada. No se instala nada en el editor. En esa ventana, la barra de actividad tiene un icono propio, **Usuarios**, que abre la vista en la barra lateral.

## Qué se ve en la extensión

Los textos de la pantalla y los errores están en español. La apariencia sigue el tema de color del editor, claro u oscuro. Hay dos pantallas dentro de la vista.

1. **Lista:** es lo primero que se ve. Muestra cada usuario con su id, nombre y email. Si no hay usuarios, lo dice. En la misma pantalla hay un formulario para **crear** un usuario con nombre y email. Crear bien un usuario lo añade a la lista y vacía el formulario.
2. **Detalle:** se abre al elegir un usuario de la lista, sin escribir su id a mano. Muestra los datos guardados en ese momento: id, nombre, email y las dos fechas. Tiene un formulario con el nombre y el email ya escritos para **guardar los cambios**, un botón para volver a la lista sin guardar y un botón para **borrar**.

Se puede cambiar el nombre, el email o los dos: lo que no se toca conserva su valor. Después de guardar se ven los datos nuevos y la fecha de modificación actualizada.

Antes de borrar, VS Code abre un diálogo de confirmación que bloquea el editor hasta contestarlo. Cancelar conserva el usuario y sigue en el detalle. Confirmar lo borra y vuelve a la lista, donde ya no sale.

Si se oculta la vista, lo guardado se conserva. Lo escrito sin guardar se pierde y, al volver a mostrarla, se empieza por la lista.

## Reglas

No cambian. El nombre no puede estar vacío y el email tiene que ser válido, de hasta 64 caracteres, y no puede estar usado por otro usuario. Si crear o guardar falla, se ve el mensaje y lo escrito se conserva para corregirlo.

## Mensajes

Los errores se ven en español. Un error que la extensión no conoce muestra la frase genérica, nunca el texto original.

| Situación                                  | Se ve                                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| El nombre está vacío                       | Introduce un nombre.                                                                    |
| El email no vale                           | Introduce un email válido de hasta 64 caracteres.                                       |
| El email es de otro usuario                | Ya existe un usuario con ese email.                                                     |
| El usuario ya no existe                    | No se ha encontrado ese usuario. Actualiza la lista.                                    |
| Sin servidor de datos, al listar           | No se ha podido cargar la lista. Comprueba que el servidor de datos está arrancado.     |
| Sin servidor de datos, al ver              | No se ha podido obtener el usuario. Comprueba que el servidor de datos está arrancado.  |
| Sin servidor de datos, al crear            | No se ha podido crear el usuario. Comprueba que el servidor de datos está arrancado.    |
| Sin servidor de datos, al guardar          | No se ha podido guardar el usuario. Comprueba que el servidor de datos está arrancado.  |
| Sin servidor de datos, al borrar           | No se ha podido obtener el usuario. Comprueba que el servidor de datos está arrancado.  |
| El borrado falla con el usuario ya hallado | No se ha podido eliminar el usuario. Comprueba que el servidor de datos está arrancado. |
| Cualquier otro fallo                       | No se ha podido completar la operación.                                                 |

Al borrar, la aplicación busca primero el usuario. Por eso, sin servidor de datos, el mensaje es el de obtener el usuario.

Nunca se ven detalles internos de la base. Una lista vacía solo se muestra después de una carga correcta sin usuarios.

## Casos observables

### Caso correcto

Con el servidor de datos arrancado y el cliente REST parado:

1. Se abre la vista con una base sin usuarios. Dice que no hay usuarios.
2. Se crea a Ada con ada@example.com. Aparece en la lista con su id.
3. Se elige a Ada. Se ven su id, su nombre, su email y las dos fechas.
4. Se cambia el nombre a Ada Lovelace y se guarda. Se ven el mismo id, el nombre nuevo y el mismo email.
5. Se pide el borrado y se cancela. Ada sigue ahí.
6. Se pide el borrado y se confirma. Vuelve la lista y Ada ya no sale.

**Base compartida:** un usuario creado en la extensión aparece en la web y en el cliente REST. Un usuario modificado en la web se ve con los datos nuevos al abrirlo en la extensión.

### Casos que deben fallar

- Crear con el nombre vacío, con un email inválido o con el email de otro usuario muestra su mensaje, no crea a nadie y conserva lo escrito.
- Guardar un nombre vacío, un email inválido o el email de otro usuario muestra su mensaje y no cambia lo guardado.
- Con el detalle abierto, si el usuario se borra desde otro cliente, guardar o borrar muestra que no se ha encontrado ese usuario.
- Con el servidor de datos parado, cada acción muestra su mensaje. No aparece una lista vacía ni un detalle de la base.
- Un nombre guardado con caracteres HTML se ve como texto y no cambia la pantalla.

## Cómo se reconoce que está terminado

- Los casos anteriores se cumplen en VS Code.
- La extensión funciona con el cliente REST parado, y el cliente REST, la web, la terminal y Jupyter funcionan sin la extensión.
- Quitar este cliente no obliga a cambiar ningún otro.
- Las comprobaciones usan datos de prueba y no modifican la base real.

## Fuera del pedido

Cambiar las reglas de usuarios, el esquema de la tabla o los demás clientes. Contraseñas, autenticación y permisos. Notas, buscar por email, buscar por id escribiéndolo a mano y el recuento por género. Generar un instalador o publicar la extensión en el Marketplace. Sustituir el servidor de datos o el cliente REST.
