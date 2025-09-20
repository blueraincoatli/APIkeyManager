# API Key Manager 启动脚本
# 自动处理权限问题并启动应用程序

Write-Host "正在启动 API Key Manager..." -ForegroundColor Green

# 检查是否以管理员权限运行
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "检测到需要管理员权限，正在重新启动..." -ForegroundColor Yellow
    
    # 重新以管理员权限启动此脚本
    Start-Process PowerShell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
    exit
}

Write-Host "以管理员权限运行中..." -ForegroundColor Green

# 切换到项目目录
$projectPath = Split-Path -Parent $PSCommandPath
$tauriPath = Join-Path $projectPath "src-tauri"

if (-not (Test-Path $tauriPath)) {
    Write-Host "错误：找不到 src-tauri 目录" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Set-Location $tauriPath

# 检查可执行文件是否存在
$exePath = ".\target\debug\api-key-manager.exe"
if (-not (Test-Path $exePath)) {
    Write-Host "可执行文件不存在，正在编译..." -ForegroundColor Yellow
    cargo build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "编译失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
}

# 检查是否已有进程在运行
$existingProcess = Get-Process -Name "api-key-manager" -ErrorAction SilentlyContinue
if ($existingProcess) {
    Write-Host "检测到程序已在运行，正在终止现有进程..." -ForegroundColor Yellow
    $existingProcess | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# 启动应用程序
Write-Host "正在启动应用程序..." -ForegroundColor Green
try {
    Start-Process -FilePath $exePath -WorkingDirectory $tauriPath
    Write-Host "应用程序启动成功！" -ForegroundColor Green
    
    # 等待几秒钟确保程序启动
    Start-Sleep -Seconds 3
    
    # 检查进程是否成功启动
    $newProcess = Get-Process -Name "api-key-manager" -ErrorAction SilentlyContinue
    if ($newProcess) {
        Write-Host "程序正在运行中，进程ID: $($newProcess.Id)" -ForegroundColor Green
    } else {
        Write-Host "警告：无法确认程序是否成功启动" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "启动失败：$($_.Exception.Message)" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "启动完成！" -ForegroundColor Green
Read-Host "按任意键退出此窗口"
