@echo off
cd /d "%~dp0\.."
title Palacium - diagnose (read the text below)
color 0A
echo.
echo ============================================================
echo   FOLDER (must end with palacium-charming-suites):
echo   %CD%
echo ============================================================
echo.

if exist "package.json" (
  echo [OK] package.json found.
) else (
  echo [FAIL] package.json NOT here — wrong folder or repo not cloned.
)
echo.

if exist "scripts\seed-admin.mjs" (
  echo [OK] scripts\seed-admin.mjs found.
) else (
  echo [FAIL] seed script missing.
)
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [FAIL] node not in PATH. Install Node.js and reopen this window.
) else (
  echo [OK] Node:
  where node
  node -v
)
echo.
echo ============================================================
echo   NEXT: use Cursor Terminal menu - New Terminal, then run:
echo   node scripts\seed-admin.mjs admin YourPassword superadmin
echo ============================================================
echo.
pause
