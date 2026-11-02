# Ensayos de Git con datos ficticios; los repositorios se conservan para inspeccion.
[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
$sourceTools = Split-Path $PSScriptRoot -Parent
$realRoot = [IO.Path]::GetFullPath((& git -C $PSScriptRoot rev-parse --show-toplevel))
if ($LASTEXITCODE -ne 0) { throw 'Cannot locate the real repository.' }
$testRoot = Join-Path ([IO.Path]::GetTempPath()) ('asistenciapp-git-' + [guid]::NewGuid().ToString('N'))
$testRoot = [IO.Path]::GetFullPath($testRoot)
if ($testRoot.StartsWith($realRoot.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Fixture must be outside the real repository.'
}
$null = New-Item -ItemType Directory -Path $testRoot
$count = 0
$encoding = New-Object Text.UTF8Encoding($false)
$savedEnvironment = @{}
foreach ($name in @('GIT_CONFIG_GLOBAL', 'GIT_CONFIG_NOSYSTEM', 'GIT_TERMINAL_PROMPT')) {
    $savedEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
}

function Assert-FixturePath {
    param([string]$Path)
    $full = [IO.Path]::GetFullPath($Path)
    if ($full -ne $testRoot -and -not $full.StartsWith($testRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Target escapes the disposable fixture.'
    }
    $cursor = $full
    while ($cursor -and $cursor.Length -ge $testRoot.Length) {
        if ((Test-Path -LiteralPath $cursor) -and ((Get-Item -LiteralPath $cursor -Force).Attributes -band [IO.FileAttributes]::ReparsePoint)) {
            throw 'Reparse points are not accepted in fixture targets.'
        }
        $cursor = [IO.Path]::GetDirectoryName($cursor)
    }
}

function Assert-LocalRemotes {
    param([string]$Directory)
    Assert-FixturePath $Directory
    $previous = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $names = @(& git -C $Directory remote 2>$null)
        $remoteCode = $LASTEXITCODE
    }
    finally { $ErrorActionPreference = $previous }
    if ($remoteCode -ne 0) { return }
    foreach ($remoteName in $names) {
        foreach ($mode in @('fetch', 'push')) {
            $arguments = @('-C', $Directory, 'remote', 'get-url', '--all')
            if ($mode -eq 'push') { $arguments += '--push' }
            $urls = @(& git @arguments $remoteName)
            if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect fixture remote.' }
            foreach ($url in $urls) {
                if (-not [IO.Path]::IsPathRooted($url) -or $url.StartsWith('\\') -or $url -match '^[a-z]+://') {
                    throw 'Only absolute local fixture remotes are permitted.'
                }
                Assert-FixturePath $url
            }
        }
    }
}

function Run-Git {
    param([string]$Directory, [string[]]$Arguments, [switch]$AllowFailure)
    Assert-LocalRemotes $Directory
    $errorPath = Join-Path $testRoot 'native-stderr.txt'
    $previous = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $lines = @(& git -C $Directory @Arguments 2>$errorPath)
        $code = $LASTEXITCODE
    }
    finally { $ErrorActionPreference = $previous }
    if ($code -ne 0 -and -not $AllowFailure) {
        throw "Fixture command failed: $($Arguments -join ' ') : $([IO.File]::ReadAllText($errorPath))"
    }
    return [pscustomobject]@{ Output = $lines; Code = $code }
}

function Write-Fixture {
    param([string]$Directory, [string]$Name, [string]$Content)
    $path = Join-Path $Directory $Name
    Assert-FixturePath $path
    [IO.File]::WriteAllText($path, $Content, $encoding)
}

function Check {
    param([bool]$Condition, [string]$Name)
    if (-not $Condition) { throw "FAIL: $Name; fixture retained at $testRoot" }
    $script:count++
    Write-Output "PASS: $Name"
}

function Expect-Block {
    param([scriptblock]$Action, [string]$Name)
    $blocked = $false
    try { & $Action | Out-Null } catch { $blocked = $true }
    Check $blocked $Name
}

function Run-Tool {
    param([string]$Directory, [string]$Name, [hashtable]$Parameters = @{})
    Assert-LocalRemotes $Directory
    & (Join-Path $Directory "tools/$Name.ps1") @Parameters | Out-Null
}

function Configure-Fixture {
    param([string]$Directory)
    $null = Run-Git $Directory @('config', 'user.name', 'Automation Fixture')
    $null = Run-Git $Directory @('config', 'user.email', 'fixture@example.invalid')
}

try {
    $emptyConfig = Join-Path $testRoot 'empty.gitconfig'
    [IO.File]::WriteAllText($emptyConfig, '', $encoding)
    $env:GIT_CONFIG_GLOBAL = $emptyConfig
    $env:GIT_CONFIG_NOSYSTEM = '1'
    $env:GIT_TERMINAL_PROMPT = '0'
    Expect-Block { Assert-FixturePath $realRoot } 'fixture rejects the real repository'
    Expect-Block { Assert-FixturePath (Join-Path $testRoot '../outside') } 'fixture rejects escaped paths'
    $remote = Join-Path $testRoot 'remote.git'
    $seed = Join-Path $testRoot 'seed'
    $work = Join-Path $testRoot 'work with spaces'
    $null = Run-Git $testRoot @('init', '--bare', $remote)
    $null = Run-Git $testRoot @('init', '-b', 'staging', $seed)
    Configure-Fixture $seed
    $null = New-Item -ItemType Directory -Path (Join-Path $seed 'tools')
    Get-ChildItem -LiteralPath $sourceTools -Filter '*.ps1' -File | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $seed 'tools')
    }
    foreach ($name in @('tracked.txt', 'named file.txt', 'unrelated.txt')) { Write-Fixture $seed $name "base`n" }
    Write-Fixture $seed '.gitignore' "cache.db`nlocal-only/`n"
    $null = Run-Git $seed @('add', '--', '.')
    $null = Run-Git $seed @('commit', '-m', 'chore: fixture base')
    Assert-FixturePath $remote
    $null = Run-Git $seed @('remote', 'add', 'origin', $remote)
    $null = Run-Git $seed @('push', '-u', 'origin', 'staging')
    $null = Run-Git $testRoot @('clone', '-b', 'staging', $remote, $work)
    Configure-Fixture $work
    # Reject remote network URLs before any mutation; only fixture config is edited.
    $null = Run-Git $work @('remote', 'add', 'blocked', 'https://example.invalid/no-access.git')
    Expect-Block { Assert-LocalRemotes $work } 'fixture rejects a network remote'
    & git -C $work remote remove blocked
    if ($LASTEXITCODE -ne 0) { throw 'Cannot remove the deliberately invalid fixture remote.' }
    Write-Fixture $work 'untracked.txt' 'keep untracked'
    Write-Fixture $work 'cache.db' 'keep ignored'
    Run-Tool $work 'check-status'
    Push-Location $work
    try { Run-Tool $work 'check-status' } finally { Pop-Location }
    Check $true 'status works from root and application path with spaces'
    Run-Tool $work 'create-branch-from-staging' @{Issue='751';Type='maintenance';Description='probe'}
    $branch = '751-maintenance-probe'
    Check ((Run-Git $work @('branch', '--show-current')).Output[0] -eq $branch) 'type without template is preserved'
    Check ([IO.File]::ReadAllText((Join-Path $work 'cache.db')) -eq 'keep ignored') 'ignored data preserved'
    Check ([IO.File]::ReadAllText((Join-Path $work 'untracked.txt')) -eq 'keep untracked') 'untracked data preserved'
    . (Join-Path $work 'tools/git-common.ps1')
    Check ((Get-TaskBranchName '751' 'maintenance' 'probe' '751-explicit') -eq '751-explicit') 'explicit name accepted'
    foreach ($case in @(
        @{Issue='0';Type='maintenance';Description='probe'},
        @{Issue='x';Type='maintenance';Description='probe'},
        @{Issue='751';Type='maintenance';Description='Bad'},
        @{Issue='751';Type='maintenance';Description=''},
        @{Issue='751';Type='bad..type';Description='probe'},
        @{Issue='751';Type='maintenance';Description='probe';BranchName='bad ref'},
        @{Issue='751';Type='maintenance';Description='probe';BranchName='bad.lock'},
        @{Issue='751';Type='maintenance';Description='probe';BranchName='-option'},
        @{Issue='751';Type='maintenance';Description='probe';BranchName='main'},
        @{Issue='751';Type='maintenance';Description='probe';BranchName='staging'},
        @{Issue='751';Type='maintenance';Description='probe';BranchName='HEAD'}
    )) { Expect-Block { Get-TaskBranchName @case } ('invalid branch input ' + ($case.Values -join ',')) }
    Expect-Block { Invoke-Git -Arguments @('not-a-git-command') } 'native failures are propagated'
    Write-Fixture $work 'unrelated.txt' 'staged unrelated'
    $null = Run-Git $work @('add', '--', 'unrelated.txt')
    $indexBefore = (Run-Git $work @('diff', '--cached', '--binary')).Output -join "`n"
    Run-Tool $work 'create-empty-commit' @{Issue='751';ExpectedBranch=$branch}
    Check ((Run-Git $work @('diff', 'HEAD^', 'HEAD', '--name-only')).Output.Count -eq 0) 'opening commit contains no staged content'
    Check (((Run-Git $work @('diff', '--cached', '--binary')).Output -join "`n") -ceq $indexBefore) 'opening commit preserves staged work'
    Write-Fixture $work 'named file.txt' 'selected content'
    Run-Tool $work 'commit-changes' @{Message='chore: selected fixture';Paths=@('named file.txt');ExpectedBranch=$branch}
    Check (((Run-Git $work @('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD')).Output -join ',') -eq 'named file.txt') 'selective commit includes only named file with spaces'
    Check (((Run-Git $work @('diff', '--cached', '--binary')).Output -join "`n") -ceq $indexBefore) 'selective commit preserves unrelated index'
    $headBefore = (Run-Git $work @('rev-parse', 'HEAD')).Output[0]
    foreach ($badPath in @('.', 'tools', '*', '-A', '../escape', '.git/config')) {
        Expect-Block { Run-Tool $work 'commit-changes' @{Message='chore: rejected fixture';Paths=@($badPath);ExpectedBranch=$branch} } ('unsafe path rejected: '+$badPath)
    }
    Expect-Block { Run-Tool $work 'commit-changes' @{Message='chore: rejected fixture';Paths=@('missing-file');ExpectedBranch=$branch} } 'missing file fails without expanding scope'
    Expect-Block { Run-Tool $work 'create-empty-commit' @{Issue='751';ExpectedBranch='wrong-branch'} } 'unexpected commit branch blocked'
    Expect-Block { Run-Tool $work 'launch-push' @{ExpectedBranch='wrong-branch'} } 'unexpected push branch blocked'
    $hookDir = Join-Path $work 'fixture-hooks'
    $null = New-Item -ItemType Directory -Path $hookDir
    $null = Run-Git $work @('config', 'core.hooksPath', $hookDir)
    Write-Fixture $hookDir 'pre-commit' "#!/bin/sh`necho executed > hook-ran.txt`n"
    Expect-Block { Run-Tool $work 'create-empty-commit' @{Issue='751';ExpectedBranch=$branch} } 'active hook blocks empty commit'
    Expect-Block { Run-Tool $work 'commit-changes' @{Message='chore: blocked hook';Paths=@('named file.txt');ExpectedBranch=$branch} } 'active hook blocks selective commit'
    Check (-not (Test-Path -LiteralPath (Join-Path $work 'hook-ran.txt'))) 'hook was not executed'
    Check ((Run-Git $work @('config', '--get', 'core.hooksPath')).Output[0] -eq $hookDir) 'hook configuration was not disabled'
    Assert-FixturePath (Join-Path $hookDir 'pre-commit')
    Remove-Item -LiteralPath (Join-Path $hookDir 'pre-commit')
    Check ((Run-Git $work @('rev-parse', 'HEAD')).Output[0] -eq $headBefore) 'rejections preserve HEAD'
    Check (((Run-Git $work @('diff', '--cached', '--binary')).Output -join "`n") -ceq $indexBefore) 'rejections preserve staged content'
    $null = Run-Git $work @('commit', '-m', 'chore: finish fixture staged work')
    Run-Tool $work 'launch-push' @{ExpectedBranch=$branch}
    Check ((Run-Git $work @('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')).Output[0] -eq "origin/$branch") 'local push sets upstream'
    Check ((Run-Git $remote @('rev-parse', "refs/heads/$branch")).Output[0] -eq (Run-Git $work @('rev-parse', 'HEAD')).Output[0]) 'local remote matches published fixture commit'
    $existing = (Run-Git $work @('rev-parse', 'HEAD')).Output[0]
    Run-Tool $work 'create-branch-from-staging' @{Issue='751';Type='maintenance';Description='probe'}
    Check ((Run-Git $work @('rev-parse', 'HEAD')).Output[0] -eq $existing) 'existing local branch history retained'
    $null = Run-Git $seed @('branch', '752-chore-recovered', 'staging')
    $null = Run-Git $seed @('push', 'origin', '752-chore-recovered')
    Run-Tool $work 'create-branch-from-staging' @{Issue='752';Type='chore';Description='recovered'}
    Check ((Run-Git $work @('branch', '--show-current')).Output[0] -eq '752-chore-recovered') 'remote branch recovered'
    Run-Tool $work 'create-branch' @{Base=$branch;Issue='753';Type='fix';Description='other'}
    Check ((Run-Git $work @('rev-parse', 'HEAD')).Output[0] -eq $existing) 'explicit other base used'
    $null = Run-Git $work @('branch', 'main', 'staging')
    foreach ($protected in @('main','staging')) {
        $null = Run-Git $work @('switch', '--no-overwrite-ignore', $protected)
        Expect-Block { Run-Tool $work 'create-empty-commit' @{Issue='751';ExpectedBranch=$protected} } ("empty commit blocked on $protected")
        Expect-Block { Run-Tool $work 'commit-changes' @{Message='chore: blocked';Paths=@('tracked.txt');ExpectedBranch=$protected} } ("selective commit blocked on $protected")
        Expect-Block { Run-Tool $work 'launch-push' @{ExpectedBranch=$protected} } ("push blocked on $protected")
    }
    $null = Run-Git $work @('switch', '753-fix-other')
    Write-Fixture $seed 'tracked.txt' 'remote fast-forward'
    $null = Run-Git $seed @('add', '--', 'tracked.txt')
    $null = Run-Git $seed @('commit', '-m', 'chore: advance fixture staging')
    $null = Run-Git $seed @('push', 'origin', 'staging')
    Run-Tool $work 'pull-changes'
    Check ((Run-Git $work @('branch', '--show-current')).Output[0] -eq '753-fix-other') 'fast-forward preserves current branch'
    Check ((Run-Git $work @('rev-parse','staging')).Output[0] -eq (Run-Git $seed @('rev-parse','staging')).Output[0]) 'staging advanced by ancestry'
    Write-Fixture $work 'tracked.txt' 'local tracked change'
    Expect-Block { Run-Tool $work 'pull-changes' } 'tracked changes block updating'
    $null = Run-Git $work @('restore','--source=HEAD','--worktree','--','tracked.txt')
    Write-Fixture (Join-Path $work '.git') 'MERGE_HEAD' $existing
    Expect-Block { Run-Tool $work 'check-status' } 'pending Git operation blocked'
    Assert-FixturePath (Join-Path $work '.git/MERGE_HEAD')
    Remove-Item -LiteralPath (Join-Path $work '.git/MERGE_HEAD')
    Write-Fixture $seed 'untracked.txt' 'remote tracked collision'
    $null = Run-Git $seed @('add','--','untracked.txt')
    $null = Run-Git $seed @('commit','-m','chore: fixture untracked collision')
    $null = Run-Git $seed @('push','origin','staging')
    Expect-Block { Run-Tool $work 'create-branch-from-staging' @{Issue='754';Type='chore';Description='collision'} } 'untracked collision blocks switching'
    Check ([IO.File]::ReadAllText((Join-Path $work 'untracked.txt')) -eq 'keep untracked') 'untracked collision preserves bytes'
    Write-Fixture $seed 'cache.db' 'remote ignored collision'
    $null = Run-Git $seed @('add','-f','--','cache.db')
    $null = Run-Git $seed @('commit','-m','chore: fixture ignored collision')
    $null = Run-Git $seed @('push','origin','staging')
    Expect-Block { Run-Tool $work 'create-branch-from-staging' @{Issue='755';Type='chore';Description='collision'} } 'ignored collision blocks switching'
    Check ([IO.File]::ReadAllText((Join-Path $work 'cache.db')) -eq 'keep ignored') 'ignored collision preserves bytes'
    # Independent clean clone isolates worktree and divergence scenarios.
    $clean = Join-Path $testRoot 'clean'
    $null = Run-Git $testRoot @('clone','-b','staging',$remote,$clean)
    Configure-Fixture $clean
    Run-Tool $clean 'create-branch-from-staging' @{Issue='756';Type='chore';Description='worktree'}
    $otherTree = Join-Path $testRoot 'other worktree'
    $null = Run-Git $clean @('worktree','add',$otherTree,'staging')
    Write-Fixture $seed 'tracked.txt' 'advance with other worktree'
    $null = Run-Git $seed @('add','--','tracked.txt')
    $null = Run-Git $seed @('commit','-m','chore: fixture worktree advance')
    $null = Run-Git $seed @('push','origin','staging')
    $treeHead=(Run-Git $otherTree @('rev-parse','HEAD')).Output[0]
    Expect-Block { Run-Tool $clean 'pull-changes' } 'staging in another worktree blocks update'
    Check ((Run-Git $otherTree @('rev-parse','HEAD')).Output[0] -eq $treeHead) 'other worktree preserved'
    $diverged=Join-Path $testRoot 'diverged'
    $null=Run-Git $testRoot @('clone','-b','staging',$remote,$diverged)
    Configure-Fixture $diverged
    Write-Fixture $diverged 'local.txt' 'local divergence'
    $null=Run-Git $diverged @('add','--','local.txt')
    $null=Run-Git $diverged @('commit','-m','chore: local fixture divergence')
    Write-Fixture $seed 'tracked.txt' 'remote divergence'
    $null=Run-Git $seed @('add','--','tracked.txt')
    $null=Run-Git $seed @('commit','-m','chore: remote fixture divergence')
    $null=Run-Git $seed @('push','origin','staging')
    $divergedHead=(Run-Git $diverged @('rev-parse','HEAD')).Output[0]
    Expect-Block { Run-Tool $diverged 'pull-changes' } 'divergent staging is rejected'
    Check ((Run-Git $diverged @('rev-parse','HEAD')).Output[0] -eq $divergedHead) 'divergent commits retained'
    $peer=Join-Path $testRoot 'peer'
    $null=Run-Git $testRoot @('clone','-b',$branch,$remote,$peer)
    Configure-Fixture $peer
    Write-Fixture $peer 'peer.txt' 'peer ahead'
    $null=Run-Git $peer @('add','--','peer.txt')
    $null=Run-Git $peer @('commit','-m','chore: remote fixture branch ahead')
    $null=Run-Git $peer @('push','origin',$branch)
    $null=Run-Git $work @('switch',$branch)
    $beforeRejectedPush=(Run-Git $work @('rev-parse','HEAD')).Output[0]
    Expect-Block { Run-Tool $work 'launch-push' @{ExpectedBranch=$branch} } 'non-fast-forward push is rejected'
    Check ((Run-Git $work @('rev-parse','HEAD')).Output[0] -eq $beforeRejectedPush) 'rejected push does not rewrite history'
    Write-Output "RESULT: $count checks passed. Fixture retained: $testRoot"
}
finally {
    foreach ($name in $savedEnvironment.Keys) {
        [Environment]::SetEnvironmentVariable($name, $savedEnvironment[$name], 'Process')
    }
}
