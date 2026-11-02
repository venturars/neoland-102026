[CmdletBinding()]
param()
. (Join-Path $PSScriptRoot 'git-common.ps1')
Assert-CleanWorktree
$currentBranch = Get-CurrentBranch
$null = Invoke-Git -Arguments @('fetch', 'origin')
if (-not (Test-GitRef 'refs/remotes/origin/staging')) {
    throw 'No existe origin/staging.'
}
if (Test-GitRef 'refs/heads/staging') {
    $ancestor = Invoke-Git -Arguments @('merge-base', '--is-ancestor', 'staging', 'origin/staging') -AllowFailure
    if ($ancestor.ExitCode -ne 0) {
        throw 'staging no permite avance rápido. Informa de la divergencia antes de resolverla.'
    }
    $before = (Invoke-Git -Arguments @('rev-parse', 'staging')).Output[0]
    $after = (Invoke-Git -Arguments @('rev-parse', 'origin/staging')).Output[0]
    if ($before -ne $after) {
        if ($currentBranch -eq 'staging') {
            $null = Invoke-Git -Arguments @('merge', '--ff-only', '--no-overwrite-ignore', 'origin/staging')
        }
        else {
            $worktrees = Invoke-Git -Arguments @('worktree', 'list', '--porcelain')
            if ($worktrees.Output -contains 'branch refs/heads/staging') {
                throw 'staging está abierta en otro worktree. Informa antes de resolverlo.'
            }
            # update-ref checks the old value, after verifying fast-forward above.
            $null = Invoke-Git -Arguments @('update-ref', 'refs/heads/staging', $after, $before)
        }
    }
}
else {
    $null = Invoke-Git -Arguments @('branch', 'staging', 'origin/staging')
}
Write-Output "staging actualizada; rama actual conservada: $currentBranch"
