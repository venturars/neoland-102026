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

## Clientes que necesitan `pnpm server`

| Cliente | Segundo comando | Notas |
| --- | --- | --- |
| Browser | `pnpm browser` | `file://` + módulos ES. Ver [`src/clients/browser/README.md`](../src/clients/browser/README.md). |
| HTTP (Express) | `pnpm http` | API en `http://127.0.0.1:3001`. Ver [`src/clients/http/README.md`](../src/clients/http/README.md). |
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
