Issue: #804

# Cliente web de usuarios

Un cliente en el navegador, hecho con HTML, CSS y JavaScript vanilla, para elegir tu usuario y gestionarlo. Lo usa quien tiene la app abierta en su propio ordenador.

No hay contraseña ni login. Eliges quién eres de una lista.

## Pantallas

### 1. Selección

Sale la lista de usuarios guardados. Cada opción muestra el id, el nombre y el email, por ejemplo `#1 · Elena — elena@mail.com`.

Eliges uno y pulsas «Continuar». Se va al menú de ese usuario.

Si no hay usuarios, se ve `No hay usuarios todavía`. Si la lista no se puede cargar, se ve `No se ha podido cargar la lista` y un botón para volver a intentarlo.

### 2. Menú

Arriba se ven el id, el nombre y el email del usuario elegido. Hay tres opciones:

- «Volver»: lleva a la selección.
- «Modificar usuario»: lleva a la edición.
- «Ir a notas»: lleva a las notas.

### 3. Edición

Un formulario con el nombre y el email, ya rellenos con los datos actuales.

- «Guardar»: guarda los cambios. Si salen bien, se vuelve al menú con los datos nuevos y se ve `Datos guardados`. Si fallan, se queda en el formulario con lo escrito y se ve el mensaje de error.
- «Eliminar usuario»: pide confirmación. Si confirmas, se borra el usuario y se vuelve a la selección, donde ya no aparece.
- «Volver»: vuelve al menú sin guardar.

### 4. Notas

Las notas aún no existen. La pantalla dice `Aún no hay notas` y tiene un botón «Volver» al menú.

## Errores

Los mensajes son los de la constitución, tal como llegan de la lógica:

- `Name is required`
- `Email is invalid`
- `A name or an email is required`
- `Email <email> is already registered`
- `There is no user with id <id>`

Si el servidor no responde, se ve `No se ha podido conectar con la aplicación`.

## Qué queda fuera

Crear usuarios desde el navegador, buscar por nombre o por email, el recuento de géneros, cualquier login o contraseña, guardar o leer notas, abrir la app a otros ordenadores y añadir paquetes nuevos.
