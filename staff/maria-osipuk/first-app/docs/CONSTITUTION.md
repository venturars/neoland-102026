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

Contar por género llama a Ollama en local desde `logic/count-users-by-gender.js`, modelo `gemma4`, usando el paquete `openai` como cliente. No añade una capa. Primero lee los usuarios ya guardados y, solo si hay filas, los envía en partes de hasta 6.

## Guías

- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.

## Flujo de una operación

```text
clients/terminal/          clients/jupyter/
        ↓                          ↓
logic/
        ↓
queries/users.js
        ↓
queries/queries/*.sql
        ↓
db/connection.js
        ↓
db/users.sqlite
```

Ninguna capa accede directamente a otra capa que no sea la siguiente del recorrido. El cuaderno de preparar la tabla llama a `createUsersTable`, igual que su cliente de terminal.

## Decisiones fundamentales

- Cada funcionalidad de negocio tiene su propio archivo.
- Las reglas de negocio viven en `logic/`.
- Los clientes actuales son la terminal y Jupyter Notebook.
- Ninguna funcionalidad se añade sin una tarea concreta.
- Cada pedido tiene su carpeta `docs/specs/<nombre>/` con `spec.md`, `plan.md` y `tasks.md`.
- Hay que usar Socket para validar los paquetes de Node antes de aceptar el plan que los añade o les cambia la versión.

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

Explica qué capas y archivos del recorrido actual se usan, qué entra y qué sale de `logic/`, y cómo se comprobará.

No copia reglas que ya están en `AGENTS.md`.

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
- Hay que usar Socket para validar los paquetes. Al añadir un paquete de Node o cambiar su versión, esa validación se hace antes de aceptar el plan. El procedimiento está en `AGENTS.md`.

## Orden de una función de negocio

1. Recibir los parámetros.
2. Validar sus tipos.
3. Normalizar los datos.
4. Validar las reglas de negocio.
5. Solicitar la operación correspondiente.
6. Estructurar la respuesta.
