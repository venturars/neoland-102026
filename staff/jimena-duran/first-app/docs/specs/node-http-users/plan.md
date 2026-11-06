Issue: #1110

# Plan del cliente Node HTTP y sus notebooks

## Base y diseño

Rama `1110-feat-node-http-users`, desde `staging` actualizado a
`a727cbe8e8b3739549038205b7a2f8bc3e7f1365`. Swagger y Bruno permanecen
en sus ramas y checkouts separados. La base no contiene este cliente.

Crear `src/clients/node-http/app.js` con `node:http` y módulos ESM.
Escuchar únicamente en `http://127.0.0.1:3004`. Leer método, ruta y cuerpo
JSON para delegar directamente en las cinco funciones existentes de
`src/logic/`; no repetir sus reglas ni acceder directamente a SQLite.
La implementación local de comparación es
[`src/clients/http/app.js`](../../../src/clients/http/app.js): conservar sus
contratos de usuarios sin copiar Express ni incorporar otro framework.

| Ruta                | Firma existente               | Respuesta       |
| ------------------- | ----------------------------- | --------------- |
| `POST /users`       | `createUser({ name, email })` | 201, usuario    |
| `GET /users`        | `listUsers()`                 | 200, lista      |
| `GET /users/:id`    | `findUserById(id)`            | 200, usuario    |
| `PATCH /users/:id`  | `updateUser(id, changes)`     | 200, usuario    |
| `DELETE /users/:id` | `deleteUser(id)`              | 204, sin cuerpo |

El identificador sigue siendo el texto de la ruta. PATCH incorpora a
`changes` únicamente los campos enviados. Los usuarios conservan `id`,
`name`, `email`, `createdAt` y `updatedAt`. No hay firmas de negocio nuevas
ni SQL nuevo: `queries` conserva sus consultas y parámetros nombrados;
el servidor SQL actual permanece en `http://127.0.0.1:3000/execute`.

## Estados y mensajes

Traducir los errores existentes a JSON `{ message }`, como el cliente HTTP
actual. Nombre vacío y email inválido devuelven 400; email duplicado, 409;
usuario inexistente al consultar, modificar o borrar, 404. Conservar
literalmente `Name is empty`, `Email is invalid`, `Email is already used`
y `User not found`, definidos en [ERRORS.md](../../ERRORS.md).

Cada fallo de operación devuelve 500 y su mensaje específico:
`Could not create the user`, `Could not list the users`,
`Could not find the user`, `Could not update the user` o
`Could not delete the user`. Crear sin nombre conserva el 500 actual.
Una ruta desconocida devuelve 404 vacío. No ampliar el contrato con nuevas
validaciones ni casos de transporte ajenos a las cinco operaciones.

## Cinco notebooks

Crear únicamente estos documentos en `src/clients/node-http/jupyter/`:

| Documento               | Recorrido y casos que debe documentar                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `create-user.ipynb`     | Ada y `ada@example.com`, 201; nombre vacío/email inválido 400, email duplicado 409, nombre omitido y SQL detenido 500 |
| `list-users.ipynb`      | Lista con Ada y lista vacía 200; SQL detenido 500                                                                     |
| `find-user-by-id.ipynb` | ID real de Ada 200; `999999` inexistente 404; SQL detenido 500                                                        |
| `update-user.ipynb`     | Cambiar nombre a Ada Lovelace conservando email, 200; errores 400/409/404 y SQL detenido 500                          |
| `delete-user.ipynb`     | Borrar el ID real, 204 sin contenido; inexistente 404 y SQL detenido 500                                              |

Recorrido online: crear, listar, consultar, modificar y borrar; ejecutar
las escrituras de forma secuencial y reutilizar el ID real antes del borrado.
Kernel `Python 3 (ipykernel)`, nombre `python3`. Cada notebook ejecuta Node
mediante `subprocess` y `node --input-type=module`; usa `fetch` contra
3004 y muestra el estado y el cuerpo de respuesta, incluido el cuerpo vacío
del borrado. No importa `logic` ni utiliza el servidor SQL directamente.
Reutilizar la presentación Python sin paquetes adicionales del cliente
[`src/clients/jupyter/`](../../../src/clients/jupyter/), conservando sus
nueve notebooks. Preparar los IDs con datos reales del ensayo, no asumir
que Ada recibe el ID 1. No guardar salidas inventadas o de otro recorrido.

## Archivos y comandos

