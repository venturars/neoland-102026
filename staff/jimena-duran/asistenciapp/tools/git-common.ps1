# Shared native-command and repository checks for Windows PowerShell 5.1.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Git no está disponible. Localiza primero su instalación existente.'
}
$script:repositoryRoot = $null

function Invoke-Git {
    param([Parameter(Mandatory = $true)][string[]]$Arguments, [switch]$AllowFailure)
    $errorFile = [IO.Path]::GetTempFileName()
    $previousPreference = $ErrorActionPreference
    try {
        $commandArguments = @()
        if ($script:repositoryRoot) {
            $commandArguments += @('-C', $script:repositoryRoot)
        }
        $commandArguments += $Arguments
        $ErrorActionPreference = 'Continue'
        $output = @(& git @commandArguments 2> $errorFile)
        $code = $LASTEXITCODE
        $ErrorActionPreference = $previousPreference
        $errorText = [IO.File]::ReadAllText($errorFile)
        if ($code -ne 0 -and -not $AllowFailure) {
            throw "Git falló ($code): git $($Arguments -join ' ')`n$errorText"
        }
        if ($code -eq 0 -and $errorText) {
            Write-Verbose $errorText
        }
        return [pscustomobject]@{ Output = $output; ExitCode = $code; ErrorText = $errorText }
    }
    finally {
        $ErrorActionPreference = $previousPreference
        Remove-Item -LiteralPath $errorFile -ErrorAction SilentlyContinue
    }
}

$rootResult = Invoke-Git -Arguments @('-C', $PSScriptRoot, 'rev-parse', '--show-toplevel')
$script:repositoryRoot = [IO.Path]::GetFullPath([string]$rootResult.Output[0])

function Get-CurrentBranch {
    $result = Invoke-Git -Arguments @('symbolic-ref', '--quiet', '--short', 'HEAD') -AllowFailure
    if ($result.ExitCode -ne 0) {
        throw 'HEAD separado no está permitido. Selecciona primero una rama autorizada.'
    }
    return [string]$result.Output[0]
}

function Assert-NoGitOperation {
    $directoryResult = Invoke-Git -Arguments @('rev-parse', '--absolute-git-dir')
    $gitDirectory = [string]$directoryResult.Output[0]
    foreach ($marker in @('MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply', 'BISECT_LOG')) {
        $markerPath = Join-Path $gitDirectory $marker
        if (Test-Path -LiteralPath $markerPath) {
            throw "Operación Git en curso ($marker). Informa antes de resolverla."
        }
    }
    $unmerged = Invoke-Git -Arguments @('ls-files', '--unmerged')
    if ($unmerged.Output.Count -gt 0) {
        throw 'Hay archivos con conflictos. Informa antes de resolverlos.'
    }
}

function Assert-CleanWorktree {
    Assert-NoGitOperation
    # Untracked files are not dirty tracked work. Git checks target collisions
    # during switch/merge; --no-overwrite-ignore also protects ignored files.
    $status = Invoke-Git -Arguments @('status', '--porcelain=v1', '--untracked-files=no')
    if ($status.Output.Count -gt 0) {
        throw 'Hay cambios versionados. Consérvalos e informa antes de cambiar o actualizar ramas.'
    }
}

function Assert-ExpectedBranch {
    param([Parameter(Mandatory = $true)][string]$ExpectedBranch)
    Assert-NoGitOperation
    $currentBranch = Get-CurrentBranch
    if ($currentBranch -in @('main', 'staging')) {
        throw "Commit y publicación están bloqueados en $currentBranch."
    }
    if ($currentBranch -cne $ExpectedBranch) {
        throw "Se esperaba la rama '$ExpectedBranch', se encontró '$currentBranch'."
    }
}

function Assert-NoCommitHooks {
    # Hooks are executable project/user code and may add unrelated files or data.
    # Stop for human review instead of disabling hooks or running them silently.
    $configured = Invoke-Git -Arguments @('config', '--path', '--get', 'core.hooksPath') -AllowFailure
    if ($configured.ExitCode -eq 0) {
        $hooksPath = [string]$configured.Output[0]
    }
    elseif ($configured.ExitCode -eq 1) {
        $hooksPath = [string](Invoke-Git -Arguments @('rev-parse', '--git-path', 'hooks')).Output[0]
    }
    else {
        throw "No se pueden comprobar los hooks de Git: $($configured.ErrorText)"
    }
    if (-not [IO.Path]::IsPathRooted($hooksPath)) {
        $hooksPath = Join-Path $script:repositoryRoot $hooksPath
    }
    foreach ($hookName in @('pre-commit', 'prepare-commit-msg', 'commit-msg', 'post-commit', 'post-index-change', 'reference-transaction')) {
        if (Test-Path -LiteralPath (Join-Path $hooksPath $hookName)) {
            throw "El hook '$hookName' requiere revisión antes de un commit automático. No se desactivó ni ejecutó."
        }
    }
}

function Test-GitRef {
    param([Parameter(Mandatory = $true)][string]$Reference)
    $result = Invoke-Git -Arguments @('show-ref', '--verify', '--quiet', $Reference) -AllowFailure
    if ($result.ExitCode -notin @(0, 1)) {
        throw "No se puede comprobar la referencia $Reference. $($result.ErrorText)"
    }
    return $result.ExitCode -eq 0
}

function Get-TaskBranchName {
    param([string]$Issue, [string]$Type, [string]$Description, [string]$BranchName)
    if ($Issue -notmatch '^[1-9][0-9]*$') {
        throw 'La issue debe tener un número entero positivo.'
    }
    if ($Description -cnotmatch '^[a-z0-9]+(-[a-z0-9]+)*$') {
        throw 'La descripción debe estar en minúsculas con guiones.'
    }
    $taskBranch = "$Issue-$Type-$Description"
    if ($BranchName) {
        $taskBranch = $BranchName
    }
    if ($taskBranch.StartsWith('-') -or $taskBranch -in @('main', 'staging', 'HEAD')) {
        throw 'Nombre de rama no permitido.'
    }
    $null = Invoke-Git -Arguments @('check-ref-format', '--branch', $taskBranch)
    return $taskBranch
}
