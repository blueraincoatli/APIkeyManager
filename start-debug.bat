@echo off
REM API Key Manager Debug Launcher

echo Starting API Key Manager (Debug)...

REM Change to project root directory
cd /d "%~dp0"

REM Check if dist directory exists
if not exist "dist" (
    echo Error: dist directory not found!
    echo Please run "npm run build" first.
    pause
    exit /b 1
)

REM Check if executable exists
if not exist "src-tauri\target\debug\api-key-manager.exe" (
    echo Error: Debug executable not found!
    echo Please run "cargo build" in src-tauri directory first.
    pause
    exit /b 1
)

REM Launch application
echo Launching from: %CD%
start "" "src-tauri\target\debug\api-key-manager.exe"

echo Debug version started successfully!
