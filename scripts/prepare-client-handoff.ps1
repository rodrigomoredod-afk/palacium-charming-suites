param(
  [switch]$Execute
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$targets = @(
  ".cursor",
  "docs/prompts",
  "docs/sales"
)

Write-Host "Client handoff cleanup preview" -ForegroundColor Cyan
Write-Host "Repository: $repoRoot"
Write-Host ""

foreach ($target in $targets) {
  if (Test-Path $target) {
    Write-Host "[FOUND] $target" -ForegroundColor Yellow
  } else {
    Write-Host "[MISSING] $target" -ForegroundColor DarkGray
  }
}

Write-Host ""
if (-not $Execute) {
  Write-Host "Dry run only. No files were removed." -ForegroundColor Green
  Write-Host "Run with -Execute to apply cleanup." -ForegroundColor Green
  exit 0
}

Write-Host "Executing cleanup..." -ForegroundColor Red
foreach ($target in $targets) {
  if (Test-Path $target) {
    Remove-Item $target -Recurse -Force
    Write-Host "[REMOVED] $target" -ForegroundColor Red
  }
}

Write-Host ""
Write-Host "Cleanup complete. Next steps:" -ForegroundColor Cyan
Write-Host "1) Review git status"
Write-Host "2) Run npm run build"
Write-Host "3) Validate handoff checklist in docs/runbooks/handoff-cleanup-checklist.md"
