# Probar con Bruno en VS Code — Windows

Issue: #849.

Estado: Express 5.3.0 instalado y colección ejecutada en Bruno 6.0.0 dentro
de VS Code: 30 peticiones pasadas, 0 fallidas. La aceptación explícita del
riesgo residual y de las campañas no verificadas consta en el plan.

## Instalación ya realizada

Abre una terminal PowerShell en la carpeta `first-app`. Corepack y las
herramientas de formato y lint ya están instalados. No instales Bruno CLI ni
otros paquetes. La extensión Bruno de VS Code ya está instalada.

```powershell
$app = (Get-Location).Path
$repo = git rev-parse --show-toplevel
& "$env:ProgramFiles/nodejs/corepack.cmd" pnpm install --frozen-lockfile --ignore-scripts
```

El comando anterior ya se ejecutó correctamente. No hace falta repetirlo.
El lockfile conserva su hash; las 54 versiones instaladas hasta tres capas
coinciden con las revisadas. No se repitieron las consultas Socket.

Para usar la aplicación con sus datos habituales, los comandos son
`pnpm server` y, en otra terminal de `first-app`, `pnpm http`. Esa ejecución
usa SQLite personal; no es el ensayo ficticio de esta colección.

## SQLite ficticio para las pruebas

Las peticiones de la colección crean, modifican y borran exclusivamente
usuarios de una copia de ensayo. No deben enviarse al servidor personal.
El ensayo usa 43100 para SQL y 3001 para Express. El SQL del proyecto
conserva 3000 y su proceso existente no se detiene. Solo las copias de
servidor y queries de ensayo usan 43100.

Para preparar una copia de ensayo nueva, abre PowerShell en first-app:

```powershell
$app = (Get-Location).Path
foreach ($port in @(43100, 3001)) {
  $listener = [System.Net.Sockets.TcpListener]::new(
    [System.Net.IPAddress]::Loopback, $port)
  try { $listener.Start() }
  catch { throw "El puerto de ensayo $port está ocupado." }
  finally { $listener.Stop() }
}
$fixture = Join-Path $env:TEMP ('first-app-rest-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $fixture | Out-Null
foreach ($relative in @('logic', 'queries', 'queries/queries', 'clients/http')) {
  $source = Join-Path $app ('src/' + $relative)
  $destination = Join-Path $fixture ('src/' + $relative)
  New-Item -ItemType Directory -Path $destination -Force | Out-Null
  Get-ChildItem -LiteralPath $source -File -Filter '*.js' |
    Copy-Item -Destination $destination
}
New-Item -ItemType Directory -Path (Join-Path $fixture 'src/db') | Out-Null
Copy-Item -LiteralPath (Join-Path $app 'src/db/server.js') -Destination (Join-Path $fixture 'src/db/server.js')
$utf8 = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText((Join-Path $fixture 'package.json'), '{"type":"module"}', $utf8)
foreach ($relative in @('src/db/server.js', 'src/queries/users.js')) {
  $file = Join-Path $fixture $relative
  $source = [System.IO.File]::ReadAllText($file)
  $source = $source.Replace('http://127.0.0.1:3000', 'http://127.0.0.1:43100')
  [System.IO.File]::WriteAllText($file, $source, $utf8)
}
New-Item -ItemType Junction -Path (Join-Path $fixture 'node_modules') -Target (Join-Path $app 'node_modules') | Out-Null
Write-Output "Copia de ensayo: $fixture"
Set-Location $fixture
node src/db/server.js
```

El bloque copia solo JavaScript, no SQLite personal, y reutiliza node_modules
mediante una junction. Cada ensayo usa una carpeta temporal nueva; no crea
un worktree ni instala nada. La adaptación a 43100 afecta solo a las copias
temporales del servidor y queries.

Abre una segunda terminal. Copia la ruta que mostró el bloque anterior:

```powershell
Set-Location '<ruta de la copia de ensayo mostrada>'
$script = @'
import { createUsersTable, listTables } from "./src/queries/users.js";
await createUsersTable();
console.log(await listTables());
'@
$script | node --input-type=module
node src/clients/http/app.js
```

El SQL de ensayo escucha en `127.0.0.1:43100`; el cliente muestra
`http://127.0.0.1:3001`. La base se crea dentro de la copia de ensayo.

## Ejecutar en VS Code

1. Abre `docs/specs/express-rest-client/bruno` dentro de first-app como
   carpeta en VS Code. En **Bruno Collections**, busca la colección y usa
   su menú **Run Collection**. También puedes abrirla con **Open Collection**.
2. En el runner, activa **Configure requests to run**, selecciona las 25
   peticiones de `01-sql-online` y pulsa **Run 25 Selected Requests**.
   No ejecutes las dos carpetas juntas. La primera exige una lista vacía.
   Usa el árbol propio de Bruno: el acceso desde el explorador abrió
   Folder Runner pero devolvió Folder not found en el ensayo.
3. Crear Ada guarda `userId` y `createdAt`; crear Grace guarda `otherId` y
   `otherUser`. Las siguientes peticiones reutilizan esas variables.
4. Comprueba crear 201, listar/ver/modificar 200 y borrar 204 vacío. Los
   usuarios tienen `id`, `name`, `email`, `createdAt` y `updatedAt`.
5. Modificar solo nombre conserva email; modificar solo email conserva
   nombre. Se comprueban también ambos campos, campos omitidos y la
   conservación de Grace después de modificar y borrar Ada.
6. Las peticiones de error comprueban 400 `Name is empty`, 400
   `Email is invalid`, 409 `Email is already used` y 404 `User not found`.
   Incluyen crear y modificar, y ver/modificar/borrar un id inexistente.
7. Crear sin nombre comprueba 500 `Could not create the user`. Una ruta
   desconocida devuelve 404 vacío. Al final se borran solo los dos usuarios
   ficticios y se comprueba la lista vacía.
8. Detén **solo el SQL de la terminal de ensayo** con Ctrl+C, manteniendo
   abierto el cliente HTTP. En el runner pulsa **Reset**, activa
   **Configure requests to run** y selecciona solo las cinco peticiones
   de `02-sql-offline`. Pulsa **Run 5 Selected Requests**: esperan 500 y el
   mensaje `Could not ...` de cada operación.
9. Detén el cliente de ensayo con Ctrl+C. Para repetir la carpeta online,
   arranca otra vez SQL y HTTP con esa base de ensayo vacía.

Son 30 peticiones: 25 con SQL disponible y 5 sin SQL. Se enviaron realmente
desde el runner de Bruno dentro de VS Code, con todos sus tests pasados.
El ensayo HTTP adicional con Node se registra por separado en verification.md.
