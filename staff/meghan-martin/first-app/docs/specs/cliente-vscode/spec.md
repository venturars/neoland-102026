# Spec — personas en VS Code

Quien usa la app quiere crear, listar, buscar, cambiar y borrar personas en un panel dentro de VS Code, sin salir del editor y sin la terminal, Jupyter ni la página.

No hay login. La base sigue en el puerto 3000 y tiene que estar en marcha con `npm run db`. El panel usa las mismas personas que los otros clientes. Un comando abre el panel. Al cerrar VS Code se cierra. Se vuelve a abrir con el mismo comando.

La lista muestra el número, el nombre y el email, ordenados por número. Si no hay personas, se ve que la lista está vacía. Crear pide nombre y email. Si se guarda, se ve la persona creada y la lista ya actualizada. Si el nombre o el email no valen, se ve el fallo y lo escrito sigue en el formulario para corregirlo.

Buscar usa las personas ya cargadas. Un nombre coincide con el nombre entero, y las mayúsculas cuentan: `Ana` no es `ana`. Un email sigue la regla de email que ya existe. Un número que la app no puede guardar muestra `Invalid id` y se puede corregir. Si no hay coincidencias, se ve que la búsqueda no encontró a nadie. Eso no es lo mismo que la lista vacía.

Se elige una persona y se puede cambiar el nombre, el email, o los dos. Cancelar deja lo guardado. Un fallo al guardar se ve, y lo escrito no se pierde. El éxito se ve cuando el cambio ya está guardado.

Borrar pide escribir el email guardado. No cuentan los espacios de los extremos ni las mayúsculas. Un email vacío o distinto no borra, y se puede corregir o cancelar. Cancelar no borra. Tras un borrado hecho, se ve la lista ya actualizada.

Si la base no está en marcha, se ve `Database is not running. Start it with npm run db.` y se puede reintentar. Si la persona elegida ya no existe, se ve `User not found` y se puede actualizar la lista. No se anuncia un éxito antes de que la operación termine. El panel se puede recorrer y usar con el teclado.

## Few-shot

- No hay personas. Se ve que la lista está vacía.
- Se crea Ana con `ana@example.com`. La lista la muestra.
- Hay `Ana` y `ana`. Buscar `Ana` devuelve solo `Ana`. Buscar `ANA` no devuelve a nadie.
- El email de búsqueda no lleva `@`. Se ve `Email is invalid`. No se pierde lo escrito.
- El número no es un entero que la app pueda guardar. Se ve `Invalid id`. Se puede corregir.
- Se cambia solo el nombre. El número y el email siguen. Cancelar no cambia lo guardado.
- El email nuevo ya es de otra persona. Se ve `Email is already used`. Lo escrito sigue ahí.
- Para borrar, se escribe el email guardado con un espacio y otra mayúscula. Se borra. La lista ya no la muestra.
- Se escribe otro email. No se borra.

Queda fuera el recuento por género, el login y publicar la extensión. Las reglas del nombre y del email no cambian. La terminal, Jupyter, la página y los otros clientes siguen igual.
