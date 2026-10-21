# Spec — recuento de géneros

El producto mira todas las personas ya guardadas y, por el nombre,
adivina women, men o undefined. Luego enseña **cuántas** hay de cada
una, por ejemplo:

women: 1
men: 1
genderUndefined: 1

`genderUndefined` son los nombres que no están claros.

Eso es una adivinanza a partir del nombre, no la identidad de la
persona. El recuento no se guarda.

Si no hay nadie guardado: women 0, men 0, genderUndefined 0.

Si no se puede leer la lista o no se puede preguntar al modelo,
el producto no muestra el recuento.

Los nombres se miran de seis en seis. Si a un grupo le faltan
respuestas o no trae un resultado por nombre, esos nombres cuentan
como genderUndefined y se sigue con el resto.

No se busca a una sola persona por número. Se miran todas y la
salida es solo esos tres números.

## Few-shot

- Carmen → women
- Lucia → women
- Javier → men
- Pablo → men
- Kim → undefined
