Issue: #832

# Plan del cliente del navegador

Estado: spec y plan recuperados y revisados; tareas preparadas para revisión. Implementación y pruebas funcionales pendientes.

## Base y alcance

El cliente del navegador utiliza la persistencia del servidor SQL y las funciones asíncronas de logic compartidas con terminal y Jupyter. Permite seleccionar, modificar y eliminar usuarios existentes.
Todas las rutas son relativas a first-app. Mantener los contratos, reglas, nombres, extensiones y tipos descritos en este plan, sin añadir funciones de negocio.

## Inventario de ambas entregas

| Archivo o componente | Resultado local previsto y estado |
| --- | --- |
| `src/db/server.js`, `src/queries/users.js` y nueve módulos SQL .js | Presentes como primera entrega; inventario completo en [plan del servidor](../host-sql-on-node-server/plan.md). No se duplican en esta PR. |
| Ocho módulos logic y nueve clientes por formato | Presentes, asíncronos y compartidos. No se crean versiones exclusivas para navegador. |
| `src/clients/browser/index.html` | Pendiente; documento local de tres pantallas. |
| `src/clients/browser/app.js` | Pendiente; imports directos a logic. |
| `src/clients/browser/styles.css` | Pendiente; presentación del cliente. |
| `package.json` | Script browser pendiente, lanzamiento con PowerShell; server conserva el arranque del servidor SQL. |
| `docs/ARCHITECTURE.md`, `docs/TREE.md` | Pendientes de reflejar browser y su relación con logic, sin servidor de HTML. |
| `docs/specs/browser-client/{spec,plan,tasks}.md` | Spec y plan revisados; tasks preparado con acciones pendientes de aprobación. |

Los tres archivos browser no existen todavía. Las rutas http/web, conexión directa, SQL .sql, nombres plurales y documentos ajenos al inventario final se detallan como ya ausentes en el plan de la primera entrega. No se repite su retirada ni se renombra un archivo por usar Windows.

## Importaciones, datos y comportamiento

index.html usa script de tipo module; app.js importa directamente `../../logic/list-users.js`, `update-user.js` y `delete-user.js`. No importa SDK, fs, SQLite o queries por una vía propia ni llama a una API de operaciones de usuarios.
Flujo de persistencia: navegador → imports de logic → queries → fetch HTTP/JSON `http://127.0.0.1:3000/execute` → servidor SQL → users.sqlite. HTTP para datos queda en queries, no en el cliente o entre cliente y logic. La interfaz /execute existe y no se presenta como ausencia total de API.
Queries conserva `{ method, sql, params }`, exec/get/all/run, respuestas `{ ok }`, `{ row }` (null si falta), `{ rows }` y `{ changes }`, parámetros nombrados, CORS * y OPTIONS. No se añade API CRUD de usuarios, servidor de HTML ni reglas de negocio nuevas.
El navegador abre index.html como archivo local; Node solo ejecuta el servidor de datos. Jupyter utiliza los mismos imports de logic y el mismo servidor; no llama al navegador ni se requiere incrustar la web en el notebook.
listUsers devuelve un array ordenado de usuarios limpios. La selección conserva la fila elegida en memoria. updateUser(id, { name, email }) devuelve usuario limpio y actualiza menú y campos sin salir de edición. deleteUser(id) resuelve sin valor, borra selección y refresca listado.
Campos del usuario: `id, name, email, createdAt, updatedAt`. No hay tipos o firmas nuevas. La pantalla toma nombre/correo de la fila seleccionada, sin buscador o consulta web independiente. No se importa usersGenderCount porque depende de OpenAI.
Notas permanece desactivado. Eliminar no pide confirmación ni frase; no hay alta web. Los textos se asignan como texto o valores de controles; errores se muestran en la pantalla correspondiente, sin mensajes nuevos.
Las pantallas muestran texto en español y el código utiliza nombres en inglés. Este cliente reutiliza operaciones existentes: no añade funciones de negocio, firmas, SQL, mensajes ni un cliente terminal nuevo.
Guardar conserva las reglas de recorte, normalización, longitud y unicidad en logic. Fallos usan Name is empty, Email is invalid, Email is already used, User not found y el Could not ... de listar/modificar/eliminar; no se trasladan validaciones a otra capa.

## Windows: única adaptación de lanzamiento

Conservar nombres `server`, `browser`, carpeta browser y extensiones .js/.html/.css. El script server es `node src/db/server.js`. El script browser de package.json usa PowerShell para abrir Brave con perfil aislado y `--allow-file-access-from-files`, apuntando al archivo index.html, sin servir HTML.
El comando de lanzamiento usa el ejecutable de Brave en Windows y un perfil aislado first-app-brave en el directorio temporal de Windows. Construir la URI file absoluta desde la ruta resuelta y pasar argumentos separados para respetar espacios y caracteres. No añadir helper ni renombrar app.js o el servidor por el sistema operativo.
Comprobación en lectura: Node v24.22.0 localizado en `C:/Program Files/nodejs/node.exe`. Brave no detectado en PATH ni en Program Files, Program Files (x86) o LocalAppData/BraveSoftware habituales, ni en los App Paths consultados. pnpm no detectado en PATH ni en Program Files/nodejs/pnpm.cmd o rutas habituales de usuario; Corepack presente, sin activar. No se afirma ausencia de instalaciones en otra ubicación.
Antes de ejecutar, localizar el Brave y pnpm que ya existan. Si no están disponibles, informar y acordar preparación; no instalar, activar Corepack, descargar dependencias, cambiar navegador o lanzar un perfil habitual por inferencia. No se añade paquete ni se activa revisión de dependencias nuevas.

## SQLite y comprobaciones previstas

Preservar base y auxiliares. DatabaseSync puede crear el archivo si falta, pero no prepara el esquema. El cliente técnico crea la tabla y lista tablas; esta interfaz no inicializa ni migra datos. Para comprobar, usar una única copia desechable con usuarios ficticios y servidor propio, compartida por navegador y Jupyter.
Revisar inventario y lanzamiento en Windows; imports de navegador libres de dependencias Node y llamadas de persistencia solo en queries. Recorrer las tres pantallas, listado vacío, selección, guardado que permanece en edición, vuelta sin guardar y borrado inmediato, con otros usuarios intactos.
Comprobar errores de negocio y servidor no disponible, await y tipos de resultados. Reejecutar listados Jupyter tras acciones del navegador y refrescar el navegador tras acciones Jupyter; no inferir validación desde salidas guardadas. Notas desactivado, sin creación ni frase.
Registrar comandos, ruta real del navegador, perfil aislado, pruebas y límites efectivamente ejecutados; cerrar solo procesos propios. Esta revisión documental no ejecuta esos pasos ni atribuye validación al browser.
No repetir las pruebas del servidor SQL ya satisfactorias mientras su código permanezca intacto y no aparezca una dependencia que lo justifique. Las comprobaciones nuevas recorren el navegador y su interoperabilidad con Jupyter. El formato debe cubrir también los tres archivos browser, fuera del alcance actual de pnpm format; comprobar ESLint sin cambiar reglas ni dependencias.

## Coordinación y autorización

La entrega del servidor SQL está integrada en staging. La issue #832 y la rama 832-feat-browser-client coordinan este cliente, con una PR draft contra staging para revisar la documentación. La autorización actual alcanza preparar spec, plan y tareas; detenerse en la revisión de tareas antes de implementar. Sin merge automático ni cambios en otras entregas.
