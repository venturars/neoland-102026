# Errores

Un fallo se señala con `throw new Error("...")`. El mensaje está en inglés y es siempre uno de los de esta lista. No hay códigos ni clases de error propias.

En los pasos 1 y 2, si la entrada o una regla de negocio falla:

- `Name is empty`
- `Email is invalid`
- `Email is already used`
- `User id is not valid`
- `No user exists with that id`

En el paso 3, si SQLite falla, ese error no sale de `logic/`. Se lanza uno de estos:

- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not classify the users`

En el paso 4, si todo va bien, la función devuelve el dato saneado. Si la operación no tiene datos, no devuelve nada.
