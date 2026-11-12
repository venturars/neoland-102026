# Cliente Jupyter

Issue: #375.

## Qué se pide

Un cliente para probar la aplicación en el navegador, con Jupyter Notebook en el propio ordenador. La interfaz es Notebook, no JupyterLab. No hace falta programar.

Hay un cuaderno por cada operación que ya se puede probar desde la terminal, más un cuaderno de bienvenida que sirve de índice. Cada cuaderno llama a las reglas que ya existen. No añade operaciones nuevas.

Sirve para que el CEO entienda qué permite hacer la aplicación, pruebe cada caso sobre la lista real y decida si cubre las necesidades actuales.

## Quién lo usa

El CEO, que no programa. Quien prepara los archivos puede ser otra persona. Quien los abre y los ejecuta es el CEO, desde el navegador.

## Qué ve el CEO

Cada cuaderno de operación tiene, en este orden, solo tres cosas:

1. El escenario: en pocas frases, qué situación es y con qué datos se entendería. Los nombres de ejemplo son Ada Lovelace, Grace Hopper y Alan Turing. Son la situación, no personas que el cuaderno inserte solo.
2. Las instrucciones: qué valor cambiar, pulsar Run, qué sale debajo y el fallo que ya existe, en una o dos frases.
3. Una celda de código.

Después de la celda no hay texto. El resultado es la salida de esa celda.

El texto cabe en la pantalla sin recorrer un manual. No hay secciones de resultado esperado, validación del caso ni prueba guiada debajo del código.

La celda no crea una base aparte ni rellena personas de ejemplo. Lee y escribe `db/users.sqlite`. El CEO cambia los valores y ejecuta.

## Qué se puede probar

Estas operaciones ya existen. Cada una tiene su cuaderno:

- crear un usuario, con nombre y email;
- buscar un usuario por email;
- buscar un usuario por id;
- actualizar el nombre, el email o los dos;
- borrar un usuario;
- ver la lista de usuarios;
- contar los usuarios según el género de su nombre.

Contar por género usa los usuarios ya guardados. La clasificación la hace el modelo local que ya usa la aplicación. Si no hay usuarios, el resultado correcto es cero en cada categoría. Un nombre que el modelo no clasifica no es un fallo: entra en `undefined`.

## Preparación técnica

Preparar la tabla de usuarios ya existe como operación de terminal, pero no es una acción del CEO. La aplicación la hace sola al abrir la base. Su cuaderno lo dice en el mismo formato corto y no se presenta como una necesidad de negocio.

## Qué entra y qué sale

- Crear pide nombre y email. Devuelve el usuario creado, con su id.
- Buscar por email pide el email. Devuelve ese usuario, o avisa si no existe.
- Buscar por id pide el id. Devuelve ese usuario, o avisa si no existe.
- Actualizar pide el id y solo los datos que se quieren cambiar. Devuelve el usuario completo. Lo que no se envía se conserva.
- Borrar pide el id. Si existe, lo elimina y no devuelve el usuario. Debajo se ve la lista.
- Listar no pide datos. Devuelve los usuarios de `db/users.sqlite`.
- Contar por género no pide datos. Devuelve cuántos nombres quedan en `female`, `male` y `undefined`.

El id, las fechas de alta y de modificación los escribe la aplicación. El CEO no los inventa.

## Ejemplo correcto

En el cuaderno de alta, el CEO escribe el nombre y el email, por ejemplo `Ada Lovelace` y `ada@example.com`, y ejecuta la celda. Debajo se ve el nombre, el email y un id mayor que cero.

## Qué fallo se ve

El fallo no tiene otra celda. Debajo de la misma celda sale solo una frase en español, en texto normal. No sale un traceback, ni el nombre de una clase, ni una ruta, ni el mensaje interno en inglés.

La frase es la misma en todos los cuadernos:

- no hay un usuario con ese id o ese email: «No se ha encontrado ese usuario.»;
- el identificador no es un entero mayor que cero: «El identificador debe ser un número entero mayor que cero.»;
- falta el nombre o está vacío: «Introduce un nombre.»;
- el email no es válido: «Introduce un email válido.»;
- ese email ya pertenece a otro usuario: «Ya existe un usuario con ese email.»;
- los cambios no llegan como un grupo de datos: «Revisa los datos que quieres modificar.»;
- no se ha podido crear: «No se ha podido crear el usuario.»;
- no se ha podido actualizar: «No se ha podido actualizar el usuario.»;
- no se ha podido borrar: «No se ha podido borrar el usuario.»;
- no se ha podido leer la lista: «No se ha podido obtener la lista de usuarios.»;
- no se ha podido buscar: «No se ha podido realizar la búsqueda.»;
- no se han podido clasificar los nombres: «No se han podido clasificar los nombres. Comprueba Ollama y el modelo configurado.».

Cualquier otro fallo, incluido uno inesperado, muestra solo «No se ha podido completar la operación». El detalle técnico no sale en el cuaderno. Queda guardado para diagnóstico, fuera de esa salida.

Si la operación falla, no aparece un mensaje de éxito y no se ejecuta el paso siguiente que dependía de ella. Borrar, si falla, no muestra la lista de después.

Ejemplo: buscar el id `0`. Debajo solo está «El identificador debe ser un número entero mayor que cero.»

## Cómo se nota que está terminado

En el navegador se abre primero el cuaderno de bienvenida. Desde ahí se llega a cada caso. Con el kernel de esta aplicación, la celda se ejecuta y el resultado queda debajo, sin más texto. Un caso válido sigue mostrando su ficha, su lista o su recuento. Un fallo conocido muestra solo su frase en español. La lista que cambia es `db/users.sqlite`.
