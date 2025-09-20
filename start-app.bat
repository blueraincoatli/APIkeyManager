@echo off
echo 正在启动 API Key Manager...

cd /d "%~dp0src-tauri"

if not exist "target\debug\api-key-manager.exe" (
    echo 可执行文件不存在，正在编译...
    cargo build
    if errorlevel 1 (
        echo 编译失败
        pause
        exit /b 1
    )
)

echo 正在启动应用程序...
start "" "target\debug\api-key-manager.exe"

echo 应用程序已启动！
timeout /t 3 /nobreak >nul

echo 完成！
pause
