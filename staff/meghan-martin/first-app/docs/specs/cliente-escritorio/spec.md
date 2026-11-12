# Spec — personas en una ventana

Quien usa la app quiere crear, listar, abrir, cambiar y borrar personas en una ventana propia, sin la terminal, Jupyter, la página ni las peticiones HTTP.

No hay login. La base sigue en el puerto 3000. La ventana se abre con `npm run electron` desde `first-app`, con `npm run db` ya en marcha.

La lista muestra el número, el nombre y el email. Si no hay personas, la lista está vacía. Crear pide nombre y email, limpia el formulario y muestra a la persona en la lista. Abrir una fila, o escribir un número, muestra a esa persona con las dos fechas. Guardar un nombre nuevo conserva el email y el número. Guardar un email nuevo conserva el nombre y el número. Borrar vuelve a la lista ya actualizada.

Un nombre vacío muestra `Name is empty`. Un email que no vale muestra `Email is invalid`. Un email que ya es de otra persona muestra `Email is already used`. Un número que no existe muestra `User not found`. Si la base no está en marcha, se ve `Database is not running. Start it with npm run db.`

## Few-shot

- No hay personas. La lista está vacía.
- Se crea una persona. El formulario queda vacío y la lista muestra su número, nombre y email.
- Se abre desde la lista. Se ven el número, el nombre, el email y las dos fechas.
- Se cambia solo el nombre. El número y el email siguen.
- Se cambia solo el email. El número y el nombre siguen.
- El nombre se deja vacío. Se ve `Name is empty`. Lo guardado no cambia.
- Se borra. La lista ya no la muestra.

Queda fuera buscar por email, el recuento por género y el login. Las reglas del nombre y del email no cambian. La terminal, Jupyter, la página y el programa JSON siguen igual.
