# Constitución — first-app

## 1. Qué hace la app

first-app guarda usuarios. No es una web. Se usa desde la terminal, con Node. El CEO también valida esas funcionalidades desde los documentos de Jupyter.

Se puede crear un usuario, listarlos, buscar uno, cambiarlo y borrarlo.

También se pueden contar los usuarios ya guardados según el sexo que sugiere su nombre. El sexo lo decide una IA local, sin coste. El resultado solo se muestra. Es una lectura del nombre, no el sexo verificado de la persona. No se guarda el sexo ni otro campo.

El resultado de ese recuento es un objeto con estos campos y ningún otro:

- `women` — número entero. Cuántos nombres cuentan como mujer.
- `men` — número entero. Cuántos nombres cuentan como hombre.
- `undefinedUser` — número entero. Cuántos nombres cuentan como usuario indefinido.

Usuario indefinido es el nombre que no es claramente de un solo sexo, o el caso en que la IA no elige mujer ni hombre. Si la IA no manda un mensaje, o la respuesta no trae un sexo por nombre, esos nombres cuentan como `undefinedUser`. Si no hay usuarios, los tres números son 0.

Un usuario es un objeto con estos campos y ningún otro:

- `id` — número entero. Lo escribe SQLite. El código no lo inventa.
- `name` — texto.
- `email` — texto en minúsculas. En la tabla es `VARCHAR(64)` y `UNIQUE`.
- `createdAt` — texto con la fecha. Lo escribe SQLite al crear.
- `updatedAt` — texto con la fecha. Lo escribe SQLite al crear y otra vez al cambiar.

## 2. La base de datos

La base de datos y las consultas están en `docs/database.md`.

## 3. Árbol y para qué es cada archivo

El árbol está en `docs/tree.md`.

La función de cada carpeta está en `docs/ARCHITECTURE.md`.

`AGENTS.md` dice cómo se trabaja en esta app: el orden de un cambio, el estilo y qué hacer al cerrar una tarea.

`docs/CONSTITUTIONS.md` es este documento. Manda sobre el comportamiento de la app.

## 4. Cómo se lee el código

Cómo se lee el código está en `docs/style.md`.

## 5. Orden del cuerpo de la función

El orden del cuerpo de la función está en `docs/style.md`.

## 6. Errores

Los errores están en `docs/errors.md`.


## 7. Al terminar una funcionalidad

Cuando se termina de crear una funcionalidad, se crea un cliente.

El cliente es un archivo en `clients/terminal/`. El nombre dice la acción, en kebab-case, y acaba en `.txt`.

Ese archivo se pega en la terminal desde la raíz del repositorio. Entra en `first-app`, importa la función y hace `console.log` del resultado. No captura el error. Es la prueba manual de esa funcionalidad.

## 8. Cómo se hace un desarrollo

Un cambio del proyecto es un desarrollo. Lo es una funcionalidad, una dependencia, la configuración y la documentación.

Un desarrollo no empieza en el código. Se escribe en `docs/specs/<nombre>/`. `<nombre>` va en kebab-case. Ahí hay tres ficheros. Se leen de arriba abajo. Son cortos y concretos. Una persona los revisa antes de seguir.

No hay loop. No se vuelve a escribir el ciclo hasta que un test pase.

`spec.md` es el negocio. Lo lee quien decide si eso es lo que quiere, sin abrir el código. Dice quién lo usa, qué entra, qué sale con un ejemplo, qué fallo se ve y qué queda fuera. Un fallo nombra un mensaje de la lista de «Errores». No nombra ficheros, funciones ni SQL.

`plan.md` es la técnica. Lo lee quien comprueba que el desarrollo cabe en esta constitución. Dice cómo se aplica el negocio:

- qué ficheros se crean y cuáles se tocan
- a qué fichero de `logic/` se parece, sin pegar su código
- la firma: nombre, parámetros y salida
- el SQL nuevo, si lo hay, con los parámetros con nombre (`:id`, `:name`, `:email`)
- qué mensaje de «Errores» corresponde a cada fallo de la spec

Si esta constitución, el código actual y la spec no dicen lo mismo, la pregunta se escribe al final del plan. No hay `tasks.md` ni código hasta tener la respuesta.

`tasks.md` son los pasos, en el orden en que los haría una persona. Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso son como mucho cuatro líneas. Solo se escribe si no hay contradicción.
 No se inventan pasos.

## 9. Validación de paquetes

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket. El cómo está en `AGENTS.md`.

