# Run only when local disposable Git commits and pushes have been authorized.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$script:originalTestPath = $env:PATH
$testRoot = Join-Path ([IO.Path]::GetTempPath()) ('jimena-git-test-' + [guid]::NewGuid().ToString('N'))
$null = New-Item -ItemType Directory -Path $testRoot
$remotePath = Join-Path $testRoot 'remote.git'
$seedPath = Join-Path $testRoot 'seed'
$workPath = Join-Path $testRoot 'work with spaces'
$testCount = 0

function Run-Git {
    param([string]$Directory, [string[]]$GitArguments)
    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $lines = @(& git -C $Directory @GitArguments 2>&1)
        $code = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousPreference
    }
    if ($code -ne 0) {
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

Write-Output "Disposable fixture: $testRoot"
$null = Run-Git $testRoot @('init', '--bare', '--initial-branch=staging', $remotePath)
$null = Run-Git $testRoot @('init', '--initial-branch=staging', $seedPath)
$null = Run-Git $seedPath @('config', 'user.name', 'Local workflow test')
$null = Run-Git $seedPath @('config', 'user.email', 'workflow-test@example.invalid')
'initial selected' | Set-Content -LiteralPath (Join-Path $seedPath 'selected.txt')
'initial other' | Set-Content -LiteralPath (Join-Path $seedPath 'other.txt')
'spaced initial' | Set-Content -LiteralPath (Join-Path $seedPath 'file with spaces.txt')
$null = Run-Git $seedPath @('add', '--', 'selected.txt', 'other.txt', 'file with spaces.txt')
$null = Run-Git $seedPath @('commit', '-m', 'chore: initialize disposable fixture')
$null = Run-Git $seedPath @('remote', 'add', 'origin', $remotePath)
$null = Run-Git $seedPath @('push', '-u', 'origin', 'staging')
$null = Run-Git $testRoot @('clone', $remotePath, $workPath)
$null = Run-Git $workPath @('config', 'user.name', 'Local workflow test')
$null = Run-Git $workPath @('config', 'user.email', 'workflow-test@example.invalid')
$null = Run-Git $workPath @('config', 'commit.gpgsign', 'false')
$null = New-Item -ItemType Directory -Path (Join-Path $workPath 'tools')
Copy-Item -Path (Join-Path $PSScriptRoot '../*.ps1') -Destination (Join-Path $workPath 'tools')
'tools/' | Add-Content -LiteralPath (Join-Path $workPath '.git/info/exclude')

$status = @(Run-Tool 'check-status') -join "`n"
Assert-Test ($status.Contains('Branch: staging') -and $status.Contains('work with spaces')) 'status works from a path with spaces'
$null = Run-Tool 'pull-changes'
$null = Run-Tool 'create-branch-from-staging' @{ Issue = '701'; Type = 'feat'; Description = 'first-task' }
Assert-Test ((Run-Git $workPath @('branch', '--show-current')) -eq '701-feat-first-task') 'create a future task branch'

'selected work' | Set-Content -LiteralPath (Join-Path $workPath 'selected.txt')
'other staged' | Set-Content -LiteralPath (Join-Path $workPath 'other.txt')
$null = Run-Git $workPath @('add', '--', 'other.txt')
'other unstaged' | Add-Content -LiteralPath (Join-Path $workPath 'other.txt')
'private untracked' | Set-Content -LiteralPath (Join-Path $workPath 'private.txt')
$beforeStatus = (Run-Git $workPath @('status', '--porcelain')) -join "`n"
Expect-Block { Run-Tool 'pull-changes' } 'dirty update blocked'
Expect-Block { Run-Tool 'create-branch-from-staging' @{ Issue = '702'; Type = 'fix'; Description = 'second-task' } } 'dirty branch switch blocked'
Assert-Test (((Run-Git $workPath @('status', '--porcelain')) -join "`n") -eq $beforeStatus) 'tracked staged unstaged and untracked changes preserved'
Expect-Block { Run-Tool 'create-empty-commit' @{ Issue = '701'; ExpectedBranch = 'wrong-branch' } } 'wrong branch blocked'

$stagedOther = (Run-Git $workPath @('show', ':other.txt')) -join "`n"
$beforeTree = Run-Git $workPath @('rev-parse', 'HEAD^{tree}')
$null = Run-Tool 'create-empty-commit' @{ Issue = '701'; ExpectedBranch = '701-feat-first-task' }
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD^{tree}')) -eq $beforeTree) 'empty commit excludes staged unrelated work'
Assert-Test (((Run-Git $workPath @('show', ':other.txt')) -join "`n") -eq $stagedOther) 'empty commit preserves original index'

$null = Run-Tool 'commit-changes' @{ Message = 'feat: save selected file'; Paths = @('selected.txt'); ExpectedBranch = '701-feat-first-task' }
$committedPaths = @(Run-Git $workPath @('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'))
Assert-Test ($committedPaths.Count -eq 1 -and $committedPaths[0] -eq 'selected.txt') 'selective commit contains only named file'
Assert-Test (((Run-Git $workPath @('show', ':other.txt')) -join "`n") -eq $stagedOther) 'selective commit preserves unrelated staged version'
Assert-Test ((Get-Content -LiteralPath (Join-Path $workPath 'other.txt') -Raw).Contains('other unstaged')) 'selective commit preserves unstaged work'
Assert-Test (Test-Path -LiteralPath (Join-Path $workPath 'private.txt')) 'selective commit preserves untracked data'

Expect-Block { Run-Tool 'commit-changes' @{ Message = 'fix: reject directory'; Paths = @('.'); ExpectedBranch = '701-feat-first-task' } } 'directory path blocked'
Expect-Block { Run-Tool 'commit-changes' @{ Message = 'fix: reject glob'; Paths = @('*.txt'); ExpectedBranch = '701-feat-first-task' } } 'wildcard path blocked'
Expect-Block { Run-Tool 'commit-changes' @{ Message = 'fix: reject escape'; Paths = @('../outside.txt'); ExpectedBranch = '701-feat-first-task' } } 'outside path blocked'

'new spaced content' | Set-Content -LiteralPath (Join-Path $workPath 'file with spaces.txt')
$null = Run-Tool 'commit-changes' @{ Message = 'docs: save spaced file'; Paths = @('file with spaces.txt'); ExpectedBranch = '701-feat-first-task' }
Assert-Test (((Run-Git $workPath @('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD')) -join '') -eq 'file with spaces.txt') 'selective commit accepts a path with spaces'

# Hooks must be reviewed, never disabled or allowed to stage unrelated data.
$hookPath = Join-Path $workPath '.git/hooks/pre-commit'
[IO.File]::WriteAllText($hookPath, "#!/bin/sh`ngit add .`n", (New-Object Text.UTF8Encoding($false)))
'failed selected work' | Set-Content -LiteralPath (Join-Path $workPath 'selected.txt')
$beforeFailedHead = Run-Git $workPath @('rev-parse', 'HEAD')
$beforeFailedIndex = (Get-FileHash -LiteralPath (Join-Path $workPath '.git/index')).Hash
Expect-Block { Run-Tool 'commit-changes' @{ Message = 'fix: reject active hook'; Paths = @('selected.txt'); ExpectedBranch = '701-feat-first-task' } } 'hook which could expand scope blocked'
Expect-Block { Run-Tool 'create-empty-commit' @{ Issue = '701'; ExpectedBranch = '701-feat-first-task' } } 'empty commit with active hook blocked'
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $beforeFailedHead) 'failure preserves HEAD'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath '.git/index')).Hash -eq $beforeFailedIndex) 'failure preserves index bytes'
Assert-Test (-not (Test-Path Env:GIT_INDEX_FILE)) 'temporary index environment restored'
Remove-Item -LiteralPath $hookPath
$previousAuthorDate = [Environment]::GetEnvironmentVariable('GIT_AUTHOR_DATE', 'Process')
try {
    $env:GIT_AUTHOR_DATE = 'not-a-valid-date'
    Expect-Block { Run-Tool 'commit-changes' @{ Message = 'fix: reject invalid date'; Paths = @('selected.txt'); ExpectedBranch = '701-feat-first-task' } } 'native commit failure reported'
}
finally {
    [Environment]::SetEnvironmentVariable('GIT_AUTHOR_DATE', $previousAuthorDate, 'Process')
}
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $beforeFailedHead) 'native failure preserves HEAD'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath '.git/index')).Hash -eq $beforeFailedIndex) 'native failure preserves original index'

