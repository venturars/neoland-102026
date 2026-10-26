# Clasificador de género

## Para qué

Quien mira los usuarios ya guardados quiere saber cuántas mujeres, cuántos hombres y cuántos no definidos hay.

## Qué hace

El grupo sale del nombre. Lo decide la IA local llama3.2, sin coste. Cada nombre suma en un solo grupo y el recuento solo se muestra.

No definido: el nombre no es claramente de un solo género, la IA no elige mujer ni hombre, no hay mensaje para ese nombre, o el mensaje no trae un género.

Sin usuarios, los tres números son 0.

Si llama3.2 no responde, no hay recuento y se avisa de que no se han podido clasificar los usuarios.

## Qué no hace

- Guardar el género ni cualquier otro dato nuevo.
- Clasificar al dar de alta o al cambiar el nombre.
- Usar el email.
- Devolver la lista de usuarios.
- Cambiar el alta, la consulta, la modificación o la baja.
- Usar una IA de pago.

## Datos

Entra: nada. Cuentan todos los usuarios ya guardados.

Sale: un solo resultado, en este orden: mujeres, hombres, no definidos.

Con Elena, Mateo y Alex:

{ women: 1, men: 1, genderUndefined: 1 }

## Hecho cuando

- Esos tres nombres dan 1, 1 y 1.
- Sin usuarios se ve 0, 0 y 0.
- Un nombre sin género claro suma en el tercero.
- Si llama3.2 no responde, se avisa y no sale el recuento.