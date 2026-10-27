# Errores

El manejo de errores está **solo en `logic/`**. `queries/` no usa `try/catch`.

Sin clases de error. Se usa `throw new Error("clear English message")`.

El error depende del paso del cuerpo:

1. Validar los parámetros de entrada. Las reglas de negocio lanzan el error del dato y quedan **fuera** del `try`.
   - `"Name is required"`
   - `"Name cannot exceed 100 characters"`
   - `"Email is required"`
   - `"Email cannot exceed 255 characters"`
   - `"Email is not valid"`
2. Validar el resto de reglas de negocio. Las reglas de negocio lanzan el error de la regla y quedan **fuera** del `try`, después de la consulta que comprueba la regla.
   - `"A user with that email already exists"`
   - `"User does not exist"`
3. Aplicar la lógica de negocio. El `try/catch` envuelve **solo** las llamadas a `queries/`. El `catch` no compara mensajes: lanza el error de la operación. Así no se muestran errores de SQLite.
   - `"Could not create the user"`
   - `"Could not update the user"`
   - `"Could not delete the user"`
   - `"Could not list the users"`
   - `"Could not find the user"`
   - `"Could not count the users by gender"`
4. Estructurar la salida y sanear la respuesta. Este paso no lanza error. Devuelve el dato saneado.

El client de terminal no captura el error para maquillarlo. Lo muestra.

No hay envoltorios del tipo `{ ok, data }` ni tipos `ValidationError` / `NotFoundError`.
