# Focused regression checks: ignored data, hooks, conflicts and native failures.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$testRoot = Join-Path ([IO.Path]::GetTempPath()) ('jimena-git-safety-' + [guid]::NewGuid().ToString('N'))
$null = New-Item -ItemType Directory -Path $testRoot
$remotePath = Join-Path $testRoot 'remote.git'
$seedPath = Join-Path $testRoot 'seed'
$workPath = Join-Path $testRoot 'work with spaces'
$testCount = 0

function Run-Git {
    param([string]$Directory, [string[]]$GitArguments, [switch]$AllowFailure)
    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $lines = @(& git -C $Directory @GitArguments 2>&1)
        $code = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousPreference
    }
    if ($code -ne 0 -and -not $AllowFailure) {
        throw "Fixture git failed: $($GitArguments -join ' '): $lines"
    }
    return $lines | ForEach-Object { $_.ToString() }
}

function Assert-Test {
    param([bool]$Condition, [string]$Name)
    if (-not $Condition) {
        throw "FAIL: $Name (fixture kept at $testRoot)"
    }
    $script:testCount += 1
    Write-Output "PASS: $Name"
}

function Expect-Block {
    param([scriptblock]$Action, [string]$Name)
    $blocked = $false
    try {
        & $Action | Out-Null
    }
    catch {
        $blocked = $true
        Write-Output "Blocked as expected: $($_.Exception.Message.Split([char]10)[0])"
    }
    Assert-Test $blocked $Name
}

function Run-Tool {
    param([string]$Name, [hashtable]$Parameters = @{})
    & (Join-Path $workPath "tools/$Name.ps1") @Parameters
}

Write-Output "Disposable safety fixture: $testRoot"
$null = Run-Git $testRoot @('init', '--bare', '--initial-branch=staging', $remotePath)
$null = Run-Git $testRoot @('init', '--initial-branch=staging', $seedPath)
$null = Run-Git $seedPath @('config', 'user.name', 'Local safety test')
$null = Run-Git $seedPath @('config', 'user.email', 'safety-test@example.invalid')
$null = Run-Git $seedPath @('config', 'commit.gpgsign', 'false')
'original content' | Set-Content -LiteralPath (Join-Path $seedPath 'selected.txt')
$null = Run-Git $seedPath @('add', '--', 'selected.txt')
$null = Run-Git $seedPath @('commit', '-m', 'chore: initialize disposable safety fixture')
$null = Run-Git $seedPath @('remote', 'add', 'origin', $remotePath)
$null = Run-Git $seedPath @('push', '-u', 'origin', 'staging')
$null = Run-Git $testRoot @('clone', $remotePath, $workPath)
$null = Run-Git $workPath @('config', 'user.name', 'Local safety test')
$null = Run-Git $workPath @('config', 'user.email', 'safety-test@example.invalid')
$null = Run-Git $workPath @('config', 'commit.gpgsign', 'false')
$null = New-Item -ItemType Directory -Path (Join-Path $workPath 'tools')
Copy-Item -Path (Join-Path $PSScriptRoot '../*.ps1') -Destination (Join-Path $workPath 'tools')
@('tools/', 'private.sqlite') | Add-Content -LiteralPath (Join-Path $workPath '.git/info/exclude')
$null = Run-Git $workPath @('switch', '-c', '801-feat-safety')

'selected work' | Set-Content -LiteralPath (Join-Path $workPath 'selected.txt')
'personal ignored data' | Set-Content -LiteralPath (Join-Path $workPath 'private.sqlite')
$privateHash = (Get-FileHash -LiteralPath (Join-Path $workPath 'private.sqlite')).Hash
$hookPath = Join-Path $workPath '.git/hooks/pre-commit'
[IO.File]::WriteAllText($hookPath, "#!/bin/sh`ngit add .`n", (New-Object Text.UTF8Encoding($false)))
$beforeHead = Run-Git $workPath @('rev-parse', 'HEAD')
$beforeIndex = (Get-FileHash -LiteralPath (Join-Path $workPath '.git/index')).Hash
Expect-Block { Run-Tool 'commit-changes' @{ Message = 'fix: selected change'; Paths = @('selected.txt'); ExpectedBranch = '801-feat-safety' } } 'scope-expanding hook blocks selective commit'
Expect-Block { Run-Tool 'create-empty-commit' @{ Issue = '801'; ExpectedBranch = '801-feat-safety' } } 'scope-expanding hook blocks empty commit'
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $beforeHead) 'hooks did not move HEAD'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath '.git/index')).Hash -eq $beforeIndex) 'hooks did not change index bytes'
Assert-Test (Test-Path -LiteralPath $hookPath) 'hooks were not disabled or deleted'
Remove-Item -LiteralPath $hookPath

