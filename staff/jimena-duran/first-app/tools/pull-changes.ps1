[CmdletBinding()]
param()
. (Join-Path $PSScriptRoot 'git-common.ps1')
Assert-CleanWorktree
$currentBranch = Get-CurrentBranch
$null = Invoke-Git -Arguments @('fetch', 'origin')
if (-not (Test-GitRef 'refs/remotes/origin/staging')) {
    throw 'origin/staging is missing.'
}
if (Test-GitRef 'refs/heads/staging') {
    $ancestor = Invoke-Git -Arguments @('merge-base', '--is-ancestor', 'staging', 'origin/staging') -AllowFailure
    if ($ancestor.ExitCode -ne 0) {
        throw 'staging cannot advance by fast-forward. Report divergence before resolving.'
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
                throw 'staging is checked out in another worktree. Report before resolving.'
            }
            # update-ref checks the old value, after verifying fast-forward above.
            $null = Invoke-Git -Arguments @('update-ref', 'refs/heads/staging', $after, $before)
        }
    }
}
else {
    $null = Invoke-Git -Arguments @('branch', 'staging', 'origin/staging')
}
Write-Output "staging updated; current branch preserved: $currentBranch"
