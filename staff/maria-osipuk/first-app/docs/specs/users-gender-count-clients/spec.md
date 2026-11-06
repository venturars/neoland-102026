Issue: #1127

# Recuento de usuarios por género en los clientes

## Qué se pide y por qué

Quien prueba la app quiere pedir el recuento de los usuarios ya guardados, según el sexo que sugiere su nombre, desde el cliente HTTP, la extensión de Chrome, el panel de VS Code, la ventana de escritorio y el cliente Nest. Hasta ahora solo se puede desde la terminal y Jupyter.

El recuento son tres números: mujeres, hombres e indefinidos. Un usuario cuyo nombre no sugiere claramente uno u otro cuenta como indefinido. El sexo no se guarda y no se muestra la lista de nombres: el usuario sigue teniendo solo id, nombre, email y las dos fechas.

## Alcance

**Entra:** cinco clientes y la colección de Bruno del cliente HTTP.

- **Cliente HTTP, API de la extensión de Chrome y cliente Nest:** el recuento se pide igual que el resto de lecturas.
- **Colección de Bruno:** gana una petición de recuento con base vacía y otra con el servidor de datos parado.
- **Extensión de Chrome, panel de VS Code y ventana de escritorio:** el recuento está en una pestaña llamada **Recuento**, y lo pide la persona con un botón. No se pide solo al abrir la pestaña ni al arrancar el cliente.

**Fuera:**

- Las tres pantallas del navegador, porque esa página no puede ejecutar el clasificador.
- La terminal y Jupyter, que ya cuentan y no cambian.
- El cliente `node:http` y su Jupyter, que no se mencionan en el pedido.
- Guardar el sexo, mostrar la lista de nombres y cambiar las reglas del recuento.

## Reglas

El recuento no cambia: lo calcula la misma función que ya usan la terminal y Jupyter, con el clasificador local. Cada usuario entra en una sola categoría. Los tres clientes con pestaña y los tres con petición devuelven los mismos números para los mismos usuarios.

## Qué se ve

### En las pestañas (extensión, panel y ventana)

Cada una de las tres pantallas tiene dos pestañas: la de usuarios, que es la de siempre y sigue siendo la primera que se ve, y **Recuento**. En Recuento hay un botón para pedir el recuento. Mientras se espera la respuesta, que puede tardar, se ve que se está contando. Al terminar se ven solo tres números con su etiqueta: mujeres, hombres e indefinidos. Pedirlo otra vez cuenta de nuevo con los usuarios que haya en ese momento.

Cambiar de pestaña no pierde ni cambia lo que ya se ve en la de usuarios.

### En las peticiones (HTTP, API de Chrome y Nest)

Una lectura sin datos de entrada responde con tres números, siempre en este orden: mujeres, hombres, indefinidos.

## Casos observables

### Caso correcto

Con el servidor de datos y la IA local arrancados, y cuatro usuarios cuyos nombres el clasificador toma por dos mujeres, un hombre y un nombre que no reconoce:

1. Se pide el recuento en cada uno de los cinco clientes.
2. En los cinco se ven los mismos tres números: 2 mujeres, 1 hombre y 1 indefinido.
3. Los usuarios, su lista y sus datos no cambian.

### Sin usuarios

Con la base sin usuarios, los tres números son 0, también con la IA local apagada, porque no hay nada que clasificar.

### Casos que deben fallar

Con usuarios guardados y la IA local apagada, o con una respuesta que no se puede leer, no hay recuento: no se ve ningún número, ni parcial. Se ve este mensaje, en inglés y tal cual en los cinco clientes, también en el panel de VS Code y en la ventana de escritorio, y sin detalles internos:

```text
Could not classify the users.
```

Un nombre que el clasificador no reconoce no es un fallo: suma en indefinidos.

Si no se pueden leer los usuarios guardados, por ejemplo con el servidor de datos parado, tampoco hay recuento. Se ve el mensaje de siempre de las lecturas: `Unable to list users` en el cliente HTTP, la API de Chrome, Nest y la extensión de Chrome, y su frase en español de siempre en el panel de VS Code y en la ventana de escritorio.

### Lo que no cambia

Las tres pantallas del navegador, la terminal y Jupyter siguen como estaban. Crear, listar, ver, modificar y borrar usuarios funciona igual en todos los clientes.
