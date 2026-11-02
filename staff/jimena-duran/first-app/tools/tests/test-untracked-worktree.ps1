# Focused regression: unrelated untracked data must not block safe Git operations.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$testRoot = Join-Path ([IO.Path]::GetTempPath()) ('jimena-untracked-test-' + [guid]::NewGuid().ToString('N'))
$null = New-Item -ItemType Directory -Path $testRoot
$seedPath = Join-Path $testRoot 'seed'
$remotePath = Join-Path $testRoot 'remote.git'
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
        throw "FAIL: $Name (fixture retained at $testRoot)"
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

Write-Output "Disposable untracked fixture: $testRoot"
$null = Run-Git $testRoot @('init', '--bare', '--initial-branch=staging', $remotePath)
$null = Run-Git $testRoot @('init', '--initial-branch=staging', $seedPath)
$null = Run-Git $seedPath @('config', 'user.name', 'Local untracked test')
$null = Run-Git $seedPath @('config', 'user.email', 'untracked-test@example.invalid')
$null = Run-Git $seedPath @('config', 'commit.gpgsign', 'false')
'initial tracked content' | Set-Content -LiteralPath (Join-Path $seedPath 'tracked.txt')
$null = Run-Git $seedPath @('add', '--', 'tracked.txt')
$null = Run-Git $seedPath @('commit', '-m', 'chore: initialize disposable untracked fixture')
$null = Run-Git $seedPath @('remote', 'add', 'origin', $remotePath)
$null = Run-Git $seedPath @('push', '-u', 'origin', 'staging')
$null = Run-Git $testRoot @('clone', $remotePath, $workPath)
$null = Run-Git $workPath @('config', 'user.name', 'Local untracked test')
$null = Run-Git $workPath @('config', 'user.email', 'untracked-test@example.invalid')
$null = Run-Git $workPath @('config', 'commit.gpgsign', 'false')
$null = New-Item -ItemType Directory -Path (Join-Path $workPath 'tools')
Copy-Item -Path (Join-Path $PSScriptRoot '../*.ps1') -Destination (Join-Path $workPath 'tools')
'tools/' | Add-Content -LiteralPath (Join-Path $workPath '.git/info/exclude')
$null = New-Item -ItemType Directory -Path (Join-Path $workPath 'ChromaDB')
'private local fixture data' | Set-Content -LiteralPath (Join-Path $workPath 'ChromaDB/users.txt')
'untracked loose data' | Set-Content -LiteralPath (Join-Path $workPath 'loose.txt')
$chromaHash = (Get-FileHash -LiteralPath (Join-Path $workPath 'ChromaDB/users.txt')).Hash
$looseHash = (Get-FileHash -LiteralPath (Join-Path $workPath 'loose.txt')).Hash
$initialUntracked = @(Run-Git $workPath @('ls-files', '--others', '--exclude-standard'))
Assert-Test ($initialUntracked -contains 'ChromaDB/users.txt' -and $initialUntracked -contains 'loose.txt') 'fixture data really is untracked and not ignored'

$null = Run-Tool 'pull-changes'
Assert-Test ((Run-Git $workPath @('branch', '--show-current')) -eq 'staging') 'unrelated untracked data permits staging update'
$null = Run-Tool 'create-branch-from-staging' @{ Issue = '901'; Type = 'test'; Description = 'untracked-safe' }
Assert-Test ((Run-Git $workPath @('branch', '--show-current')) -eq '901-test-untracked-safe') 'unrelated untracked data permits new task branch'
$savedHead = Run-Git $workPath @('rev-parse', 'HEAD')
$null = Run-Tool 'create-branch-from-staging' @{ Issue = '901'; Type = 'test'; Description = 'untracked-safe' }
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $savedHead) 'unrelated untracked data permits recovering existing branch'
$null = Run-Tool 'create-branch' @{ Base = '901-test-untracked-safe'; Issue = '902'; Type = 'test'; Description = 'alternate-safe' }
Assert-Test ((Run-Git $workPath @('branch', '--show-current')) -eq '902-test-alternate-safe') 'unrelated untracked data permits alternate-base branch'
$afterUntracked = @(Run-Git $workPath @('ls-files', '--others', '--exclude-standard'))
Assert-Test (($initialUntracked -join "`n") -eq ($afterUntracked -join "`n")) 'safe operations do not add hide or remove untracked files'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath 'ChromaDB/users.txt')).Hash -eq $chromaHash -and (Get-FileHash -LiteralPath (Join-Path $workPath 'loose.txt')).Hash -eq $looseHash) 'safe operations preserve untracked data bytes'

# Exercise an actual fast-forward while staging is checked out.
$null = Run-Git $workPath @('switch', '--no-overwrite-ignore', 'staging')
'safe remote advance' | Set-Content -LiteralPath (Join-Path $seedPath 'advance.txt')
$null = Run-Git $seedPath @('add', '--', 'advance.txt')
$null = Run-Git $seedPath @('commit', '-m', 'docs: advance disposable staging')
$null = Run-Git $seedPath @('push', 'origin', 'staging')
$null = Run-Tool 'pull-changes'
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq (Run-Git $seedPath @('rev-parse', 'HEAD'))) 'untracked data permits actual current-staging fast-forward'

