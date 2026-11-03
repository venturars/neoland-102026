Issue: #757

# Plan del servidor SQL

Estado: implementación local y comprobaciones registradas en [verification.md](verification.md); pendiente revisión humana. Esta pasada solo documenta el resultado y el inventario, sin modificar o ejecutar código, datos o recursos remotos.

## Alcance de la entrega

Servidor SQL local, queries asíncronas y clientes de terminal y Jupyter que comparten logic y SQLite. El cliente del navegador corresponde a la segunda entrega; las reglas de negocio existentes se conservan.
Todas las rutas siguientes son relativas a first-app. Primera entrega coordinada por #757 y la PR #758 existente; no se cambian sus metadatos ni se publica durante esta revisión.

## Inventario de la primera entrega

| Archivo o componente | Resultado local y estado |
| --- | --- |
| `src/db/server.js` | Presente; servidor SQL local y propietario de SQLite. |
| `src/queries/users.js` | Presente; nueve funciones asíncronas y acceso al servidor, sin readFile ni SQLite. |
| `src/queries/queries/{create-users-table,find-all,find-by-email,find-by-id,find-by-name,insert,list-tables,remove,update}.js` | Nueve módulos presentes, con constantes SQL exportadas y parámetros nombrados. |
| `src/logic/{create-user,delete-user,find-user-by-email,find-user-by-id,find-user-by-name,list-users,update-user,users-gender-count}.js` | Ocho módulos presentes; reglas y resultados conservados, con await. |
| Clientes terminal y Jupyter | Nueve archivos por formato, .txt e .ipynb; presentes, con comandos Windows y resultados asíncronos. Clasificación ya era asíncrona. |
| `package.json`, `docs/{ARCHITECTURE,DATABASE,TREE}.md` | Script server y guías presentes; dependencias y versiones conservadas. |
| `docs/specs/host-sql-on-node-server/{spec,plan,tasks}.md` | Alcance, plan y tareas; verification.md registra la evidencia de esta implementación. |

Los nueve clientes por formato se denominan `create-user`, `create-users-table`, `delete-user`, `find-user-by-email`, `find-user-by-id`, `find-user-by-name`, `list-users`, `update-user` y `users-gender-count`.
Las constantes son CREATE_USERS_TABLE, FIND_ALL, FIND_BY_EMAIL, FIND_BY_ID, FIND_BY_NAME, INSERT_USER, LIST_TABLES, REMOVE_USER y UPDATE_USER. `findUserByName` tiene nombre singular y devuelve un array de coincidencias exactas ordenadas.

## Comunicación y contratos

Cliente terminal/Jupyter → import directo de logic → queries → HTTP/JSON `POST http://127.0.0.1:3000/execute` → servidor SQL → `src/db/users.sqlite`. No hay API entre cliente y logic; sí interfaz HTTP de datos. Para la persistencia de usuarios, HTTP queda en queries; la clasificación conserva su comunicación independiente con Ollama.
Payload `{ method, sql, params }`; exec → `{ ok: true }`, get → `{ row }`, all → `{ rows }`, run → `{ changes }`. Fila ausente: null. SQL con parámetros :id, :name y :email; sin lista permitida adicional de sentencias. CORS *; OPTIONS 204 para POST/content-type; ruta o método desconocido 404, JSON/SQL inválido 500. Queries convierte fallo HTTP en Query failed y logic conserva el mensaje de operación.
Logic espera las consultas. createUser(input), updateUser(id, changes), deleteUser(id), listUsers() y consultas conservan sus entradas; usuario limpio `{ id, name, email, createdAt, updatedAt }`, listas arrays y borrado sin valor. usersGenderCount espera findAll y conserva su contrato. Terminal y Jupyter esperan resultados con await, también createUsersTable/listTables, sin abrir SQLite directamente.

## Inventario de rutas fuera del resultado

| Rutas locales | Estado comprobado y resultado esperado |
| --- | --- |
| `src/clients/http/{create-user-client-server,start-user-client}.js` | Ambos ausentes; sin servidor de usuarios o HTML en esta entrega. |
| `src/clients/web/{app.js,index.html,styles.css}` | Los tres ausentes; no se incorporan a la primera entrega. |
| `src/db/connection.js` y `src/queries/queries/{create-users-table,find-all,find-by-email,find-by-id,find-by-name,insert,remove,update}.sql` | Ausentes; el propietario de SQLite es db/server.js y las consultas son los nueve .js del inventario. |
| `src/logic/find-users-by-name.js`, `src/clients/terminal/find-users-by-name.txt`, `src/clients/jupyter/find-users-by-name.ipynb` | Rutas plurales ausentes; los tres nombres singulares del inventario están presentes. |
| `tests/vanilla-user-client.test.js`, `docs/VANILLA-CLIENT.md` y `docs/specs/vanilla-user-client/{spec,plan,tasks,verification}.md` | Ausentes; no pertenecen al alcance del servidor SQL ni del cliente del navegador previsto. |

Este inventario distingue ausencia ya comprobada de acciones pendientes: no se retira, renombra o limpia ningún archivo en esta revisión documental. La segunda entrega solo incorpora los archivos browser descritos en su propio plan.

## Datos, Windows y documentación

El servidor usa DatabaseSync y abre o crea el archivo `src/db/users.sqlite` si falta; no crea el esquema automáticamente. La tabla se prepara con createUsersTable y se comprueba mediante listTables. Preservar base y auxiliares, no mover una base en uso ni ejecutar migración automática. Ensayos siempre en una copia desechable; clientes comparten la base del servidor.
`server` ejecuta `node src/db/server.js`; no cambia nombre o ubicación por Windows. Los .txt usan PowerShell y Node ESM, los notebooks Python/subprocess; se conservan extensiones y presentación sin añadir bibliotecas.
Comprobación local en lectura: Node v24.22.0 en `C:/Program Files/nodejs/node.exe`; pnpm no detectado en PATH ni en Program Files/nodejs/pnpm.cmd; Corepack presente, sin activar. No instalar ni habilitar herramientas por inferencia. Brave se comprueba en el plan del navegador.
Referencias operativas: package.json, AGENTS.md, DATABASE.md, JUPYTER.md, ARCHITECTURE.md y TREE.md deben corresponder a este inventario y al arranque del servidor; no se altera la automatización de Git.

## Verificación y separación

La evidencia funcional ya registrada pertenece a la implementación local; esta revisión no ejecuta pruebas nuevas. Mantener comprobaciones de protocolo, nueve módulos SQL, await, conservación de reglas, terminal/Jupyter sobre el mismo SQLite ficticio y datos personales intactos. No atribuir ejecución de IA a su revisión estática.
La primera PR contiene solo esta entrega contra staging. La segunda se prepara después de su integración por una persona y desde staging actualizado. No se autoriza merge, commit, push, instalación ni cambios en otras ramas en esta fase documental.
