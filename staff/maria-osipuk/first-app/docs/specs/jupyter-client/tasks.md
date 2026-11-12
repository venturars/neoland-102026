# Cliente Jupyter

## 1. Dejar la base real

En `clients/jupyter/run_logic.py`, no definir `FIRST_APP_DATABASE_FILE`.
Quitar la base de `clients/jupyter/demo/` y el arranque que la vaciaba.
Las funciones del puente no reciben un archivo de base: Node abre `db/users.sqlite`.
Quitar `clients/jupyter/demo/` del `.gitignore` si ya no existe esa carpeta.

## 2. Acortar la celda

Registrar en el kernel `first-app` la carpeta `clients/jupyter` dentro de `PYTHONPATH`.
La celda importa `run_logic` y llama a la operación. No busca carpetas.

## 3. Bienvenida

Dejar en `clients/jupyter/bienvenida.ipynb` el escenario de la lista y las instrucciones de uso: kernel `first-app`, cambiar el dato, pulsar Run, leer el resultado debajo.
Enlazar los cuadernos de operación. No ofrecer la preparación de la tabla como un caso de negocio.

## 4. Cuadernos de operación

Reescribir cada cuaderno de operación con título, escenario, instrucciones y una sola celda. Sin texto después de la celda.

- `crear-usuario.ipynb`: escenario de un alta, por ejemplo Ada Lovelace y `ada@example.com`. La celda llama a `createUser` con nombre y email vacíos. La instrucción nombra «Introduce un email válido.» y «Ya existe un usuario con ese email.»
- `buscar-usuario-por-email.ipynb`: escenario de buscar a Grace Hopper por `grace@example.com`. La celda llama a `findUserByEmail` con el email vacío. La instrucción nombra «Introduce un email válido.» y «No se ha encontrado ese usuario.»
- `buscar-usuario-por-id.ipynb`: escenario de buscar el id que devolvió el alta, por ejemplo el de Alan Turing. La celda llama a `findUserById` con `0`. La instrucción nombra «El identificador debe ser un número entero mayor que cero.» y «No se ha encontrado ese usuario.»
- `actualizar-usuario.ipynb`: escenario de cambiar solo el nombre, por ejemplo de Ada Lovelace a Ada Byron, y conservar el email. La celda llama a `updateUser` con id `0`. La instrucción dice que lo que no se envía se conserva y nombra «Introduce un nombre.»
- `borrar-usuario.ipynb`: escenario de quitar una ficha por su id. La celda llama a `deleteUser` con `0` y, solo si eso termina, muestra `listUsers`. La instrucción nombra «El identificador debe ser un número entero mayor que cero.»
- `listar-usuarios.ipynb`: escenario de revisar quién está en la lista. La celda solo llama a `listUsers`. No inserta a los tres ejemplos. La instrucción nombra «No se ha podido obtener la lista de usuarios.»
- `contar-usuarios-por-genero.ipynb`: escenario de contar la lista ya guardada. La celda llama a `countUsersByGender`. La instrucción dice que hace falta Ollama con `gemma4` y nombra la frase de clasificar los nombres.

## 5. Cuaderno de la tabla

Reescribir `clients/jupyter/preparar-tabla-usuarios.ipynb` con el mismo formato corto.
Decir que es preparación, que no inserta personas y que la aplicación ya crea la tabla al usarla.
La celda llama a `createUsersTable` y muestra `listUsers`.

## 6. Constitución

En `docs/CONSTITUTION.md`, el cliente Jupyter lee y escribe `db/users.sqlite`.
No aparece la carpeta `demo/`.
Cada cuaderno de operación queda descrito como escenario, instrucciones y una celda, sin texto debajo.
Un fallo del cuaderno muestra solo la frase en español. El mensaje interno de `logic/` no cambia.

## 7. Frases del puente

Abrir `clients/jupyter/run_logic.py`.
Añadir la tabla de mensajes internos y `report_error`.
Un mensaje conocido muestra su frase. Otro fallo muestra «No se ha podido completar la operación» y escribe el detalle en `clients/jupyter/jupyter-client.log`.
Ignorar ese log en `.gitignore`. No añadir dependencias.

## 8. Celdas

En cada cuaderno de operación y en el de la tabla, envolver la llamada en `try` y el aviso en `except`.
En borrar y en preparar la tabla, dejar `listUsers` dentro del `try`, después de la operación.
Sustituir en las instrucciones el mensaje interno por la frase en español.
Borrar las salidas guardadas de las celdas.

## 9. Comprobar en una copia

Copiar el proyecto a un directorio temporal, sin usar `db/users.sqlite` de la aplicación.
Probar id inválido, usuario inexistente, nombre vacío, email inválido, email duplicado y un fallo operativo simulado.
Comprobar que la salida visible es solo la frase en español y que un alta correcta sigue devolviendo la ficha.
