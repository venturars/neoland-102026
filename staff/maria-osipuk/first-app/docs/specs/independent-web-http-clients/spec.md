Issue: #790

# Clientes web y HTTP independientes

## Qué se pide y por qué

Cada cliente de la aplicación tiene que poder usarse, cambiarse o quitarse sin afectar a otro. Hoy el navegador solo funciona a través del cliente HTTP: si cambia el HTTP, se rompe la web. Además, los dos clientes están repartidos en muchos archivos pequeños, y eso cuesta leerlos.

Se pide la forma más sencilla posible. Para conseguirlo, la base de datos pasa a estar detrás de un **servicio de datos local**: un único proceso guarda la base y todos los clientes le piden los datos a él. Así las operaciones de la aplicación ya no dependen de Node y el navegador puede usarlas directamente, sin pasar por el cliente HTTP.

Los dos clientes ofrecen **las mismas tres operaciones**, las del ejemplo de terminal: **crear, modificar y eliminar un usuario**.

- **Web:** un cliente propio, con una página, su hoja de estilos y un único archivo de código. Usa las operaciones de la aplicación directamente. No pasa por el cliente HTTP.
- **HTTP:** crear y arrancar su servidor queda en un único archivo.

## Servicio de datos y base compartida

El servicio de datos se arranca con su propio comando y solo escucha en el equipo local. Es el único que abre la base.

Web, HTTP, terminal y Jupyter leen y escriben a través de ese servicio, así que todos ven la misma base. Un usuario creado, modificado o eliminado desde un cliente se ve igual desde los demás, sin copiar datos ni sincronizar nada. Esto se cumple aunque varios clientes estén abiertos a la vez.

Si el servicio de datos no está arrancado, ningún cliente puede leer ni escribir: cada uno muestra el error de la operación en español, sin detalles internos.

## Cliente web

Se abre en el navegador del equipo con un comando. Los textos están en español y conserva el diseño lila:

1. **Selección:** lista de usuarios con id, nombre y email, para elegir a cuál modificar o eliminar. Si no hay usuarios, lo dice. En la misma pantalla hay un formulario para **crear** un usuario con nombre y email.
2. **Menú:** muestra el usuario elegido y ofrece modificarlo, volver a la selección e «Ir a notas», que sigue deshabilitada.
3. **Edición:** formulario con nombre y email. Permite **guardar los cambios**, volver sin guardar y **eliminar** el usuario.

Las reglas no cambian: el nombre no puede estar vacío y el email tiene que ser válido, de hasta 64 caracteres y no puede estar usado por otro usuario. Si hay un error al crear o al guardar, se muestra en español y lo escrito se conserva para corregirlo. Crear bien un usuario lo añade a la lista.

Antes de eliminar se pide confirmación. Cancelar conserva el usuario. Confirmar lo elimina y vuelve a la selección.

Los cambios guardados siguen ahí al cerrar y volver a abrir el cliente. El cliente web funciona aunque el cliente HTTP no esté arrancado; solo necesita el servicio de datos.

## Cliente HTTP

Se arranca con su propio comando y solo escucha en el equipo local. Responde en JSON a tres operaciones:

- **Crear** un usuario con nombre y email: devuelve el usuario creado.
- **Modificar** el nombre, el email o ambos de un usuario por su id: devuelve el usuario modificado.
- **Eliminar** un usuario por su id: confirma el borrado sin cuerpo.

Cualquier otra ruta u operación responde que no existe o que no está disponible. Ya no entrega la página web ni lista o busca usuarios. Los errores salen con un código adecuado y una frase en español, sin detalles internos de la base.

## Terminal y Jupyter

Siguen ofreciendo las mismas operaciones y los mismos resultados. La única diferencia visible es que necesitan el servicio de datos arrancado.

## Casos observables

### Caso correcto

- **Web:** con el servicio de datos arrancado y la lista vacía, se crean dos usuarios ficticios y aparecen en la lista. Se elige uno, se cambia su nombre y se guarda. Al volver a abrir el cliente y elegirlo, el cambio sigue ahí. Se cancela el borrado y el usuario sigue existiendo. Se confirma el borrado: desaparece de la lista y el otro conserva sus datos.
- **HTTP:** se crea un usuario de prueba, se modifica su email y se elimina. Cada respuesta tiene el código y el contenido esperados.
- **Base compartida:** un usuario creado por HTTP aparece en la lista de la web al recargarla. Un usuario modificado desde la web devuelve los datos nuevos al modificarlo otra vez por HTTP. Un usuario creado desde terminal aparece en la web.

### Casos que deben fallar

- **Web:** crear un usuario con un email ya usado muestra el mensaje, no lo añade y conserva lo escrito. Guardar un nombre vacío o un email inválido o ya usado muestra el mensaje y conserva los datos guardados antes. Abrir un usuario que ya no existe muestra un error y permite volver a la selección.
- **HTTP:** crear o modificar con datos inválidos, con un email ya usado o con un JSON mal formado devuelve un error claro. Modificar o eliminar un id que no existe responde que no se encuentra. Pedir la lista de usuarios o la página web responde que no existe.
- **Sin servicio de datos:** con el servicio parado, la web muestra que no se ha podido cargar la lista, el HTTP responde con un error de servidor y la terminal y Jupyter muestran el error de la operación. Ninguno enseña detalles de SQLite.

## Cómo se reconoce que está terminado

- La carpeta del cliente web tiene solo la página, los estilos y un archivo de código. Ninguno de los dos clientes usa archivos del otro.
- Los dos clientes ofrecen crear, modificar y eliminar, y nada más como operación de escritura.
- Solo el servicio de datos abre la base. Las operaciones de la aplicación y sus consultas no leen archivos del disco.
- Los casos anteriores se cumplen en todos los clientes, sobre la misma base.
- Las comprobaciones usan datos de prueba y no modifican la base real.

## Fuera del pedido

Notas, buscar usuarios por id o por email como operación propia de un cliente, contraseñas, autenticación, permisos, el recuento por género como operación de la web o del HTTP y cualquier cambio en las reglas de usuarios o en el esquema de la tabla.
