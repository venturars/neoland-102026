# Recuento en los clientes

Issue: #1045.

Quien prueba la app pide el recuento de los usuarios ya guardados según el sexo que sugiere su nombre. Lo pide desde el cliente HTTP, la extensión de Chrome, el panel de VS Code, la ventana de escritorio y el cliente Nest. El sexo lo decide la IA local. El resultado solo se muestra. Es una lectura del nombre, no el sexo verificado de la persona.

Lo usa quien quiere ver cuántas mujeres, cuántos hombres y cuántos usuarios indefinidos hay, desde uno de esos clientes.

No entra ningún dato. Se cuentan todos los usuarios ya guardados.

En la extensión, en el panel y en la ventana, la persona abre la pestaña Recuento y desde ahí pide el recuento. En HTTP, en la API de la extensión y en Nest, lo pide igual que el resto de lecturas.

Sale un único resultado con tres números, en este orden: mujeres, hombres y usuarios indefinidos. No sale la lista de nombres.

Ejemplo si los usuarios fueran Elena, Mateo y Alex:

mujeres 1, hombres 1, usuarios indefinidos 1

Si no hay usuarios, los tres números son 0. No es un fallo.

Si la IA no responde, o no se pueden leer los usuarios, se ve `Could not classify the users`.

Las reglas siguen en un solo sitio. Estos clientes solo muestran el recuento. No guardan el sexo ni otro campo. No escuchan en un puerto nuevo. La base sigue donde ya está.

Queda fuera cambiar las tres pantallas del navegador, la terminal y Jupyter. Queda fuera guardar el sexo, mostrar la lista de nombres, un mensaje nuevo y una regla nueva.
