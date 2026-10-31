# Constitución — first-app

## Objetivo

`first-app` es una aplicación educativa de gestión de usuarios construida con Node.js y SQLite.

El objetivo es aprender a desarrollar una aplicación sencilla por capas, entendiendo el recorrido de los datos y la responsabilidad de cada archivo.

## Alcance actual

Actualmente la aplicación permite:

- crear un usuario;
- buscar un usuario por email;
- buscar un usuario por id;
- actualizar un usuario;
- borrar un usuario;
- listar los usuarios;
- contar los usuarios según el género de su nombre;
- crear la tabla `users`;
- comprobar las operaciones desde la terminal;
- comprobar esas mismas operaciones desde Jupyter Notebook.

La aplicación no tiene frontend, API HTTP ni autenticación. El cliente Jupyter no añade operaciones: llama a las que ya existen.

Contar por género llama a Ollama en local desde `src/logic/count-users-by-gender.js`, modelo `gemma4`, usando el paquete `openai` como cliente. No añade una capa. Primero lee los usuarios ya guardados y, solo si hay filas, los envía en partes de hasta 6.

## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.

## Flujo de una operación

```text
src/clients/terminal/          src/clients/jupyter/
        ↓                          ↓
src/logic/
        ↓
src/queries/users.js
        ↓
src/queries/queries/*.sql
        ↓
src/db/connection.js
        ↓
src/db/users.sqlite
```

Ninguna capa accede directamente a otra capa que no sea la siguiente del recorrido. El cuaderno de preparar la tabla llama a `createUsersTable`, igual que su cliente de terminal.

## Decisiones fundamentales

- Cada funcionalidad de negocio tiene su propio archivo.
- Las reglas de negocio viven en `src/logic/`.
- Los clientes actuales son la terminal y Jupyter Notebook.
- Ninguna funcionalidad se añade sin una tarea concreta.
- Cada pedido tiene su carpeta `docs/specs/<nombre>/` con `spec.md`, `plan.md` y `tasks.md`.
- Hay que usar Socket para validar los paquetes de Node antes de aceptar el plan que los añade o les cambia la versión, como dice «Paquetes».

## Specs

El nombre de la carpeta va en kebab-case. La carpeta de contar usuarios por género es `docs/specs/classifier/`.

Esos tres ficheros describen ese pedido. No describen el estado del código. El estado real del proyecto es esta constitución.

Antes de modificar el código de un pedido, hay que leer por completo `spec.md`, `plan.md` y `tasks.md` de su carpeta.

Si contradicen esta constitución, no se programa. Se señala la contradicción y se espera una decisión.

### `docs/specs/<nombre>/spec.md`

Es la parte de negocio.

Recoge el pedido del product owner: qué se podrá hacer, un ejemplo correcto, un ejemplo que debe fallar y cómo se nota en la terminal que está terminado.

No contiene archivos, SQL ni capas.

Si el pedido es una forma de trabajar, describe la regla, a quién obliga y cómo se comprueba que se está siguiendo.

### `docs/specs/<nombre>/plan.md`

Es la parte técnica.

Explica qué capas y archivos del recorrido actual se usan, qué entra y qué sale de `src/logic/`, y cómo se comprobará.

No copia reglas que ya están en las guías.

### `docs/specs/<nombre>/tasks.md`

Son los pasos para implementar el pedido, en el orden en que los haría una persona.

Cada paso abre un sitio, hace una cosa y deja un resultado que se puede mirar. Un paso ocupa como mucho cuatro líneas.

No son tickets de agente.

## Gestión de dependencias

Por política de seguridad, el gestor del proyecto es pnpm 10. También en las próximas funcionalidades.

pnpm 10 no ejecuta los scripts de instalación de las dependencias hasta que se autorizan. Esos scripts son código de terceros y se lanzan al instalar. Además, cada paquete solo puede usar lo que declaró.

- No se usan `npm` ni `npx`. Tampoco yarn ni bun.
- Instalar lo declarado: `pnpm install`.
- Añadir una dependencia: `pnpm add`.
- Ejecutar un script: `pnpm run`.
- Ejecutar una herramienta ya instalada: `pnpm exec`.
- Descargar una herramienta de forma temporal: `pnpm dlx`.
- El archivo de bloqueo que se conserva es `pnpm-lock.yaml`. No se genera `package-lock.json`.
- `package.json` declara `packageManager` con `pnpm@10.34.7`. El script `preinstall` termina con error si el instalador no es pnpm, así que `npm install` no llega a instalar.
- Revisar las dependencias y los scripts de instalación antes de autorizar su ejecución. Usar pnpm no sustituye esta revisión.
- El cliente Jupyter no añade dependencias Node. `notebook` e `ipykernel` se instalan con pip en el `.venv` de `first-app`.
- Hay que usar Socket para validar los paquetes. Al añadir un paquete de Node o cambiar su versión, esa validación se hace antes de aceptar el plan. El procedimiento está en «Paquetes».

## Orden de una función de negocio