# Save fixture data through normal commits, never reset/clean/stash.
$null = Run-Git $workPath @('add', '--', 'selected.txt', 'other.txt', 'private.txt')
$null = Run-Git $workPath @('commit', '-m', 'chore: preserve disposable fixture data')
$savedHead = Run-Git $workPath @('rev-parse', 'HEAD')
$null = Run-Tool 'launch-push' @{ ExpectedBranch = '701-feat-first-task' }
Assert-Test ((Run-Git $workPath @('rev-parse', '@{u}')) -eq $savedHead) 'push targets only the disposable local remote'
$null = Run-Git $workPath @('switch', 'staging')
Expect-Block { Run-Tool 'create-empty-commit' @{ Issue = '701'; ExpectedBranch = 'staging' } } 'protected staging commit blocked'
Expect-Block { Run-Tool 'launch-push' @{ ExpectedBranch = 'staging' } } 'protected staging push blocked'
$null = Run-Tool 'create-branch-from-staging' @{ Issue = '701'; Type = 'feat'; Description = 'first-task' }
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $savedHead) 'existing branch work retained'

'remote staging update' | Set-Content -LiteralPath (Join-Path $seedPath 'advance.txt')
$null = Run-Git $seedPath @('add', '--', 'advance.txt')
$null = Run-Git $seedPath @('commit', '-m', 'docs: advance disposable staging')
$null = Run-Git $seedPath @('push', 'origin', 'staging')
$null = Run-Tool 'pull-changes'
Assert-Test ((Run-Git $workPath @('rev-parse', 'staging')) -eq (Run-Git $seedPath @('rev-parse', 'staging'))) 'staging advances fast-forward off branch'
Assert-Test ((Run-Git $workPath @('branch', '--show-current')) -eq '701-feat-first-task') 'update preserves current branch'
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $savedHead) 'update preserves task branch commits'

