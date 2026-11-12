# Probar personas con Bruno

La colección vive en `src/clients/rest/bruno`. Habla con `http://127.0.0.1:3001`.

El ensayo usa una copia. No se para la base del puerto 3000 y no se copia `users.sqlite`. Si el puerto 3001 o el 43100 están ocupados, el ensayo no arranca.

Las dos carpetas no se lanzan juntas. Primero `01-sql-online`, con la lista vacía. Después se para solo el SQL del ensayo y se lanza `02-sql-offline`.

## Mac

Desde `first-app`:

```sh
app=$(pwd)
for port in 43100 3001; do
  if nc -z 127.0.0.1 "$port"; then
    echo "El puerto $port está ocupado."
    exit 1
  fi
done
fixture=$(mktemp -d "${TMPDIR:-/tmp}/first-app-rest.XXXXXX")
mkdir -p "$fixture/src/db" "$fixture/src/queries" "$fixture/src/logic" "$fixture/src/clients/rest"
cp src/db/connection.js src/db/server.js "$fixture/src/db/"
cp src/queries/users.js src/queries/users-sql.js "$fixture/src/queries/"
cp src/logic/*.js "$fixture/src/logic/"
cp src/clients/rest/server.js "$fixture/src/clients/rest/"
printf '%s\n' '{"type":"module"}' > "$fixture/package.json"
ln -s "$app/node_modules" "$fixture/node_modules"
perl -pi -e 's/const port = 3000/const port = 43100/' "$fixture/src/db/server.js"
perl -pi -e 's#http://127.0.0.1:3000#http://127.0.0.1:43100#' "$fixture/src/queries/users.js"
echo "Copia de ensayo: $fixture"
cd "$fixture"
node src/db/server.js
```

En otra terminal, en esa copia:

```sh
cd "COPIA"
node --input-type=module <<'EOF'
import { createUsersTable } from "./src/queries/users.js";
console.log(await createUsersTable());
EOF
node src/clients/rest/server.js
```

El SQL del ensayo escucha en `127.0.0.1:43100`. El programa JSON escribe `REST API: http://127.0.0.1:3001`.

Desde `first-app`, con la lista vacía:

```sh
npm run bruno
```

Para la carpeta sin SQL, para solo el proceso `node src/db/server.js` de la copia. Deja el programa JSON abierto. Desde `src/clients/rest/bruno`:

```sh
../../../../node_modules/.bin/bru run 02-sql-offline -r
```

Luego para el programa JSON de la copia.

En VS Code, abre `src/clients/rest/bruno` como colección. Lanza solo `01-sql-online`. Después para el SQL del ensayo y lanza solo `02-sql-offline`.

## Windows

Abre PowerShell en `first-app`. No pares el proceso del puerto 3000.

```powershell
$app = (Get-Location).Path
foreach ($port in @(43100, 3001)) {
  $listener = [System.Net.Sockets.TcpListener]::new(
    [System.Net.IPAddress]::Loopback, $port)
  try { $listener.Start() }
  catch { throw "El puerto $port está ocupado." }
  finally { $listener.Stop() }
}
$fixture = Join-Path $env:TEMP ("first-app-rest-" + [guid]::NewGuid().ToString("N"))
foreach ($relative in @("db", "queries", "logic", "clients/rest")) {
  New-Item -ItemType Directory -Path (Join-Path $fixture ("src/" + $relative)) -Force | Out-Null
}
Copy-Item "$app/src/db/connection.js","$app/src/db/server.js" (Join-Path $fixture "src/db")
Copy-Item "$app/src/queries/users.js","$app/src/queries/users-sql.js" (Join-Path $fixture "src/queries")
Copy-Item "$app/src/logic/*.js" (Join-Path $fixture "src/logic")
Copy-Item "$app/src/clients/rest/server.js" (Join-Path $fixture "src/clients/rest")
Set-Content -Path (Join-Path $fixture "package.json") -Value '{"type":"module"}' -Encoding utf8
New-Item -ItemType Junction -Path (Join-Path $fixture "node_modules") -Target (Join-Path $app "node_modules") | Out-Null
$utf8 = [System.Text.UTF8Encoding]::new($false)
foreach ($relative in @("src/db/server.js", "src/queries/users.js")) {
  $file = Join-Path $fixture $relative
  $source = [System.IO.File]::ReadAllText($file)
  $source = $source.Replace("const port = 3000", "const port = 43100")
  $source = $source.Replace("http://127.0.0.1:3000", "http://127.0.0.1:43100")
  [System.IO.File]::WriteAllText($file, $source, $utf8)
}
Write-Output "Copia de ensayo: $fixture"
Set-Location $fixture
node src/db/server.js
```

En otra terminal de PowerShell, en esa copia:

```powershell
Set-Location "COPIA"
$script = @'
import { createUsersTable } from "./src/queries/users.js";
console.log(await createUsersTable());
'@
$script | node --input-type=module
node src/clients/rest/server.js
```

Desde `first-app`:

```powershell
npm run bruno
```

Para la carpeta sin SQL, para solo el SQL de la copia con Ctrl+C. Deja el programa JSON abierto. Desde `src/clients/rest/bruno`:

```powershell
..\..\..\..\node_modules\.bin\bru run 02-sql-offline -r
```

En VS Code se hace igual que en el Mac: primero las 15 peticiones de `01-sql-online`, después las 5 de `02-sql-offline`.
