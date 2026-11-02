[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Message,
    [Parameter(Mandatory = $true)][string[]]$Paths,
    [Parameter(Mandatory = $true)][string]$ExpectedBranch
)
. (Join-Path $PSScriptRoot 'git-common.ps1')
Assert-ExpectedBranch $ExpectedBranch
Assert-NoCommitHooks
if ($Message -notmatch '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?: .+' -or $Message.Contains("`n") -or $Message.Contains("`r")) {
    throw 'Usa un mensaje de commit convencional en inglés y de una sola línea.'
}
if ($Paths.Count -eq 0) {
    throw 'Indica al menos un archivo.'
}
$literalPaths = @()
$rootPrefix = $script:repositoryRoot.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
foreach ($file in $Paths) {
    if ([string]::IsNullOrWhiteSpace($file) -or $file.StartsWith('-') -or $file -match '[*?\[\]:]' -or $file -in @('.', '..')) {
        throw "Solo se admiten rutas explícitas relativas al repositorio: $file"
    }
    $absolutePath = [IO.Path]::GetFullPath((Join-Path $script:repositoryRoot $file))
    if (-not $absolutePath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        throw "La ruta sale del repositorio: $file"
    }
    $relativePath = $absolutePath.Substring($rootPrefix.Length).Replace('\', '/')
    if ($relativePath -match '(^|/)\.git(/|$)') {
        throw 'No se pueden incluir metadatos de Git.'
    }
    if (Test-Path -LiteralPath $absolutePath -PathType Container) {
        throw "No se admiten directorios: $file"
    }
    # Literal pathspecs protect filenames from Git glob/pathspec expansion.
    $literalPaths += ":(literal)$relativePath"
}
$temporaryIndex = Join-Path ([IO.Path]::GetTempPath()) ("git-index-" + [guid]::NewGuid().ToString('N'))
$previousIndex = [Environment]::GetEnvironmentVariable('GIT_INDEX_FILE', 'Process')
$originalHead = (Invoke-Git -Arguments @('rev-parse', 'HEAD')).Output[0]
try {
    $env:GIT_INDEX_FILE = $temporaryIndex
    $null = Invoke-Git -Arguments @('read-tree', 'HEAD')
    $null = Invoke-Git -Arguments (@('add', '--') + $literalPaths)
    $difference = Invoke-Git -Arguments @('diff', '--cached', '--quiet') -AllowFailure
    if ($difference.ExitCode -eq 0) {
        throw 'Los archivos indicados no tienen cambios para guardar.'
    }
    if ($difference.ExitCode -ne 1) {
        throw "No se puede comprobar el índice temporal: $($difference.ErrorText)"
    }
    # Existing active commit hooks were blocked for review before any mutation.
    $null = Invoke-Git -Arguments @('commit', '-m', $Message)
}
finally {
    [Environment]::SetEnvironmentVariable('GIT_INDEX_FILE', $previousIndex, 'Process')
    foreach ($temporaryPath in @($temporaryIndex, "$temporaryIndex.lock")) {
        if (Test-Path -LiteralPath $temporaryPath) {
            Remove-Item -LiteralPath $temporaryPath
        }
    }
}
# Align only named entries with the commit, without staging concurrent worktree changes.
$newHead = (Invoke-Git -Arguments @('rev-parse', 'HEAD')).Output[0]
if ($newHead -eq $originalHead) {
    throw 'Git no creó ningún commit.'
}
$null = Invoke-Git -Arguments (@('restore', '--source=HEAD', '--staged', '--') + $literalPaths)
Write-Output "Commit creado en $ExpectedBranch; archivos preparados ajenos conservados."