$null = Run-Tool 'create-branch-from-staging' @{ Issue = '702'; Type = 'fix'; Description = 'second-task' }
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq (Run-Git $seedPath @('rev-parse', 'staging'))) 'second future branch starts at updated staging'
$null = Run-Tool 'create-branch' @{ Base = '701-feat-first-task'; Issue = '703'; Type = 'docs'; Description = 'alternate-base' }
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $savedHead) 'alternate base branch works'
$null = Run-Tool 'create-branch-from-staging' @{ Issue = '704'; Type = 'chore'; Description = 'custom-name'; BranchName = 'custom-authorized-branch' }
Assert-Test ((Run-Git $workPath @('branch', '--show-current')) -eq 'custom-authorized-branch') 'explicit authorized branch name supported'

# A remote branch created after the clone must be discovered and recovered.
$null = Run-Git $seedPath @('branch', '705-feat-remote-task')
$null = Run-Git $seedPath @('push', 'origin', '705-feat-remote-task')
$null = Run-Tool 'create-branch-from-staging' @{ Issue = '705'; Type = 'feat'; Description = 'remote-task' }
Assert-Test ((Run-Git $workPath @('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')) -eq 'origin/705-feat-remote-task') 'remote-only branch recovered'

# Protect staging in another worktree, then exercise a divergent staging.
$otherWorktree = Join-Path $testRoot 'staging worktree'
$null = Run-Git $workPath @('worktree', 'add', $otherWorktree, 'staging')
'another advance' | Add-Content -LiteralPath (Join-Path $seedPath 'advance.txt')
$null = Run-Git $seedPath @('add', '--', 'advance.txt')
$null = Run-Git $seedPath @('commit', '-m', 'docs: advance staging again')
$null = Run-Git $seedPath @('push', 'origin', 'staging')
Expect-Block { Run-Tool 'pull-changes' } 'staging checked out elsewhere is protected'
$null = Run-Git $workPath @('worktree', 'remove', $otherWorktree)
$null = Run-Git $workPath @('switch', 'staging')
'divergent local' | Set-Content -LiteralPath (Join-Path $workPath 'diverge.txt')
$null = Run-Git $workPath @('add', '--', 'diverge.txt')
$null = Run-Git $workPath @('commit', '-m', 'chore: create disposable divergence')
$divergedHead = Run-Git $workPath @('rev-parse', 'HEAD')
Expect-Block { Run-Tool 'pull-changes' } 'divergent staging blocked'
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $divergedHead) 'divergence preserves HEAD'

$gitPath = (Get-Command git).Source
$env:PATH = ''
try {
    Expect-Block { Run-Tool 'check-status' } 'missing Git reported'
}
finally {
    # Restore from the running process snapshot saved below by the caller.
    $env:PATH = $script:originalTestPath
}
Write-Output "PASS: $testCount assertions; fixture retained for inspection at $testRoot"
