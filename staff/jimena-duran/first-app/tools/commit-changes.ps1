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
    throw 'Use a one-line conventional commit message in English.'
}
if ($Paths.Count -eq 0) {
    throw 'Name at least one file.'
}
$literalPaths = @()
$rootPrefix = $script:repositoryRoot.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
foreach ($file in $Paths) {
    if ([string]::IsNullOrWhiteSpace($file) -or $file.StartsWith('-') -or $file -match '[*?\[\]:]' -or $file -in @('.', '..')) {
        throw "Only explicit repository-relative file paths are accepted: $file"
    }
    $absolutePath = [IO.Path]::GetFullPath((Join-Path $script:repositoryRoot $file))
    if (-not $absolutePath.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Path escapes the repository: $file"
    }
    $relativePath = $absolutePath.Substring($rootPrefix.Length).Replace('\', '/')
    if ($relativePath -match '(^|/)\.git(/|$)') {
        throw 'Git metadata cannot be committed.'
    }
    if (Test-Path -LiteralPath $absolutePath -PathType Container) {
        throw "Directories are not accepted: $file"
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
        throw 'The named files have no changes to commit.'
    }
    if ($difference.ExitCode -ne 1) {
        throw "Cannot inspect the temporary index: $($difference.ErrorText)"
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
    throw 'Git did not create a commit.'
}
$null = Invoke-Git -Arguments (@('restore', '--source=HEAD', '--staged', '--') + $literalPaths)
Write-Output "Commit created on $ExpectedBranch; unrelated staged files preserved."
