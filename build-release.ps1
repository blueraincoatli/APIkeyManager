# API Key Manager Release Build Script
# 构建并打包最终发布版本

param(
    [string]$Version = "1.0.0",
    [string]$OutputDir = ".\release-package"
)

Write-Host "🚀 Building API Key Manager Release v$Version" -ForegroundColor Green

# 1. 清理之前的构建
Write-Host "📁 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path $OutputDir) {
    Remove-Item $OutputDir -Recurse -Force
}
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

# 2. 构建Release版本
Write-Host "🔨 Building release version..." -ForegroundColor Yellow
Set-Location "src-tauri"
cargo build --release
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ".."

# 3. 复制可执行文件
Write-Host "📦 Packaging files..." -ForegroundColor Yellow
$exePath = "src-tauri\target\release\api-key-manager.exe"
$targetPath = "$OutputDir\api-key-manager.exe"

if (Test-Path $exePath) {
    Copy-Item $exePath -Destination $targetPath
    Write-Host "✅ Executable copied: $(Get-Item $targetPath | Select-Object -ExpandProperty Length) bytes" -ForegroundColor Green
} else {
    Write-Host "❌ Executable not found!" -ForegroundColor Red
    exit 1
}

# 4. 创建README
Write-Host "📝 Creating documentation..." -ForegroundColor Yellow
$readmeContent = @"
# API Key Manager v$Version

## 简介
API Key Manager 是一个安全、高效的API密钥管理工具，支持多平台API密钥的存储、搜索和管理。

## 功能特性
- 🔐 安全的本地加密存储
- 🔍 快速搜索和过滤
- 📋 一键复制到剪贴板
- 🏷️ 分组和标签管理
- ⌨️ 全局快捷键支持 (Ctrl+Shift+K)
- 🎨 现代化的用户界面

## 系统要求
- Windows 10 (1903+) 或 Windows 11
- WebView2 运行时（Windows 11自带，Windows 10会自动下载）

## 安装说明
1. 下载 api-key-manager.exe
2. 双击运行即可，无需安装
3. 首次运行会在 %APPDATA% 目录创建数据库文件

## 使用方法
1. 按 Ctrl+Shift+K 唤出浮动工具条
2. 在搜索框中输入关键词搜索API密钥
3. 点击搜索结果即可复制到剪贴板
4. 点击 "+" 按钮添加新的API密钥

## 数据存储
- 数据库文件位置: %APPDATA%\com.hongyu-li.api-key-manager\api_keys.db
- 所有数据均在本地加密存储，不会上传到任何服务器

## 技术支持
如有问题，请联系开发者或查看项目文档。

---
构建时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
版本: v$Version
"@

$readmeContent | Out-File -FilePath "$OutputDir\README.md" -Encoding UTF8

# 5. 创建版本信息
$versionInfo = @{
    version = $Version
    buildTime = Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ'
    platform = "Windows"
    architecture = "x64"
    fileSize = (Get-Item $targetPath).Length
} | ConvertTo-Json -Depth 2

$versionInfo | Out-File -FilePath "$OutputDir\version.json" -Encoding UTF8

# 6. 显示构建结果
Write-Host "`n🎉 Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Output directory: $OutputDir" -ForegroundColor Cyan
Write-Host "📊 Package contents:" -ForegroundColor Cyan

Get-ChildItem $OutputDir | ForEach-Object {
    $size = if ($_.PSIsContainer) { "DIR" } else { "{0:N0} bytes" -f $_.Length }
    Write-Host "   📄 $($_.Name) - $size" -ForegroundColor White
}

$totalSize = (Get-ChildItem $OutputDir -File | Measure-Object -Property Length -Sum).Sum
Write-Host "`n📦 Total package size: $($totalSize / 1MB | ForEach-Object { '{0:N2} MB' -f $_ })" -ForegroundColor Green

Write-Host "`n🚀 Ready for distribution!" -ForegroundColor Green
Write-Host "💡 You can now distribute the entire '$OutputDir' folder or just the api-key-manager.exe file." -ForegroundColor Yellow