$previousDate = [Environment]::GetEnvironmentVariable('GIT_AUTHOR_DATE', 'Process')
$previousIndex = [Environment]::GetEnvironmentVariable('GIT_INDEX_FILE', 'Process')
try {
    $env:GIT_AUTHOR_DATE = 'not-a-valid-date'
    $env:GIT_INDEX_FILE = Join-Path $workPath '.git/index'
    Expect-Block { Run-Tool 'commit-changes' @{ Message = 'fix: selected change'; Paths = @('selected.txt'); ExpectedBranch = '801-feat-safety' } } 'native Git failure propagated'
    Assert-Test ($env:GIT_INDEX_FILE -eq (Join-Path $workPath '.git/index')) 'pre-existing index environment restored'
}
finally {
    [Environment]::SetEnvironmentVariable('GIT_AUTHOR_DATE', $previousDate, 'Process')
    [Environment]::SetEnvironmentVariable('GIT_INDEX_FILE', $previousIndex, 'Process')
}
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $beforeHead) 'native failure did not move HEAD'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath '.git/index')).Hash -eq $beforeIndex) 'native failure did not change original index bytes'
$null = Run-Tool 'commit-changes' @{ Message = 'fix: selected change'; Paths = @('selected.txt'); ExpectedBranch = '801-feat-safety' }
Assert-Test (((Run-Git $workPath @('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD')) -join '') -eq 'selected.txt') 'selected file committed after resolving test-only failure'

# Remote task tracks a filename that is ignored and contains private data locally.
$null = Run-Git $seedPath @('switch', '-c', '802-feat-ignored-collision')
'remote version' | Set-Content -LiteralPath (Join-Path $seedPath 'private.sqlite')
$null = Run-Git $seedPath @('add', '--', 'private.sqlite')
$null = Run-Git $seedPath @('commit', '-m', 'chore: track disposable conflicting filename')
$null = Run-Git $seedPath @('push', 'origin', '802-feat-ignored-collision')
Expect-Block { Run-Tool 'create-branch-from-staging' @{ Issue = '802'; Type = 'feat'; Description = 'ignored-collision' } } 'branch switch protects ignored local data'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath 'private.sqlite')).Hash -eq $privateHash) 'ignored data hash preserved after blocked switch'
Assert-Test ((Run-Git $workPath @('branch', '--show-current')) -eq '801-feat-safety') 'failed switch preserves current branch'

# The same protection is required when staging is the current branch.
$null = Run-Git $workPath @('switch', '--no-overwrite-ignore', 'staging')
$null = Run-Git $seedPath @('switch', 'staging')
'remote staged version' | Set-Content -LiteralPath (Join-Path $seedPath 'private.sqlite')
$null = Run-Git $seedPath @('add', '--', 'private.sqlite')
$null = Run-Git $seedPath @('commit', '-m', 'chore: advance disposable staging with colliding file')
$null = Run-Git $seedPath @('push', 'origin', 'staging')
$beforeStaging = Run-Git $workPath @('rev-parse', 'HEAD')
Expect-Block { Run-Tool 'pull-changes' } 'fast-forward merge protects ignored local data'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath 'private.sqlite')).Hash -eq $privateHash) 'ignored data hash preserved after blocked merge'
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $beforeStaging) 'blocked merge preserves staging HEAD'

# Keep private bytes under another ignored name, then test an authorized FF.
'private.saved.sqlite' | Add-Content -LiteralPath (Join-Path $workPath '.git/info/exclude')
Move-Item -LiteralPath (Join-Path $workPath 'private.sqlite') -Destination (Join-Path $workPath 'private.saved.sqlite')
$null = Run-Tool 'pull-changes'
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq (Run-Git $seedPath @('rev-parse', 'HEAD'))) 'fast-forward works on current staging'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath 'private.saved.sqlite')).Hash -eq $privateHash) 'test-only private backup preserved'

# Generate a real unresolved merge conflict in this disposable fixture.
$null = Run-Git $workPath @('switch', '-c', '803-feat-conflict-target')
'target edit' | Set-Content -LiteralPath (Join-Path $workPath 'selected.txt')
$null = Run-Git $workPath @('add', '--', 'selected.txt')
$null = Run-Git $workPath @('commit', '-m', 'chore: create target side of disposable conflict')
$null = Run-Git $workPath @('switch', '-c', '804-feat-conflict-source', 'staging')
'source edit' | Set-Content -LiteralPath (Join-Path $workPath 'selected.txt')
$null = Run-Git $workPath @('add', '--', 'selected.txt')
$null = Run-Git $workPath @('commit', '-m', 'chore: create source side of disposable conflict')
$null = Run-Git $workPath @('merge', '803-feat-conflict-target') -AllowFailure
Assert-Test ((Run-Git $workPath @('ls-files', '--unmerged')).Count -gt 0) 'fixture has an actual unresolved conflict'
$conflictHash = (Get-FileHash -LiteralPath (Join-Path $workPath 'selected.txt')).Hash
Expect-Block { Run-Tool 'create-empty-commit' @{ Issue = '804'; ExpectedBranch = '804-feat-conflict-source' } } 'commit blocked during conflict'
Expect-Block { Run-Tool 'launch-push' @{ ExpectedBranch = '804-feat-conflict-source' } } 'push blocked during conflict'
Expect-Block { Run-Tool 'create-branch-from-staging' @{ Issue = '805'; Type = 'test'; Description = 'must-not-switch' } } 'branch change blocked during conflict'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath 'selected.txt')).Hash -eq $conflictHash) 'conflict contents retained for inspection'
Write-Output "PASS: $testCount safety assertions; fixture retained at $testRoot"
