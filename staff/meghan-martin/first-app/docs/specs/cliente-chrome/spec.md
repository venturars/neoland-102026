# Spec — personas en Chrome

Quien usa la app quiere crear, listar, abrir, cambiar y borrar personas desde una extensión de Chrome, sin la terminal, Jupyter, la página ni el programa JSON del puerto 3001.

No hay login. La base sigue en el puerto 3000. Un programa nuevo escucha en `127.0.0.1:3002` y responde JSON. La extensión solo habla con ese programa. Arranca con `npm run chrome` desde `first-app`, con `npm run db` ya en marcha. La extensión se carga en Chrome sin empaquetar.

La lista muestra el número, el nombre y el email. Si no hay personas, la lista está vacía. Crear pide nombre y email, limpia el formulario y muestra a la persona en la lista. Abrir muestra a esa persona con las dos fechas. Guardar un nombre nuevo conserva el email y el número. Guardar un email nuevo conserva el nombre y el número. Borrar vuelve a la lista ya actualizada.

Un nombre vacío muestra `Name is empty`. Un email que no vale muestra `Email is invalid`. Un email que ya es de otra persona muestra `Email is already used`. Un número que no existe muestra `User not found`. Si la base no está en marcha, se ve `Database is not running. Start it with npm run db.`

## Few-shot

Ada no está. La lista está vacía.

Se crea Ada con `ada@example.com`. El formulario queda vacío y la lista muestra su número, nombre y email.

Se abre. Se ven el número, el nombre, el email y las dos fechas.

Se cambia solo el nombre. El número y el email siguen.

El nombre se deja vacío. Se ve `Name is empty`. Lo guardado no cambia.

El email se deja en `ada`. Se ve `Email is invalid`. Lo guardado no cambia.

El email ya es de otra persona. Se ve `Email is already used`. Ninguna cambia.

Se pide un número que no existe. Se ve `User not found`.

Se borra a Ada. La lista ya no la muestra.

Queda fuera buscar por email, el recuento por género y el login. Las reglas del nombre y del email no cambian. La terminal, Jupyter, la página y el programa del puerto 3001 siguen igual.
