# CONSTITUTIONS.md — mi-primer-proyecto

Base de la app. login con IA para alumnos junior de AI Engineering, en español, con el código en inglés. Node y una sola base SQLite. Sigue SDD.

## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.

## Paquetes

Los paquetes son `openai`, `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`. Se instalan con pnpm. No se usa npm.

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket.

## SDD

Una funcionalidad nueva empieza en `docs/specs/<nombre>/`. `<nombre>` va en inglés y con guiones, igual que el fichero de `logic/`.

Tres ficheros, en este orden. Cada uno se revisa antes de escribir el siguiente.

1. `spec.md` — negocio. Quién lo usa, qué hace, qué queda fuera, qué entra, qué sale y cuándo está hecho. Habla de la funcionalidad, sin ficheros, sin SQL y sin nombres de funciones.
2. `plan.md` — técnica. Dónde vive en este árbol, la función, las reglas, los errores, el SQL y el cliente `.txt`. Ahí está cómo se construye. El código se escribe al implementar. Los pasos van en `tasks.md`.
3. `tasks.md` — pasos. El orden en que lo haría una persona: abrir un sitio, hacer una cosa, ver el resultado.

Con `tasks.md` en `aceptado` se hace un paso y se para. El paso se deja en `- [ ]`. Quien lo revisa lo marca `- [x]`. El siguiente paso espera esa marca.

No hay bucle. Spec, plan, tareas y código no se escriben en la misma pasada. Las tareas no se recorren solas hasta el final.

Para poder revisarlo: `spec.md` cabe en una pantalla, `plan.md` no pasa de sesenta líneas, `tasks.md` no pasa de doce pasos.

Un paso nombra un solo fichero o una sola comprobación, empieza por un verbo (Crear, Abrir, Escribir, Comprobar) y dice qué se ve al terminar. Van en orden, con `- [ ]`. Sin códigos `T001` y sin marcas de trabajo en paralelo.

```text
- [ ] 3. Abrir logic/create-user.js y escribir la validación del email. Un email vacío lanza "Email is invalid".
```

## Un fichero de logic

`logic/` no importa la base de datos. Recibe el almacén. Cuando una funcionalidad de `logic/` existe, no se mueve a otra carpeta ni se sustituye por otra implementación. Pueden cambiar el cliente y el SQL. Las reglas no.

Una funcionalidad de `logic/` es un fichero. El fichero define el nombre, los parámetros de entrada, el cuerpo y la salida. La forma de cada línea está en `docs/STYLE.md`.

Orden del cuerpo:

1. Validar los parámetros de entrada.
2. Validar las reglas de negocio.
3. Aplicar la logica de negocio.
4. Montar la salida y dejar solo los datos que salen de la función.

El error no se devuelve como objeto. Se lanza con `throw new Error("mensaje en inglés")` dentro de `try/catch`. Los mensajes están en `docs/ERRORS.md`.

## Funciones de logic

`createUser({ name, email })`  
Entrada: nombre y email.  
Salida: el usuario creado, con `id`, `name`, `email`, `createdAt` y `updatedAt`.

`listUsers()`  
Entrada: ninguna.  
Salida: la lista de usuarios, cada uno con `id`, `name`, `email`, `createdAt` y `updatedAt`.

`updateUser({ id, name, email })`  
Entrada: id y los campos enviados (`name`, `email`).  
Salida: el usuario ya actualizado, con `id`, `name`, `email`, `createdAt` y `updatedAt`. `updatedAt` pasa a ser el día del cambio.

`deleteUser({ id })`  
Entrada: id.  
Salida: ninguna. No devuelve un objeto.

`usersGenderCount()`  
Entrada: ninguna.  
Salida: `women`, `men` y `genderUndefined`.

## Cliente

Al terminar una funcionalidad, su primer cliente es un `.txt` en `clients/terminal/`. El fichero es el bloque que se pega en Git Bash, con el directorio actual en `mi-primer-proyecto`. Ese bloque practica la query.
