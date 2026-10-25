# Buscar un usuario por nombre

Se busca un usuario que ya está guardado. Se pide un nombre. No se crea, no se actualiza y no se elimina nada.

El nombre se limpia como al guardarlo: se le quitan los espacios de los extremos. Si queda vacío, se rechaza. Si tiene más de 100 caracteres, se rechaza. Las letras se quedan como están escritas. `Ana` y `ana` no son el mismo nombre.

Si hay un usuario con ese nombre, se devuelve ese usuario: `id`, `name` y `email`.

Si hay varios con ese mismo nombre, se devuelven todos. Cada uno lleva `id`, `name` y `email`.

Si no hay ninguno, se muestra un error. Los usuarios guardados siguen igual.