1. Recibir los parámetros.
2. Validar sus tipos.
3. Normalizar los datos.
4. Validar las reglas de negocio.
5. Solicitar la operación correspondiente.
6. Estructurar la respuesta.

## Paquetes

Al añadir un paquete de Node o cambiar su versión, se comprueba ese paquete y esa versión con el MCP `socket-mcp` antes de aceptar el plan. Se mira si:

- están afectados por una campaña;
- tienen alguna alerta;
- tienen alguna stat por debajo de 50 puntos.

Cada dato se escribe con la herramienta de `socket-mcp` que le corresponde:

- Las stats salen de `depscore`, con la versión exacta. Una stat por debajo de 50 se escribe. 50 no baja.
- La alerta sale de `alerts`, con el `org_slug` que devuelve `organizations`. Una lista vacía es la lista de la organización: no dice que esa versión no tenga alerta.
- La campaña sale de `threat_feed`, con ese mismo `org_slug`.

Si una herramienta no puede contestar, el resumen dice el motivo que devolvió. No se escribe «no consta» sin haberla llamado.

Las dependencias de ese paquete se revisan, hasta 3 capas, con los mismos criterios.

Las alertas se comentan en el plan y las decide quien acepta el plan. El plan lleva un resumen con el paquete, la versión, lo encontrado en cada capa y las alertas que quedan por decidir. Sin ese resumen, el plan no se acepta.

## Contrato de las funciones

La firma muestra qué datos necesita la función:

- Sin entrada, sin argumentos: `listUsers()`.
- Un solo dato, recibido directamente y con un nombre descriptivo: `findUserById(id)` o `findUserByEmail(email)`.
- Varios valores fijos, visibles en la firma.
- Un objeto solo cuando el grupo tiene significado propio, como `changes` en una actualización parcial, o cuando la spec define ese contrato. No se agrupa un `id` ni un `email` sin necesidad.
- El nombre describe la acción completa y coincide con la finalidad del archivo.
- No se desestructura un objeto en la firma. Se comprueba primero que sea un objeto válido y después se leen sus propiedades dentro del cuerpo.

Una actualización parcial recibe el identificador y los cambios por separado: `updateUser(id, changes)`. Valida primero `id` y comprueba que `changes` sea un objeto válido. Solo modifica las propiedades presentes en `changes` que la spec permita actualizar, y conserva el valor actual de las demás. Cada valor se valida y normaliza con las mismas reglas que al crearlo. Una entidad puede conservar su propio valor único, pero no usar el de otra fila. Devuelve la entidad completa y saneada, salvo que la spec defina otro resultado.

Cuando una operación funciona, devuelve directamente el dato saneado, sin envolverlo en `{ ok: true }`:

```js
return {
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
};
```

Si no produce datos, no devuelve un valor artificial.

Al crear o modificar una funcionalidad, estas reglas se aplican a todas las funciones afectadas y se actualizan sus clientes de terminal. Cada archivo de `src/clients/terminal/` contiene una sola línea: el caso correcto. Los casos incorrectos se prueban al implementar y no se guardan en el `.txt`.

## Reglas de implementación y seguridad

- Se usan las capas existentes. Antes de crear un archivo o una consulta, se comprueba si ya hay uno con esa responsabilidad.
- No se devuelven campos que el cliente no necesita ni se convierten en silencio datos inválidos.
- Se valida la entrada antes de usarla.
- No se guardan secretos, tokens ni contraseñas en el repositorio, y no se sube `src/db/users.sqlite`.
- Los ejemplos no llevan emails reales.
- No se borra ni se reemplaza la base real al comprobar algo.
- No se añade autenticación ni contraseñas sin una tarea específica.

## Sincronización de la documentación

Esta constitución representa siempre el estado real del proyecto. Después de implementar un cambio, se comprueba si hay que actualizarla, y se actualiza en la misma tarea cuando:

- se crea, elimina, mueve o renombra un archivo o carpeta: también `docs/TREE.md` y `docs/ARCHITECTURE.md`;
- se añade o elimina una funcionalidad;
- cambia el árbol: `docs/TREE.md`;
- cambia el recorrido de los datos;
- cambia la responsabilidad de una capa o de un fichero: `docs/ARCHITECTURE.md`;
- cambia el contrato de entrada o salida de `src/logic/`;
- cambia la estructura de la base de datos, o los tipos y las reglas de validación de `id`, `name`, `email`, `created_at` o `updated_at`: `docs/DATABASE.md`;
- cambia una decisión fundamental de la arquitectura.

Al actualizarla, solo se describe lo que ya existe: no se añaden archivos ni funcionalidades planificadas, no se copian aquí el árbol ni las responsabilidades y se elimina lo que dejó de ser cierto.

Si una modificación interna no afecta al árbol, al alcance, al flujo, al contrato ni a la arquitectura, no se cambia la constitución. Al terminar se indica que se revisó y que no necesitaba actualización. Una tarea que requiera actualizarla no está terminada hasta que el código y la constitución coincidan.
