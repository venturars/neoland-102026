# Users gender count

## Qué se pide

Contar los usuarios ya guardados según el género de su nombre.

La clasificación la hace un modelo local: Ollama con gemma4. Cada usuario entra en una sola categoría:

- `female`
- `male`
- `undefined`

El modelo responde con un dato `gender`. Solo los textos exactos `female` y `male` suman en su categoría. `undefined`, otra palabra, otra mayúscula o espacios cuentan en `undefined`. Eso no es un fallo.

Se cuenta cada usuario una vez, aunque varios compartan el mismo nombre. El nombre se usa tal como está guardado.

## Quién lo usa

La persona que prueba la aplicación desde la terminal, igual que en el resto de operaciones.

## Qué entra

Nada. No se pide un nombre, un id ni ningún otro dato. Se usan los usuarios que ya existen.

## Qué sale

Tres números, uno por categoría. Un caso correcto, con cuatro usuarios cuyos nombres el modelo clasifica como Ada Lovelace, Grace Hopper, Alan Turing y un nombre que no reconoce:

```text
{ female: 2, male: 1, undefined: 1 }
```

Si no hay usuarios, el caso también es correcto y los tres números son cero:

```text
{ female: 0, male: 0, undefined: 0 }
```

El orden de las categorías es `female`, `male`, `undefined`.

## Qué fallo se ve

Si no se pueden leer los usuarios guardados, se ve este mensaje:

```text
Unable to list users
```

Si no se puede preguntar al modelo, o la respuesta no se puede leer, no hay recuento. Se ve este mensaje:

```text
Unable to classify names
```

Un nombre que el modelo no clasifica no es un fallo: suma en `undefined`.

