# Valores y errores

Los fallos se comunican con `throw new Error("...")`. No se definen códigos ni clases de error propias. El texto siempre está en inglés y pertenece a esta lista:

- `Name is empty`
- `Email is invalid`
- `Email is already used`
- `User not found`
- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not find the user`
- `Could not classify the users`

Los cuatro primeros mensajes corresponden a validación de entrada o reglas de negocio. Si SQLite falla durante la operación se utiliza el mensaje `Could not ...` correspondiente y el error de la base no se propaga desde `logic/`. Cuando la operación termina correctamente se entrega el dato limpio; las operaciones que devuelven listas retornan `[]` cuando no hay resultados. En las demás operaciones, si no hay datos que devolver, la función no devuelve ningún valor.

El clasificador devuelve únicamente `women`, `men` y `genderUndefined`.
