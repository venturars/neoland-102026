# Spec — personas en el navegador

Quien usa la app quiere ver las personas, elegir una, cambiar su nombre y su email, o borrarla, sin usar la terminal ni Jupyter.

No hay login. La página se abre con `npm run browser` desde `first-app`. No se sirve. La base tiene que estar en marcha. Si no lo está, se ve `Database is not running. Start it with npm run db.`

La lista muestra el número, el nombre y el email. Pulsar una fila elige a esa persona.

La página de esa persona tiene volver a la lista y editar.

En editar se cambia el nombre y el email. Un nombre vacío muestra `Name is empty`. Un email que no vale muestra `Email is invalid`. Un email que ya es de otra persona muestra `Email is already used`. En esos tres casos lo guardado no cambia.

Borrar pide confirmación. Si se cancela, la persona sigue. Si se confirma, desaparece de la lista.

## Few-shot

- Hay dos personas. La lista muestra las dos. Pulsar la primera abre sus opciones. Volver regresa a la lista.
- Se cambia el nombre y el email. La lista muestra los nuevos.
- El nombre se deja vacío. La página muestra `Name is empty`. El nombre guardado sigue igual.
- El email no lleva `@`, o no lleva un punto después del `@`, como `maria2@.com`. La página muestra `Email is invalid`. El email guardado sigue igual.
- El email se pone igual al de la otra persona. La página muestra `Email is already used`. Ninguno de los dos cambia.
- Se pide borrar y se cancela. La persona sigue en la lista.
- Se pide borrar y se confirma. La persona ya no está en la lista.

Queda fuera crear una persona desde el navegador y el login.

Las reglas del nombre y del email no cambian. La terminal y Jupyter siguen igual.
