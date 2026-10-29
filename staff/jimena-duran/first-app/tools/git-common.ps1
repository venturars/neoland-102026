# Shared native-command and repository checks for Windows PowerShell 5.1.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Git is not available. Locate its existing installation first.'
}
$script:repositoryRoot = $null

function Invoke-Git {
    param([Parameter(Mandatory = $true)][string[]]$Arguments, [switch]$AllowFailure)
    $errorFile = [IO.Path]::GetTempFileName()
    $previousPreference = $ErrorActionPreference
    try {
        $commandArguments = @()
        if ($script:repositoryRoot) {
            $commandArguments += @('-C', $script:repositoryRoot)
        }
        $commandArguments += $Arguments
        $ErrorActionPreference = 'Continue'
        $output = @(& git @commandArguments 2> $errorFile)
        $code = $LASTEXITCODE
        $ErrorActionPreference = $previousPreference
        $errorText = [IO.File]::ReadAllText($errorFile)
        if ($code -ne 0 -and -not $AllowFailure) {
            throw "Git failed ($code): git $($Arguments -join ' ')`n$errorText"
        }
        if ($code -eq 0 -and $errorText) {
            Write-Verbose $errorText
        }
        return [pscustomobject]@{ Output = $output; ExitCode = $code; ErrorText = $errorText }
    }
    finally {
        $ErrorActionPreference = $previousPreference
        Remove-Item -LiteralPath $errorFile -ErrorAction SilentlyContinue
    }
}

$rootResult = Invoke-Git -Arguments @('-C', $PSScriptRoot, 'rev-parse', '--show-toplevel')
$script:repositoryRoot = [IO.Path]::GetFullPath([string]$rootResult.Output[0])

function Get-CurrentBranch {
    $result = Invoke-Git -Arguments @('symbolic-ref', '--quiet', '--short', 'HEAD') -AllowFailure
    if ($result.ExitCode -ne 0) {
        throw 'Detached HEAD is not supported. Select an authorized branch first.'
    }
    return [string]$result.Output[0]
}

function Assert-NoGitOperation {
    $directoryResult = Invoke-Git -Arguments @('rev-parse', '--absolute-git-dir')
    $gitDirectory = [string]$directoryResult.Output[0]
    foreach ($marker in @('MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply', 'BISECT_LOG')) {
        $markerPath = Join-Path $gitDirectory $marker
        if (Test-Path -LiteralPath $markerPath) {
            throw "Git operation in progress ($marker). Report it before resolving."
        }
    }
    $unmerged = Invoke-Git -Arguments @('ls-files', '--unmerged')
    if ($unmerged.Output.Count -gt 0) {
        throw 'Unmerged files exist. Report conflicts before resolving.'
    }
}

function Assert-CleanWorktree {
    Assert-NoGitOperation
    $status = Invoke-Git -Arguments @('status', '--porcelain=v1', '--untracked-files=all')
    if ($status.Output.Count -gt 0) {
        throw 'Local changes exist. Preserve them and report the blocker before switching or updating branches.'
    }
}

function Assert-ExpectedBranch {
    param([Parameter(Mandatory = $true)][string]$ExpectedBranch)
    Assert-NoGitOperation
    $currentBranch = Get-CurrentBranch
    if ($currentBranch -in @('main', 'staging')) {
        throw "Commits and publishing are blocked on $currentBranch."
    }
    if ($currentBranch -cne $ExpectedBranch) {
        throw "Expected branch '$ExpectedBranch', found '$currentBranch'."
    }
}

function Assert-NoCommitHooks {
    # Hooks are executable project/user code and may add unrelated files or data.
    # Stop for human review instead of disabling hooks or running them silently.
    $configured = Invoke-Git -Arguments @('config', '--path', '--get', 'core.hooksPath') -AllowFailure
    if ($configured.ExitCode -eq 0) {
        $hooksPath = [string]$configured.Output[0]
    }
    elseif ($configured.ExitCode -eq 1) {
        $hooksPath = [string](Invoke-Git -Arguments @('rev-parse', '--git-path', 'hooks')).Output[0]
    }
    else {
        throw "Cannot inspect Git hooks: $($configured.ErrorText)"
    }
    if (-not [IO.Path]::IsPathRooted($hooksPath)) {
        $hooksPath = Join-Path $script:repositoryRoot $hooksPath
    }
    foreach ($hookName in @('pre-commit', 'prepare-commit-msg', 'commit-msg', 'post-commit', 'post-index-change', 'reference-transaction')) {
        if (Test-Path -LiteralPath (Join-Path $hooksPath $hookName)) {
            throw "Git hook '$hookName' requires review before an automated commit. No hook was disabled or executed."
        }
    }
}

function Test-GitRef {
    param([Parameter(Mandatory = $true)][string]$Reference)
    $result = Invoke-Git -Arguments @('show-ref', '--verify', '--quiet', $Reference) -AllowFailure
    if ($result.ExitCode -notin @(0, 1)) {
        throw "Cannot inspect reference $Reference. $($result.ErrorText)"
    }
    return $result.ExitCode -eq 0
}

function Get-TaskBranchName {
    param([string]$Issue, [string]$Type, [string]$Description, [string]$BranchName)
    if ($Issue -notmatch '^[1-9][0-9]*$') {
        throw 'Issue must be a positive issue number.'
    }
    if ($Type -notin @('feat', 'fix', 'docs', 'refactor', 'test', 'chore')) {
        throw 'Unsupported conventional commit type.'
    }
    if ($Description -cnotmatch '^[a-z0-9]+(-[a-z0-9]+)*$') {
        throw 'Description must be lowercase kebab-case.'
    }
    $taskBranch = "$Issue-$Type-$Description"
    if ($BranchName) {
        $taskBranch = $BranchName
    }
    if ($taskBranch.StartsWith('-') -or $taskBranch -in @('main', 'staging', 'HEAD')) {
        throw 'Invalid task branch.'
    }
    $null = Invoke-Git -Arguments @('check-ref-format', '--branch', $taskBranch)
    return $taskBranch
}
