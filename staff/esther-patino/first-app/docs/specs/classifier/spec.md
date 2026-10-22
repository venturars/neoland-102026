# Clasificador de sexo

Se cuentan los usuarios ya guardados según el sexo que sugiere su nombre. El sexo lo decide la IA local [llama3.2](https://ollama.com/library/llama3.2), sin coste. El resultado solo se muestra. Es una lectura del nombre, no el sexo verificado de la persona.

Lo usa quien quiere saber cuántas mujeres, cuántos hombres y cuántos usuarios indefinidos hay entre esos usuarios.

No entra ningún dato. Se cuentan todos los usuarios ya guardados.

Cada nombre cuenta como mujer, hombre o usuario indefinido. Usuario indefinido es el caso en que el nombre no es claramente de un solo sexo, o la IA no elige mujer ni hombre.

Sale un único resultado con tres números, en este orden: mujeres, hombres y usuarios indefinidos.

Ejemplo si los usuarios fueran Elena, Mateo y Alex:

{ women: 1, men: 1, undefinedUser: 1 }

Si no hay usuarios, los tres números son 0.

Si la IA no manda un mensaje, o la respuesta no trae un sexo por nombre, esos nombres cuentan como usuarios indefinidos.

Si llama3.2 no responde, se dice que no se han podido clasificar los usuarios.

Queda fuera guardar el sexo u otro dato nuevo, cambiar el resto de funcionalidades de usuarios, clasificar al crear o al cambiar el nombre, usar el email, devolver la lista de usuarios y usar una IA de pago.
