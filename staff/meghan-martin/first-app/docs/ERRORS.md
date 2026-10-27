# Errores

Un fallo es `throw new Error("...")`. La frase va en inglés y es una de esta lista. No hay códigos ni clases de error propias. Cada plan dice cuál de estas frases corresponde a su fallo.

Si lo que entra no vale, o una regla no se cumple:

- `Name is empty`
- `Email is invalid`
- `Email is already used`
- `Invalid id`
- `User not found`

Si SQLite falla, ese fallo no sale de `logic/`. Sale una de estas:

- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not find the user`
- `Could not classify the users`

Si todo va bien, la acción devuelve su resultado. Si no hay nada que devolver, no devuelve nada.
