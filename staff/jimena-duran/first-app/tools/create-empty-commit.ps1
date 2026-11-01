[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][ValidatePattern('^[1-9][0-9]*$')][string]$Issue,
    [Parameter(Mandatory = $true)][string]$ExpectedBranch
)
. (Join-Path $PSScriptRoot 'git-common.ps1')
Assert-ExpectedBranch $ExpectedBranch
Assert-NoCommitHooks
$temporaryIndex = Join-Path ([IO.Path]::GetTempPath()) ("git-index-" + [guid]::NewGuid().ToString('N'))
$previousIndex = [Environment]::GetEnvironmentVariable('GIT_INDEX_FILE', 'Process')
try {
    $env:GIT_INDEX_FILE = $temporaryIndex
    $null = Invoke-Git -Arguments @('read-tree', 'HEAD')
    $null = Invoke-Git -Arguments @('commit', '--allow-empty', '-m', "chore: open #$Issue")
}
finally {
    [Environment]::SetEnvironmentVariable('GIT_INDEX_FILE', $previousIndex, 'Process')
    foreach ($temporaryPath in @($temporaryIndex, "$temporaryIndex.lock")) {
        if (Test-Path -LiteralPath $temporaryPath) {
            Remove-Item -LiteralPath $temporaryPath
        }
    }
}
Write-Output "Empty commit created on $ExpectedBranch for issue #$Issue"
