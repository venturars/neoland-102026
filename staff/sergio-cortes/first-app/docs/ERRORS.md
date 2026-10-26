# Errores

Los errores de entrada y de negocio salen de `logic/errors.js`. Ese fichero no exporta una función de negocio: exporta las clases. Cada una extiende `Error`. El constructor recibe `message` y asigna `this.name`. Pueden añadirse más clases en ese mismo fichero.

- `ValidationError`: el dato de entrada no vale. Mensajes: `"Id is invalid"`, `"Name is empty"`, `"Email is invalid"`.
- `NotFoundError`: no hay fila. Mensaje: `"User not found"`.
- `ConflictError`: el email ya existe. Mensaje: `"Email is already used"`.
- `DatabaseError`: SQLite lanzó y ese error no sale de `logic/`. Mensajes: `"Could not create the user"`, `"Could not update the user"`, `"Could not delete the user"`, `"Could not list the users"`, `"Could not find the user"`, `"Could not classify the users"`. Este último lo lanza `usersGenderCount`.

Una entrada o una regla de negocio que no llama a una query se comprueba con `if` y lanza esa clase con el mensaje. No va dentro de `try/catch`.

Cada llamada a un querie va dentro de `try/catch`. Si la query lanza, el `catch` lanza la clase global de esa llamada, con su mensaje fijo. No relanza el error de SQLite. Si la query devuelve, la regla que mira ese resultado queda fuera del `try`: un `if` y el `throw` de la clase.

El cliente no captura el error. Llama a la función y muestra el resultado. Si logic lanza, el error sale solo.
