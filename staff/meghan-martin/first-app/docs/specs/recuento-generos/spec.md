# Spec — recuento de géneros

El producto mira todas las personas ya guardadas y, por el nombre,
adivina women, men o undefined. Luego enseña **cuántas** hay de cada
una, por ejemplo:

women: 1
men: 1
undefined: 1

Eso es una adivinanza a partir del nombre, no la identidad de la
persona. El recuento no se guarda.

Si no hay nadie guardado: women 0, men 0, undefined 0.

Si no se puede adivinar, el producto no muestra el recuento.

No se busca a una sola persona por número. Se miran todas y la
salida es solo esos tres números.

## Few-shot

- Ada → women
- Juan → men
- Alex → undefined
- María → women
