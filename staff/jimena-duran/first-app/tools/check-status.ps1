[CmdletBinding()]
param()
. (Join-Path $PSScriptRoot 'git-common.ps1')
$currentBranch = Get-CurrentBranch
Write-Output "Repository: $script:repositoryRoot"
Write-Output "Branch: $currentBranch"
$remote = Invoke-Git -Arguments @('remote', 'get-url', 'origin') -AllowFailure
if ($remote.ExitCode -eq 0) {
    Write-Output "Origin: $($remote.Output -join '')"
}
else {
    Write-Output 'Origin: not configured'
}
$upstream = Invoke-Git -Arguments @('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}') -AllowFailure
if ($upstream.ExitCode -eq 0) {
    $counts = Invoke-Git -Arguments @('rev-list', '--left-right', '--count', "HEAD...$($upstream.Output[0])")
    Write-Output "Upstream: $($upstream.Output[0]); ahead/behind: $($counts.Output -join '')"
}
else {
    Write-Output 'Upstream: none'
}
$lastCommit = Invoke-Git -Arguments @('log', '-1', '--format=%h %s') -AllowFailure
Write-Output "Last commit: $($lastCommit.Output -join '')"
Write-Output 'Staged:'
(Invoke-Git -Arguments @('diff', '--cached', '--name-status')).Output
Write-Output 'Unstaged:'
(Invoke-Git -Arguments @('diff', '--name-status')).Output
Write-Output 'Untracked:'
(Invoke-Git -Arguments @('ls-files', '--others', '--exclude-standard')).Output
Assert-NoGitOperation
