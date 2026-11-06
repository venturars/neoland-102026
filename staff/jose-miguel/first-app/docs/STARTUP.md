# Arranque de first-app

Guía para levantar la app cuando un cliente usa `src/logic/` y la base SQLite no se abre en el propio cliente.

## Por qué suelen ser dos terminales

La arquitectura separa **quién abre la base** de **quién muestra la interfaz**:

| Proceso | Comando | Puerto | Qué hace |
| --- | --- | --- | --- |
| Servidor SQL | `pnpm server` | `3000` | Único proceso que abre `src/db/users.sqlite`. Expone `POST /execute` para ejecutar SQL. |
| Cliente | `pnpm browser`, `pnpm http`, … | otro / ninguno | Llama a `src/logic/`. La logic usa `src/queries/`, que hace `fetch` al servidor SQL. |

Si **`pnpm server` no está en marcha**, la logic falla al hablar con la base (`ECONNREFUSED` o mensajes `Could not …`).

El browser y el cliente HTTP **no sustituyen** a `pnpm server`: no sirven la base ni ejecutan SQL directamente. Por eso el arranque habitual es:

1. **Primera terminal:** `pnpm server` (dejarla abierta).
2. **Segunda terminal:** el cliente que quieras probar.

Es el mismo motivo para browser y para HTTP: dos procesos Node distintos (puerto 3000 vs 3001), un solo dueño de SQLite.

## Puertos Node en first-app

Solo puede haber **un proceso por puerto**. Si repites el mismo comando en otra terminal, verás `EADDRINUSE` y un mensaje corto en consola.

| Puerto | Comando | Rol |
| --- | --- | --- |
| 3000 | `pnpm server` | Servidor SQL |
| 3001 | `pnpm http` | API Express (usuarios) |
| 3002 | `pnpm chrome` | API Fastify (extensión Chrome) |
| 3003 | `pnpm nest` | API Nest (usuarios) y Swagger UI en el navegador |
| 3004 | `pnpm node-http` | API node:http (usuarios) |

Electron, browser y terminal **no abren** estos puertos; solo necesitan `pnpm server` en 3000 cuando usan la base.

Para liberar un puerto en Windows: localiza la terminal donde corre el comando y **Ctrl+C**, o `netstat -ano | findstr :3000` (cambia el puerto), luego `taskkill /PID <pid> /F`.

## Clientes que necesitan `pnpm server`

| Cliente | Segundo comando | Notas |
| --- | --- | --- |
| Browser | `pnpm browser` | `file://` + módulos ES. Ver [`src/clients/browser/README.md`](../src/clients/browser/README.md). |
| HTTP (Express) | `pnpm http` | API en `http://127.0.0.1:3001`. Colección Bruno: `pnpm bruno` (lista vacía). Ver [`src/clients/http/README.md`](../src/clients/http/README.md). |
| Electron | `pnpm electron` | Ventana de escritorio. Ver [`src/clients/electron/README.md`](../src/clients/electron/README.md). |
| Chrome | `pnpm chrome` + extensión cargada | API en `http://127.0.0.1:3002` y popup MV3. Ver [`src/clients/chrome/README.md`](../src/clients/chrome/README.md). |
| VS Code | F5 desde `src/clients/vscode` | Panel lateral; ver [`src/clients/vscode/README.md`](../src/clients/vscode/README.md). |
| Nest | `pnpm nest` | API y Swagger UI en `http://127.0.0.1:3003`. Ver [`src/clients/nest/README.md`](../src/clients/nest/README.md). |
| node-http | `pnpm node-http` | API en `http://127.0.0.1:3004`. Jupyter: `pnpm jupyter-node-http`. Ver [`src/clients/node-http/README.md`](../src/clients/node-http/README.md). |
| Terminal / Jupyter | Pegar `.txt` o ejecutar notebook | Misma regla: servidor SQL antes. Directorio actual en `first-app`. |

## Pasos comunes

1. Abrir terminal en la raíz de **first-app** (`staff/jose-miguel/first-app`).

2. Instalar dependencias (solo la primera vez o tras cambiar `package.json`):

   ```text
   pnpm install
   ```

3. Arrancar el servidor SQL:

   ```text
   pnpm server
   ```

   Debe mostrar `http://127.0.0.1:3000`. No cierres esta terminal.

4. En **otra** terminal, desde la misma carpeta `first-app`, el cliente elegido (por ejemplo `pnpm browser` o `pnpm http`).

5. Parar el servidor SQL con **Ctrl+C** en la primera terminal cuando termines.

## Base de datos local

- Fichero: `src/db/users.sqlite` (no va en git).
- Esquema con `createdAt` y `updatedAt`. Si la base es antigua, borra el fichero y recrea tabla/usuarios (p. ej. `create-users-table.txt` con el servidor en marcha).

## Comandos sin segundo proceso

- **`pnpm jupyter`:** prepara `.venv` y abre notebooks; las celdas que llaman a logic **sí** necesitan `pnpm server` en paralelo si tocan la base.
- **Terminal:** un solo proceso Node al pegar un `.txt`, pero **con** `pnpm server` en otra terminal si el fragmento usa logic/queries.

Más contexto: [`docs/ARCHITECTURE.md`](ARCHITECTURE.md), [`docs/DATABASE.md`](DATABASE.md).
