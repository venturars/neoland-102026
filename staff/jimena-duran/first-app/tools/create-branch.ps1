[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Base,
    [Parameter(Mandatory = $true)][string]$Issue,
    [Parameter(Mandatory = $true)][string]$Type,
    [Parameter(Mandatory = $true)][string]$Description,
    [string]$BranchName
)
. (Join-Path $PSScriptRoot 'git-common.ps1')
if ($Base -in @('staging', 'origin/staging')) {
    throw 'Use create-branch-from-staging.ps1 for staging.'
}
if ($Base.StartsWith('-') -or $Base -eq 'HEAD') {
    throw 'Base must be an explicit branch name.'
}
$null = Invoke-Git -Arguments @('check-ref-format', '--branch', $Base)
$taskBranch = Get-TaskBranchName $Issue $Type $Description $BranchName
Assert-CleanWorktree
$null = Invoke-Git -Arguments @('fetch', 'origin')
if (Test-GitRef "refs/heads/$taskBranch") {
    $null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', $taskBranch)
    Write-Output "Existing branch preserved: $taskBranch"
    return
}
if (Test-GitRef "refs/remotes/origin/$taskBranch") {
    $null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', '--track', '-c', $taskBranch, "origin/$taskBranch")
    Write-Output "Remote branch recovered: $taskBranch"
    return
}
$startPoint = $null
foreach ($reference in @("refs/remotes/origin/$Base", "refs/remotes/$Base", "refs/heads/$Base")) {
    if (Test-GitRef $reference) {
        $startPoint = $reference
        break
    }
}
if (-not $startPoint) {
    throw "Base branch not found: $Base"
}
$null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', '-c', $taskBranch, $startPoint)
Write-Output "Created $taskBranch from $startPoint"