# A target tracking an untracked filename must still be rejected.
$null = Run-Git $seedPath @('switch', '-c', '903-test-file-collision')
'remote colliding content' | Set-Content -LiteralPath (Join-Path $seedPath 'loose.txt')
$null = Run-Git $seedPath @('add', '--', 'loose.txt')
$null = Run-Git $seedPath @('commit', '-m', 'chore: create disposable file collision')
$null = Run-Git $seedPath @('push', 'origin', '903-test-file-collision')
Expect-Block { Run-Tool 'create-branch-from-staging' @{ Issue = '903'; Type = 'test'; Description = 'file-collision' } } 'target file collision blocks branch change'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath 'loose.txt')).Hash -eq $looseHash) 'blocked branch change preserves untracked file'

$null = Run-Git $seedPath @('switch', '-c', '904-test-directory-collision', 'staging')
$null = New-Item -ItemType Directory -Path (Join-Path $seedPath 'ChromaDB')
'remote directory content' | Set-Content -LiteralPath (Join-Path $seedPath 'ChromaDB/users.txt')
$null = Run-Git $seedPath @('add', '--', 'ChromaDB/users.txt')
$null = Run-Git $seedPath @('commit', '-m', 'chore: create disposable directory collision')
$null = Run-Git $seedPath @('push', 'origin', '904-test-directory-collision')
Expect-Block { Run-Tool 'create-branch-from-staging' @{ Issue = '904'; Type = 'test'; Description = 'directory-collision' } } 'target directory collision blocks branch change'
Assert-Test ((Get-FileHash -LiteralPath (Join-Path $workPath 'ChromaDB/users.txt')).Hash -eq $chromaHash) 'blocked directory change preserves local data'
Assert-Test ((Run-Git $workPath @('branch', '--show-current')) -eq 'staging') 'collision leaves current branch unchanged'

$null = Run-Git $seedPath @('switch', 'staging')
'remote staging collision' | Set-Content -LiteralPath (Join-Path $seedPath 'loose.txt')
$null = Run-Git $seedPath @('add', '--', 'loose.txt')
$null = Run-Git $seedPath @('commit', '-m', 'chore: create disposable staging collision')
$null = Run-Git $seedPath @('push', 'origin', 'staging')
$beforeBlockedMerge = Run-Git $workPath @('rev-parse', 'HEAD')
Expect-Block { Run-Tool 'pull-changes' } 'untracked collision blocks fast-forward merge'
Assert-Test ((Run-Git $workPath @('rev-parse', 'HEAD')) -eq $beforeBlockedMerge -and (Get-FileHash -LiteralPath (Join-Path $workPath 'loose.txt')).Hash -eq $looseHash) 'blocked merge preserves HEAD and untracked data'

# Real merge conflict in the disposable copy; leave it unresolved for inspection.
$null = Run-Git $workPath @('switch', '-c', '905-test-conflict-target')
'target version' | Set-Content -LiteralPath (Join-Path $workPath 'tracked.txt')
$null = Run-Git $workPath @('add', '--', 'tracked.txt')
$null = Run-Git $workPath @('commit', '-m', 'chore: create target conflict side')
$null = Run-Git $workPath @('switch', '-c', '906-test-conflict-source', 'staging')
'source version' | Set-Content -LiteralPath (Join-Path $workPath 'tracked.txt')
$null = Run-Git $workPath @('add', '--', 'tracked.txt')
$null = Run-Git $workPath @('commit', '-m', 'chore: create source conflict side')
$null = Run-Git $workPath @('merge', '905-test-conflict-target') -AllowFailure
Assert-Test (@(Run-Git $workPath @('ls-files', '--unmerged')).Count -gt 0) 'fixture contains a real unresolved conflict'
Expect-Block { Run-Tool 'pull-changes' } 'real conflict still blocks staging update'
Expect-Block { Run-Tool 'create-branch-from-staging' @{ Issue = '907'; Type = 'test'; Description = 'must-not-switch' } } 'real conflict still blocks branch creation'
$finalUntracked = @(Run-Git $workPath @('ls-files', '--others', '--exclude-standard'))
Assert-Test (($initialUntracked -join "`n") -eq ($finalUntracked -join "`n") -and (Get-FileHash -LiteralPath (Join-Path $workPath 'ChromaDB/users.txt')).Hash -eq $chromaHash -and (Get-FileHash -LiteralPath (Join-Path $workPath 'loose.txt')).Hash -eq $looseHash) 'all untracked files remain untracked and byte-identical after blocked operations'
Write-Output "PASS: $testCount untracked assertions; fixture retained at $testRoot"
