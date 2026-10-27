# Clasificador de género

Se cuentan los usuarios ya guardados según el género de su nombre. El género lo decide la IA local llama3.2, sin coste. El resultado solo se muestra.

Lo usa quien quiere saber cuántas mujeres, cuántos hombres y cuántos no definidos hay entre esos usuarios.

No entra ningún dato. Se cuentan todos los usuarios ya guardados.

Cada nombre cuenta como mujer, hombre o no definido. No definido es el caso en que el nombre no es claramente de un solo género, o la IA no elige mujer ni hombre.

Sale un único resultado con tres números, en este orden: mujeres, hombres y no definidos.

Ejemplo si los usuarios fueran Elena, Mateo y Alex:

{ women: 1, men: 1, genderUndefined: 1 }

Si no hay usuarios, los tres números son 0.

Si llama3.2 no manda un mensaje, o la respuesta no trae un género por nombre, esos nombres cuentan como no definidos.

Si llama3.2 no responde, se ve `No se han podido clasificar los usuarios`.

Queda fuera guardar el género u otro dato nuevo, cambiar el resto de funcionalidades de usuarios, clasificar al crear o al cambiar el nombre, usar el email, devolver la lista de usuarios y usar una IA de pago.
