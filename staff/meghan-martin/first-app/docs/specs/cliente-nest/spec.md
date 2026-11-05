# Spec — personas por Nest

Quien usa la app quiere crear, listar, ver, cambiar y borrar personas por HTTP, sin abrir una página.

No hay contraseña. La base sigue en el puerto 3000. Este programa escucha en el puerto 3003. No sustituye al programa del puerto 3001.

Crear pide nombre y email y responde 201 y la persona. Listar responde 200 y la lista. Si no hay personas, la lista está vacía. Ver pide un id y responde 200 y la persona. Cambiar pide el id y un nombre, un email, o los dos. Lo que no entra conserva el valor guardado. Responde 200 y la persona. Borrar pide el id y responde 204, sin cuerpo. Otra ruta responde 404, sin cuerpo.

La persona trae el id, el nombre, el email y las dos fechas. Un fallo conocido responde JSON con la clave `message` y esa frase. Un nombre vacío es `Name is empty` con 400. Un email que no vale es `Email is invalid` con 400. Un email de otra persona es `Email is already used` con 409. Un id que no está es `User not found` con 404. Si no se llega a la base, se ve el `Could not` de esa acción con 500.

## Few-shot

- Se crea Ada con `ada@example.com`. Salen su id, el nombre Ada, el email y las dos fechas. La lista la muestra.
- Se pide ese id. Se ven los mismos datos.
- Se cambia el nombre a Ada Lovelace. El id y el email siguen.
- Se borra. La respuesta no trae una persona. Ada ya no sale en la lista.
- El nombre se deja vacío. Se ve `Name is empty`.
- El email no lleva `@`. Se ve `Email is invalid`.
- El email ya es de otra persona. Se ve `Email is already used`.
- Se pide un id que no existe. Se ve `User not found`.

Queda fuera la contraseña, contar por género, buscar por nombre, buscar por email, una página propia y cambiar las reglas. El programa del puerto 3001 sigue igual.
