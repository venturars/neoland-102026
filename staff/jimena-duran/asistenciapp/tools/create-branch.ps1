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
    throw 'Usa create-branch-from-staging.ps1 para staging.'
}
if ($Base.StartsWith('-') -or $Base -eq 'HEAD') {
    throw 'La base debe ser un nombre de rama explícito.'
}
$null = Invoke-Git -Arguments @('check-ref-format', '--branch', $Base)
$taskBranch = Get-TaskBranchName $Issue $Type $Description $BranchName
Assert-CleanWorktree
$null = Invoke-Git -Arguments @('fetch', 'origin')
if (Test-GitRef "refs/heads/$taskBranch") {
    $null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', $taskBranch)
    Write-Output "Rama existente conservada: $taskBranch"
    return
}
if (Test-GitRef "refs/remotes/origin/$taskBranch") {
    $null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', '--track', '-c', $taskBranch, "origin/$taskBranch")
    Write-Output "Rama remota recuperada: $taskBranch"
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
    throw "No existe la rama base: $Base"
}
$null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', '-c', $taskBranch, $startPoint)
Write-Output "Rama $taskBranch creada desde $startPoint"
