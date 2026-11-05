# Socket: MCP remoto y alertas por versión

La conexión existente usa `https://mcp.socket.dev/` con OAuth. Consérvala sin modificar su configuración. La consulta PURL usa por separado la API de Socket y la variable de proceso `SOCKET_API_TOKEN`; el secreto permanece en memoria. Consulta las [reglas de paquetes](../AGENTS.md#paquetes) y la [constitución](CONSTITUTIONS.md#paquetes).

Obtén el slug de organización de la configuración vigente del proyecto y contrástalo con la herramienta `organizations` del MCP remoto. Si la selección no es inequívoca, confirma la organización antes de consultar. El ejemplo pide ese slug como parámetro de entrada; no deduce la organización del token.

## Consulta ejecutable en PowerShell

Abre PowerShell en la carpeta que contiene `package.json` y `pnpm-lock.yaml` y pega el bloque completo. Introduce el slug comprobado cuando se solicite. No introduzcas el token en el código: debe estar disponible en `SOCKET_API_TOKEN`.

El lector del lockfile cubre el formato actual de pnpm 9, importador raíz `.` y paquetes npm de `dependencies` y `devDependencies`. Contrasta los `specifier` con el manifiesto y toma las versiones resueltas del lockfile, retirando únicamente los sufijos de peers. Rechaza formatos distintos, alias, referencias locales y versiones no resueltas antes de hacer la petición. No instala herramientas ni modifica archivos.

```powershell
function Get-SocketDirectAlerts {
    param(
        [Parameter(Mandatory = $true)]
        [ValidatePattern('^[A-Za-z0-9_-]+$')]
        [string]$OrgSlug
    )
    $ErrorActionPreference = 'Stop'
    $manifest = Get-Content -LiteralPath './package.json' -Raw -Encoding UTF8 |
        ConvertFrom-Json
    $lock = Get-Content -LiteralPath './pnpm-lock.yaml' -Raw -Encoding UTF8
    if ($lock -notmatch "(?m)^lockfileVersion: ['`"]?9\.0['`"]?\r?$") {
        throw 'Se requiere el formato pnpm-lock.yaml 9.0 documentado.'
    }
    $root = [regex]::Match($lock, '(?ms)^  \.:\r?\n(.*?)(?=^  \S|^\S|\z)')
    if (-not $root.Success) { throw 'No se encuentra el importador raíz del lockfile.' }
    $components = @()
    foreach ($section in @('dependencies', 'devDependencies')) {
        $block = [regex]::Match($root.Groups[1].Value,
            "(?ms)^    ${section}:\r?\n(.*?)(?=^    \S|\z)")
        $entries = @{}
        if ($block.Success) {
            $pattern = '(?m)^      [''"\x22]?([^''"\x22\r\n]+?)[''"\x22]?:\r?\n' +
                '        specifier: (.+)\r?\n        version: (.+)\r?$'
            $entryMatches = [regex]::Matches($block.Groups[1].Value, $pattern)
            $remaining = [regex]::Replace($block.Groups[1].Value, $pattern, '').Trim()
            if ($remaining) { throw "Formato no soportado en $section del lockfile." }
            foreach ($entry in $entryMatches) {
                $name = $entry.Groups[1].Value
                if ($entries.ContainsKey($name)) { throw 'Entrada duplicada en el lockfile.' }
                $entries[$name] = @{
                    Specifier = $entry.Groups[2].Value.Trim().Trim([char]39, [char]34)
                    Version = $entry.Groups[3].Value.Trim().Trim([char]39, [char]34)
                }
            }
        }
        $declared = @()
        if ($null -ne $manifest.$section) {
            $declared = @($manifest.$section.PSObject.Properties)
        }
        if ($entries.Count -ne $declared.Count) { throw "Manifiesto y lockfile discrepan en $section." }
        foreach ($dependency in $declared) {
            $name = $dependency.Name
            $resolved = $entries[$name]
            if ($null -eq $resolved -or $resolved.Specifier -cne [string]$dependency.Value) {
                throw "Specifier desactualizado o ausente para $name."
            }
            if ($name -cnotmatch '^(?:@[a-z0-9._-]+/)?[a-z0-9._-]+$') {
                throw 'Nombre de paquete npm no soportado.'
            }
            $version = ($resolved.Version -split '\(', 2)[0]
            if ($version -notmatch '^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$') {
                throw "Versión npm no resuelta para $name."
            }
            $encodedName = (($name -split '/') | ForEach-Object {
                [Uri]::EscapeDataString($_)
            }) -join '/'
            $components += @{ purl = 'pkg:npm/' + $encodedName + '@' +
                [Uri]::EscapeDataString($version) }
        }
    }
    $components = @($components | Sort-Object { $_.purl } -Unique)
    if ($components.Count -eq 0 -or $components.Count -gt 1024) {
        throw 'La consulta requiere entre 1 y 1024 PURL directos.'
    }
    if ([string]::IsNullOrWhiteSpace($env:SOCKET_API_TOKEN)) {
        throw 'SOCKET_API_TOKEN no está disponible en el proceso.'
    }
    $headers = @{
        Authorization = 'Bearer ' + $env:SOCKET_API_TOKEN
        Accept = 'application/x-ndjson'
    }
    try {
        $uri = 'https://api.socket.dev/v0/orgs/' + $OrgSlug +
            '/purl?alerts=true&poll=false&summary=true'
        $response = Invoke-WebRequest -UseBasicParsing -Method Post -Uri $uri `
            -Headers $headers -ContentType 'application/json' `
            -Body (@{ components = $components } | ConvertTo-Json -Depth 5 -Compress) `
            -TimeoutSec 60
    } catch {
        $status = if ($null -ne $_.Exception.Response) {
            [int]$_.Exception.Response.StatusCode
        } else { 0 }
        if ($status -eq 401 -or $status -eq 403) {
            throw "Error de acceso HTTP $status; no hay conclusión sobre alertas."
        }
        if ($status -ne 0) { throw "Error HTTP $status; no hay conclusión sobre alertas." }
        throw 'Error de conexión; no hay conclusión sobre alertas.'
    } finally {
        $headers.Clear()
    }
    $content = if ($response.Content -is [byte[]]) {
        [Text.Encoding]::UTF8.GetString($response.Content)
    } else { [string]$response.Content }
    $records = @()
    try {
        foreach ($line in ($content -split '\r?\n')) {
            if ($line.Trim()) { $records += $line | ConvertFrom-Json }
        }
    } catch { throw 'Respuesta JSON no válida; no hay conclusión sobre alertas.' }
    $expected = @($components | ForEach-Object { $_.purl })
    $seen = @{}
    foreach ($record in $records) {
        if ($record._type -eq 'summary') {
            [pscustomobject]@{ Organizacion = $OrgSlug; Estado = 'resumen'; Datos = $record.value }
            continue
        }
        if ($record._type -or $record.purlError -or $record.error) {
            [pscustomobject]@{ Organizacion = $OrgSlug; Estado = 'error de resolución' }
            continue
        }
        $purl = [string]$record.inputPurl
        if ($expected -cnotcontains $purl) { throw 'Respuesta sin PURL esperado; revisar cobertura.' }
        $seen[$purl] = $true
        $alerts = @($record.alerts | Where-Object { $null -ne $_ })
        $types = @($alerts | ForEach-Object { $_.type })
        $state = if ($types -contains 'pendingScan') { 'pendingScan' }
            elseif ($types -contains 'notFound') { 'notFound' }
            elseif (-not $record.id -or -not $record.version -or
                $null -eq $record.PSObject.Properties['alerts']) { 'respuesta incompleta' }
            else { 'análisis completado' }
        $alertSummary = @($alerts | Group-Object type, severity, action | ForEach-Object {
            [pscustomobject]@{
                Tipo = $_.Group[0].type; Severidad = $_.Group[0].severity
                Accion = $_.Group[0].action; Cantidad = $_.Count
            }
        })
        [pscustomobject]@{
            Organizacion = $OrgSlug; Purl = $purl; Version = $record.version
            Estado = $state; TotalAlertas = $alerts.Count; Alertas = $alertSummary
        }
    }
    foreach ($purl in $expected) {
        if (-not $seen.ContainsKey($purl)) {
            [pscustomobject]@{ Organizacion = $OrgSlug; Purl = $purl; Estado = 'sin respuesta' }
        }
    }
}

$socketOrgSlug = Read-Host 'Slug de organización comprobado en configuración y organizations'
Get-SocketDirectAlerts -OrgSlug $socketOrgSlug | ConvertTo-Json -Depth 10
```

## Interpretar el resultado

La petición devuelve los datos disponibles con `poll=false`, incluidas alertas y un resumen de resolución. `análisis completado` puede contener alertas; revisa `Alertas` con sus tipos, severidades, cantidades y acciones. El resumen de PURL resueltos no demuestra que todos los análisis hayan terminado.

`pendingScan` indica análisis pendiente; `notFound`, versión no resuelta. Los errores de acceso, consulta o resolución, una respuesta incompleta y un PURL sin respuesta tampoco significan «sin alertas». La acción `ignore` refleja la política de la organización y no equivale a aceptación humana del riesgo. Esta consulta cubre paquetes directos; no acredita revisión de tres capas de dependencias ni campañas.

## Fuentes oficiales

- [MCP remoto y OAuth](https://docs.socket.dev/docs/remote-socket-mcp).
- [Autenticación de API](https://docs.socket.dev/reference/authentication).
- [PURL por organización, parámetros y estados](https://docs.socket.dev/reference/batchpackagefetchbyorg).
- [Formato PURL](https://docs.socket.dev/reference/socket-package-urls-purl).
