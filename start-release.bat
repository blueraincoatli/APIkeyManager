@echo off
REM API Key Manager Release Launcher
REM 确保从正确的工作目录启动

echo Starting API Key Manager (Release)...

REM 切换到项目根目录
cd /d "%~dp0"

REM 检查可执行文件是否存在
if not exist "src-tauri\target\release\api-key-manager.exe" (
    echo Error: Release executable not found!
    echo Please run "cargo build --release" in src-tauri directory first.
    pause
    exit /b 1
)

REM 启动应用
echo Launching from: %CD%
start "" "src-tauri\target\release\api-key-manager.exe"

echo Release version started successfully!