Además del cliente y los cinco notebooks, modificar `package.json` para
añadir `node-http` con `node src/clients/node-http/app.js` y
`jupyter-node-http` con `sh scripts/jupyter-node-http.sh`. Crear ese script
para abrir la carpeta nueva con Notebook, desde la raíz de first-app
resuelta a partir del propio script. Conservar los scripts actuales y el
arranque documentado `python -m jupyterlab` con sus nueve notebooks.
Incluir el nuevo JavaScript en el alcance de
`format` sin retirar rutas actuales.

Actualizar [TREE.md](../../TREE.md) con el cliente, los cinco notebooks y
`scripts/jupyter-node-http.sh`, y
[ARCHITECTURE.md](../../ARCHITECTURE.md) con el flujo notebook → HTTP 3004
→ logic → queries → SQL actual. Ajustar [JUPYTER.md](../../JUPYTER.md)
para documentar desde PowerShell los dos comandos nuevos, el kernel y el
recorrido sin modificar el arranque del cliente Jupyter actual.

No cambiar dependencias Node ni lockfile: `node:http` y `fetch` son nativos.
Los notebooks conservan la presentación Python estándar existente.
La única instalación prevista es `notebook==7.6.3` dentro de `.venv` si
no está esa versión. No crear requirements ni añadir otros paquetes.
Notebook es Python y queda fuera de Socket para paquetes Node.
No es una función de negocio nueva: se mantienen los clientes de terminal.

## Arranque Notebook aprobado

El script POSIX detecta Windows por `uname -s` con MINGW, MSYS o CYGWIN,
o por `OS=Windows_NT`. Usa `.venv/Scripts/python.exe` en Windows y
`.venv/bin/python` en los demás sistemas. Reutiliza ese intérprete si
existe; si falta, crea `.venv` en first-app con Python 3. En Windows prueba
`python`, `py -3` y `python3`, en ese orden; fuera de Windows, `python3` y
`python`. Cada candidato debe confirmar versión mayor 3. Sin candidato
válido informa `Python 3 is required to start Jupyter.` y termina.

Comprueba `importlib.metadata.version('notebook') == '7.6.3'` usando el
Python del entorno. Si no coincide, comprueba pip, ejecuta
`ensurepip --upgrade` únicamente si falta y después instala
`notebook==7.6.3` con el pip del entorno. Propaga fallos de creación,
ensurepip, instalación y arranque. No reinstala si ya coincide.
Finalmente ejecuta `PYTHONUTF8=1 exec "$env_python" -m notebook
src/clients/node-http/jupyter`, conservando UTF-8 para la salida de Node.

Desde PowerShell, `pnpm jupyter-node-http` requiere el `sh` de Git Bash
instalado y disponible para scripts del proyecto. Documentar ese requisito
sin instalar ni configurar otra shell. La decisión aprobada resuelve el
Notebook nuevo sin reemplazar JupyterLab.

## Comprobación después de las aprobaciones

Verificar los cinco contratos y los mensajes anteriores en una copia de
ensayo sin SQLite personal. Ejecutar las cinco operaciones con SQL activo
y después sus cinco errores con SQL detenido, manteniendo el servidor
HTTP del ensayo. Confirmar PATCH parcial y DELETE vacío. Ejecutar los
notebooks con el kernel y el Notebook aprobados desde Windows, registrar
resultados propios y detener únicamente los procesos del ensayo.

Verificar el script con Windows y entorno ausente/existente, Notebook
ausente, distinto y fijado a 7.6.3, selección de Python, errores, UTF-8 y
carpeta abierta. Usar copias temporales para escenarios controlados, sin
alterar el entorno personal. Separar esos ensayos del arranque real.
Comprobar formato, lint, validez de los cinco JSON de notebook, scripts y
conservación de dependencias Node, clientes y datos. Ejecutar `pnpm format` y
`pnpm lint` al cierre de la implementación y revisar su diff. La revisión
de esta etapa sigue siendo estática; no se presentan ejecuciones nuevas.
Tras aprobar spec y plan, preparar tareas para otra revisión.

## Decisión y siguiente revisión

La persona aprobó spec y plan con el ajuste de arranque anterior: reutilizar
o crear `.venv` de first-app e instalar Notebook 7.6.3 allí si hace falta.
La duda sobre el entorno queda resuelta. Esta autorización permite editar
este plan y preparar `tasks.md` para revisión; todavía no permite ejecutar
el script, crear el entorno, instalar paquetes, implementar, commit ni push.
