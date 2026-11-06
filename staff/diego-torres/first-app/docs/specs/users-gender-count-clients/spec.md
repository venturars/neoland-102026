Issue: #1058

# Contar por género desde Chrome, VS Code y la API de Nest

Quien prueba la app ve cuántas mujeres, cuántos hombres y cuántos no definidos hay entre los usuarios guardados. Lo hace desde la extensión de Chrome, la extensión de VS Code o la API de Nest, sin ir a la terminal ni a Jupyter.

El recuento es el que ya hace la app: el género lo decide la IA local llama3.2 a partir del nombre, y el resultado no se guarda. La base y la IA local tienen que estar en marcha. En Chrome, también su API local.

No entra ningún dato: se cuentan todos los usuarios guardados.

## Pantalla de las extensiones

Chrome y VS Code tienen un botón «Contar por género». Al pulsarlo, se ve «Contando…» y el botón no se puede volver a pulsar hasta que llega el resultado. El recuento puede tardar unos segundos, y más la primera vez, cuando la IA se está cargando.

Después se ve una línea con los tres números, y el botón vuelve a funcionar:

`Mujeres: 5 · Hombres: 3 · No definidos: 0`

En Chrome, si se cierra la ventana mientras cuenta, el resultado se pierde. Al abrirla otra vez, se puede volver a contar.

## API

En la API de la extensión de Chrome y en la de Nest, se pide por HTTP el recuento y sale `{ women, men, genderUndefined }`.

Una petición desde una web o dirigida a otra dirección se rechaza, igual que en el resto de cada API.

## Ejemplo

Hay ocho usuarios guardados: cinco nombres de mujer y tres de hombre. Se pide el recuento. La API responde `{ women: 5, men: 3, genderUndefined: 0 }`. Las extensiones muestran `Mujeres: 5 · Hombres: 3 · No definidos: 0`.

Si no hay usuarios, los tres números son 0.

## Errores

Si no se llega a la base o la IA no responde, se ve `Could not classify the users`. En Chrome se ve el mismo mensaje si su API local está parada.

Si la IA responde algo que no sirve, esos nombres cuentan como no definidos, como hasta ahora.

## Qué queda fuera

La web y Electron, buscar por nombre o por email, guardar el género, clasificar al crear o al cambiar el nombre, una regla nueva, un mensaje de error nuevo, una IA de pago y cambiar lo que ya hacen las reglas, las consultas, la base, la terminal y Jupyter.

Las specs de Chrome, VS Code y Nest dejaban fuera este recuento. Esta spec lo añade a propósito.
