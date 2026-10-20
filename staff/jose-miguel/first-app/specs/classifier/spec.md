# Clasificador de género

Se cuentan los usuarios ya registrados, una vez cada uno, según el género de su nombre.

No entra ningún dato. El cálculo usa los usuarios que ya están guardados.

El género lo deduce Llama 3.2 en local, sin coste. Se usa nimble-v3. No se guarda. El resultado solo se muestra.

## Salida

Un único resultado con tres números, en este orden: mujeres, hombres, no definidos.

## Reglas

- Si la IA no manda un mensaje, ese usuario cuenta como no definido.
- Si la respuesta no trae género, ese usuario cuenta como no definido.
- Si no hay usuarios, el resultado es 0, 0, 0. No es un error.
