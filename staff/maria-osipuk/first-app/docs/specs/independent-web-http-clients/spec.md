Issue: #790

# Cliente web independiente y sustitución del cliente HTTP

## Qué se pide y por qué

Cada cliente de la aplicación tiene que poder usarse, cambiarse o quitarse sin afectar a otro. Hoy el navegador solo funciona a través del cliente HTTP: si cambia el HTTP, se rompe la web. Además, los dos clientes están repartidos en muchos archivos pequeños, y eso cuesta leerlos.

Se pide la forma más sencilla posible. Para conseguirlo, la base de datos pasa a estar detrás de un **servicio de datos local**: un único proceso guarda la base y todos los clientes le piden los datos a él. Así las operaciones de la aplicación ya no dependen de Node y el navegador puede usarlas directamente.

Con eso el cliente HTTP deja de hacer falta: solo existía para que el navegador llegara a las operaciones. **Se quita el cliente construido con `node:http`** y lo sustituye el cliente REST de `docs/specs/express-rest-client/`. La aplicación queda con cuatro clientes: web, terminal, Jupyter y REST.

- **Web:** un cliente propio, con una página, su hoja de estilos y un único archivo de código. Usa las operaciones de la aplicación directamente y ofrece **crear, modificar y eliminar un usuario**, las del ejemplo de terminal.

## Servicio de datos y base compartida

El servicio de datos se arranca con su propio comando y solo escucha en el equipo local. Es el único que abre la base.

Web, terminal y Jupyter leen y escriben a través de ese servicio, así que todos ven la misma base. Un usuario creado, modificado o eliminado desde un cliente se ve igual desde los demás, sin copiar datos ni sincronizar nada. Esto se cumple aunque varios clientes estén abiertos a la vez.

Si el servicio de datos no está arrancado, ningún cliente puede leer ni escribir: cada uno muestra el error de la operación en español, sin detalles internos.

## Cliente web

Se abre en el navegador del equipo con un comando. Los textos están en español y conserva el diseño lila:

1. **Selección:** lista de usuarios con id, nombre y email, para elegir a cuál modificar o eliminar. Si no hay usuarios, lo dice. En la misma pantalla hay un formulario para **crear** un usuario con nombre y email.
2. **Menú:** muestra el usuario elegido y ofrece modificarlo, volver a la selección e «Ir a notas», que sigue deshabilitada.
3. **Edición:** formulario con nombre y email. Permite **guardar los cambios**, volver sin guardar y **eliminar** el usuario.

Las reglas no cambian: el nombre no puede estar vacío y el email tiene que ser válido, de hasta 64 caracteres y no puede estar usado por otro usuario. Si hay un error al crear o al guardar, se muestra en español y lo escrito se conserva para corregirlo. Crear bien un usuario lo añade a la lista.

Antes de eliminar se pide confirmación. Cancelar conserva el usuario. Confirmar lo elimina y vuelve a la selección.

Los cambios guardados siguen ahí al cerrar y volver a abrir el cliente. El cliente web solo necesita el servicio de datos.

## Cliente HTTP

El cliente construido con `node:http` se sustituye. Ya no hay comando `start:http` ni rutas `/api/users`. Ninguna operación se pierde: crear, modificar y eliminar siguen disponibles desde la web, la terminal y Jupyter. Su sustituto se define en `docs/specs/express-rest-client/`.

## Terminal y Jupyter

Siguen ofreciendo las mismas operaciones y los mismos resultados. La única diferencia visible es que necesitan el servicio de datos arrancado.

## Casos observables

### Caso correcto

- **Web:** con el servicio de datos arrancado y la lista vacía, se crean dos usuarios ficticios y aparecen en la lista. Se elige uno, se cambia su nombre y se guarda. Al volver a abrir el cliente y elegirlo, el cambio sigue ahí. Se cancela el borrado y el usuario sigue existiendo. Se confirma el borrado: desaparece de la lista y el otro conserva sus datos.
- **Base compartida:** un usuario creado desde terminal aparece en la lista de la web al recargarla. Un usuario modificado desde la web devuelve los datos nuevos al buscarlo desde terminal o Jupyter.

### Casos que deben fallar

- **Web:** crear un usuario con un email ya usado muestra el mensaje, no lo añade y conserva lo escrito. Guardar un nombre vacío o un email inválido o ya usado muestra el mensaje y conserva los datos guardados antes. Abrir un usuario que ya no existe muestra un error y permite volver a la selección.
- **Sin servicio de datos:** con el servicio parado, la web muestra que no se ha podido cargar la lista y la terminal y Jupyter muestran el error de la operación. Ninguno enseña detalles de SQLite.
- **Sin el cliente anterior:** no hay comando para arrancarlo y la web no necesita ningún cliente HTTP.

## Cómo se reconoce que está terminado

- La carpeta del cliente web tiene solo la página, los estilos y un archivo de código.
- No queda el cliente construido con `node:http` ni nada que lo use.
- Solo el servicio de datos abre la base. Las operaciones de la aplicación y sus consultas no leen archivos del disco.
- Los casos anteriores se cumplen en todos los clientes, sobre la misma base.
- Las comprobaciones usan datos de prueba y no modifican la base real.

## Fuera del pedido

Notas, buscar usuarios por id o por email como operación propia de la web, contraseñas, autenticación, permisos, el recuento por género como operación de la web y cualquier cambio en las reglas de usuarios o en el esquema de la tabla.
