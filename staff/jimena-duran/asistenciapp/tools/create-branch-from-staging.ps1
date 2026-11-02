[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$Issue,
    [Parameter(Mandatory = $true)][string]$Type,
    [Parameter(Mandatory = $true)][string]$Description,
    [string]$BranchName
)
. (Join-Path $PSScriptRoot 'git-common.ps1')
$taskBranch = Get-TaskBranchName $Issue $Type $Description $BranchName
Assert-CleanWorktree
& (Join-Path $PSScriptRoot 'pull-changes.ps1')
if (Test-GitRef "refs/heads/$taskBranch") {
    $null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', $taskBranch)
    Write-Output "Rama existente conservada: $taskBranch. Revisar por separado la integración de staging."
}
elseif (Test-GitRef "refs/remotes/origin/$taskBranch") {
    $null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', '--track', '-c', $taskBranch, "origin/$taskBranch")
    Write-Output "Rama remota recuperada: $taskBranch. Revisar por separado la integración de staging."
}
else {
    $null = Invoke-Git -Arguments @('switch', '--no-overwrite-ignore', '-c', $taskBranch, 'staging')
    Write-Output "Creada desde staging: $taskBranch"
}
