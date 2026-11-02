[CmdletBinding()]
param([Parameter(Mandatory = $true)][string]$ExpectedBranch)
. (Join-Path $PSScriptRoot 'git-common.ps1')
Assert-ExpectedBranch $ExpectedBranch
$null = Invoke-Git -Arguments @('push', '--set-upstream', 'origin', 'HEAD')
Write-Output "Published $ExpectedBranch to origin."
