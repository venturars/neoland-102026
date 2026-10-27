# Clasificador de género

Se cuentan los usuarios ya registrados, una vez cada uno, según el género de su nombre.

La prueba pasa la lista de nombres. No usa los usuarios ya guardados.

El género lo deduce Llama 3.2 en local, sin coste. Se usa nimble-v3. No se guarda. El resultado solo se muestra.

## Salida

Un único resultado: `{ women: 0, men: 0, genderUndefined: 0 }`.

## Reglas

- Si la IA no manda un mensaje, ese usuario cuenta como no definido.
- Si la respuesta no trae género, ese usuario cuenta como no definido.
- Si no hay nombres, el resultado es `{ women: 0, men: 0, genderUndefined: 0 }`. No es un error.
